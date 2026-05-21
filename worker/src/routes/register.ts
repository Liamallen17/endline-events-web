import { Hono } from 'hono';
import type { Env, RegisterTeamRequest } from '../types';
import { Database } from '../lib/db';
import { createStripeClient, createCheckoutSession } from '../lib/stripe';
import {
  ValidationError,
  validateAthlete,
  validateTeamSize,
  validateUniqueEmails,
  ensureCaptain,
} from '../lib/validation';

const register = new Hono<{ Bindings: Env }>();

// POST /api/register - Create team and start checkout
register.post('/', async (c) => {
  const db = new Database(c.env.DB);
  const stripe = createStripeClient(c.env.STRIPE_SECRET_KEY);

  let body: RegisterTeamRequest;
  try {
    body = await c.req.json<RegisterTeamRequest>();
  } catch {
    return c.json({ error: 'Invalid JSON body' }, 400);
  }

  const { priceId, teamName, athletes: rawAthletes } = body;

  if (!priceId || typeof priceId !== 'string') {
    return c.json({ error: 'priceId is required', code: 'MISSING_PRICE' }, 400);
  }

  // Resolve price → product → event. Each lookup gives a specific error so
  // misconfiguration in Stripe (e.g. forgetting metadata.event_id) is debuggable.
  const price = await db.getStripePrice(priceId);
  if (!price) {
    return c.json({ error: 'Price not found', code: 'PRICE_NOT_FOUND' }, 404);
  }
  if (!price.active) {
    return c.json({ error: 'Price is no longer available', code: 'PRICE_INACTIVE' }, 400);
  }

  const product = await db.getStripeProduct(price.product_id);
  if (!product || !product.active) {
    return c.json({ error: 'Product is no longer available', code: 'PRODUCT_INACTIVE' }, 400);
  }
  if (!product.event_id) {
    return c.json(
      { error: 'Price is not linked to an event', code: 'PRICE_NOT_LINKED' },
      400
    );
  }

  const event = await db.getEvent(product.event_id);
  if (!event || !event.is_published) {
    return c.json({ error: 'Event not found', code: 'EVENT_NOT_FOUND' }, 404);
  }
  if (!(await db.isRegistrationOpen(event))) {
    return c.json(
      { error: 'Registration is not open for this event', code: 'REGISTRATION_CLOSED' },
      400
    );
  }

  // Validate athletes
  if (!Array.isArray(rawAthletes) || rawAthletes.length === 0) {
    return c.json({ error: 'At least one athlete is required', code: 'NO_ATHLETES' }, 400);
  }

  try {
    const athletes = rawAthletes.map(validateAthlete);
    validateTeamSize(athletes, price);
    validateUniqueEmails(athletes);
    const athletesWithCaptain = ensureCaptain(athletes);

    // Create team and members atomically (athletes upserted, team created, members linked)
    const teamId = crypto.randomUUID();
    await db.createTeamWithMembers(teamId, event.id, price.id, teamName, athletesWithCaptain);

    // Open Stripe checkout for the specific price the team picked
    const session = await createCheckoutSession(stripe, {
      priceId: price.id,
      eventId: event.id,
      teamId,
      siteUrl: c.env.SITE_URL,
    });

    // Store session ID for webhook reconciliation
    await db.updateTeamStripeSession(teamId, session.id);

    return c.json({
      url: session.url,
      teamId,
    });
  } catch (err) {
    if (err instanceof ValidationError) {
      return c.json({ error: err.message, code: err.code }, 400);
    }
    throw err;
  }
});

// GET /api/register/:teamId - Get team registration status
register.get('/:teamId', async (c) => {
  const db = new Database(c.env.DB);
  const team = await db.getTeam(c.req.param('teamId'));

  if (!team) {
    return c.json({ error: 'Team not found' }, 404);
  }

  const event = await db.getEvent(team.event_id);
  const members = await db.getTeamMembers(team.id);
  const price = team.stripe_price_id ? await db.getStripePrice(team.stripe_price_id) : null;

  return c.json({
    team: {
      id: team.id,
      name: team.name,
      paymentStatus: team.payment_status,
      paidAt: team.paid_at,
    },
    event: event
      ? {
          id: event.id,
          name: event.name,
          eventDate: event.event_date,
        }
      : null,
    price: price
      ? {
          id: price.id,
          nickname: price.nickname,
          unitAmount: price.unit_amount,
          currency: price.currency,
        }
      : null,
    members: members.map((m) => ({
      name: m.name,
      email: m.athlete_email,
      gender: m.gender,
      runClub: m.run_club,
      role: m.role,
    })),
  });
});

export default register;
