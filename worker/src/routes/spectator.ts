import { Hono } from 'hono';
import type { Env, SpectatorCheckoutRequest } from '../types';
import { Database } from '../lib/db';
import { createStripeClient, createCheckoutSession } from '../lib/stripe';
import { priceCategoryKind } from '../lib/prices';
import { ValidationError, validateSpectatorPass, validateAddOns } from '../lib/validation';

const spectator = new Hono<{ Bindings: Env }>();

// POST /api/spectator-checkout - Create spectator pass and start checkout
spectator.post('/', async (c) => {
  const db = new Database(c.env.DB);
  const stripe = createStripeClient(c.env.STRIPE_SECRET_KEY);

  let body: SpectatorCheckoutRequest;
  try {
    body = await c.req.json<SpectatorCheckoutRequest>();
  } catch {
    return c.json({ error: 'Invalid JSON body' }, 400);
  }

  const { priceId, spectator: rawSpectator, addOns: rawAddOns, vehicleReg: rawVehicleReg } = body;

  if (!priceId || typeof priceId !== 'string') {
    return c.json({ error: 'priceId is required', code: 'MISSING_PRICE' }, 400);
  }

  try {
    const price = await db.getStripePrice(priceId);
    if (!price) {
      return c.json({ error: 'Price not found', code: 'PRICE_NOT_FOUND' }, 404);
    }
    if (!price.active) {
      return c.json({ error: 'Price is no longer available', code: 'PRICE_INACTIVE' }, 400);
    }
    if (priceCategoryKind(price) !== 'spectator') {
      return c.json(
        { error: 'This price is not a spectator pass', code: 'PRICE_WRONG_KIND' },
        400
      );
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
        { error: 'Spectator passes are not currently on sale', code: 'REGISTRATION_CLOSED' },
        400
      );
    }

    const spectatorInput = validateSpectatorPass(rawSpectator);

    const addOns = validateAddOns(rawAddOns);
    const resolvedAddOns: Array<{ priceId: string; quantity: number }> = [];
    for (const addon of addOns) {
      const addonPrice = await db.getStripePrice(addon.priceId);
      if (!addonPrice || !addonPrice.active) {
        return c.json(
          { error: `Add-on price ${addon.priceId} is not available`, code: 'ADDON_INACTIVE' },
          400
        );
      }
      if (priceCategoryKind(addonPrice) !== 'addon') {
        return c.json(
          { error: `Price ${addon.priceId} is not an add-on`, code: 'ADDON_WRONG_KIND' },
          400
        );
      }
      const addonProduct = await db.getStripeProduct(addonPrice.product_id);
      if (!addonProduct || addonProduct.event_id !== event.id) {
        return c.json(
          { error: `Add-on ${addon.priceId} is not for this event`, code: 'ADDON_WRONG_EVENT' },
          400
        );
      }
      resolvedAddOns.push(addon);
    }

    const vehicleReg = typeof rawVehicleReg === 'string' ? rawVehicleReg.trim() || undefined : undefined;

    const passId = crypto.randomUUID();
    await db.createSpectatorPass({
      passId,
      eventId: event.id,
      priceId: price.id,
      spectator: spectatorInput,
      vehicleReg,
    });

    const session = await createCheckoutSession(stripe, {
      lineItems: [
        { priceId: price.id, quantity: 1 },
        ...resolvedAddOns,
      ],
      eventId: event.id,
      passId,
      siteUrl: c.env.SITE_URL,
    });

    await db.updateSpectatorPassStripeSession(passId, session.id);

    return c.json({ url: session.url, passId });
  } catch (err) {
    if (err instanceof ValidationError) {
      return c.json({ error: err.message, code: err.code }, 400);
    }
    throw err;
  }
});

// GET /api/spectator-checkout/:passId - Look up a spectator pass status
spectator.get('/:passId', async (c) => {
  const db = new Database(c.env.DB);
  const pass = await db.getSpectatorPass(c.req.param('passId'));

  if (!pass) {
    return c.json({ error: 'Spectator pass not found' }, 404);
  }

  const event = await db.getEvent(pass.event_id);
  const price = pass.stripe_price_id ? await db.getStripePrice(pass.stripe_price_id) : null;

  return c.json({
    pass: {
      id: pass.id,
      paymentStatus: pass.payment_status,
      paidAt: pass.paid_at,
      firstName: pass.first_name,
      lastName: pass.last_name,
      email: pass.email,
      phone: pass.phone,
      vehicleReg: pass.vehicle_reg,
    },
    event: event
      ? { id: event.id, name: event.name, eventDate: event.event_date }
      : null,
    price: price
      ? {
          id: price.id,
          nickname: price.nickname,
          unitAmount: price.unit_amount,
          currency: price.currency,
        }
      : null,
  });
});

export default spectator;
