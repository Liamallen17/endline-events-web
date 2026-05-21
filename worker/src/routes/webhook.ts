import { Hono } from 'hono';
import type Stripe from 'stripe';
import type { Env } from '../types';
import { Database } from '../lib/db';
import { createStripeClient, verifyWebhookSignature } from '../lib/stripe';

const webhook = new Hono<{ Bindings: Env }>();

// POST /api/webhook/stripe - Handle Stripe events
webhook.post('/stripe', async (c) => {
  const db = new Database(c.env.DB);
  const stripe = createStripeClient(c.env.STRIPE_SECRET_KEY);

  const signature = c.req.header('stripe-signature');
  if (!signature) {
    return c.json({ error: 'Missing signature' }, 400);
  }

  const body = await c.req.text();

  let event: Stripe.Event;
  try {
    event = await verifyWebhookSignature(stripe, body, signature, c.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return c.json({ error: 'Invalid signature' }, 400);
  }

  // All handlers below are idempotent (upserts on Stripe id, status setters
  // that are safe to repeat). On failure we return 500 so Stripe retries;
  // on success we record the event id so we can tell duplicates from new traffic.
  try {
    switch (event.type) {
      case 'product.created':
      case 'product.updated':
        await handleProductUpsert(event.data.object as Stripe.Product, db);
        break;

      case 'product.deleted':
        await db.deactivateStripeProduct((event.data.object as Stripe.Product).id);
        break;

      case 'price.created':
      case 'price.updated':
        await handlePriceUpsert(event.data.object as Stripe.Price, db);
        break;

      case 'price.deleted':
        await db.deactivateStripePrice((event.data.object as Stripe.Price).id);
        break;

      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const teamId = session.metadata?.team_id;
        if (teamId) {
          await db.markTeamPaid(teamId);
          console.log(`Team ${teamId} marked as paid`);
          // TODO: send confirmation email (Resend/Postmark/SendGrid)
        }
        break;
      }

      case 'checkout.session.expired': {
        const session = event.data.object as Stripe.Checkout.Session;
        const teamId = session.metadata?.team_id;
        if (teamId) {
          await db.markTeamFailed(teamId);
          console.log(`Team ${teamId} marked as failed (session expired)`);
        }
        break;
      }

      case 'charge.refunded': {
        // The charge object doesn't carry team_id directly; resolve via the
        // checkout session that created the underlying payment intent.
        const charge = event.data.object as Stripe.Charge;
        const paymentIntent = typeof charge.payment_intent === 'string'
          ? charge.payment_intent
          : charge.payment_intent?.id;
        if (!paymentIntent) {
          console.warn(`Refund for charge ${charge.id} has no payment_intent`);
          break;
        }
        const sessions = await stripe.checkout.sessions.list({
          payment_intent: paymentIntent,
          limit: 1,
        });
        const teamId = sessions.data[0]?.metadata?.team_id;
        if (teamId) {
          await db.markTeamRefunded(teamId);
          console.log(`Team ${teamId} marked as refunded`);
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  } catch (err) {
    // Most common cause of failure here is a price.* arriving before its
    // product.* (FK violation on stripe_prices.product_id). Returning 500
    // makes Stripe retry, by which time the product event has typically landed.
    console.error(`Failed to process event ${event.id} (${event.type}):`, err);
    return c.json({ error: 'Processing failed' }, 500);
  }

  const wasNew = await db.recordStripeEvent(event.id, event.type);
  if (!wasNew) {
    console.log(`Event ${event.id} was a duplicate delivery`);
  }

  return c.json({ received: true });
});

async function handleProductUpsert(product: Stripe.Product, db: Database): Promise<void> {
  // Stripe is the link source: products opt in to an event by setting
  // metadata.event_id = "<event-slug>". If the slug doesn't match an event row
  // yet, store the product with event_id=NULL and reconcile on a later update.
  const slug = product.metadata?.event_id ?? null;
  let resolvedEventId: string | null = null;
  if (slug) {
    const event = await db.getEvent(slug);
    if (event) {
      resolvedEventId = event.id;
    } else {
      console.warn(`Product ${product.id} has metadata.event_id="${slug}" but no matching event`);
    }
  }

  await db.upsertStripeProduct({
    id: product.id,
    name: product.name,
    description: product.description,
    active: product.active,
    eventId: resolvedEventId,
    metadata: (product.metadata ?? null) as Record<string, string> | null,
  });
}

async function handlePriceUpsert(price: Stripe.Price, db: Database): Promise<void> {
  const productId = typeof price.product === 'string' ? price.product : price.product.id;

  await db.upsertStripePrice({
    id: price.id,
    productId,
    nickname: price.nickname,
    unitAmount: price.unit_amount,
    currency: price.currency,
    active: price.active,
    minTeamSize: parseTeamSize(price.metadata?.min_team_size),
    maxTeamSize: parseTeamSize(price.metadata?.max_team_size),
    metadata: (price.metadata ?? null) as Record<string, string> | null,
  });
}

function parseTeamSize(raw: string | undefined | null): number | null {
  if (!raw) return null;
  const n = parseInt(raw, 10);
  return Number.isFinite(n) && n > 0 ? n : null;
}

export default webhook;
