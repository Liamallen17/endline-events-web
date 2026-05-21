import Stripe from 'stripe';

export function createStripeClient(secretKey: string): Stripe {
  return new Stripe(secretKey, {
    apiVersion: '2025-02-24.acacia',
    httpClient: Stripe.createFetchHttpClient(),
  });
}

export async function createCheckoutSession(
  stripe: Stripe,
  options: {
    priceId: string;
    eventId: string;
    teamId: string;
    siteUrl: string;
  }
): Promise<Stripe.Checkout.Session> {
  return stripe.checkout.sessions.create({
    line_items: [
      {
        price: options.priceId,
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${options.siteUrl}/success?team=${options.teamId}`,
    cancel_url: `${options.siteUrl}/event/${options.eventId}`,
    allow_promotion_codes: true,
    metadata: {
      team_id: options.teamId,
      event_id: options.eventId,
      price_id: options.priceId,
    },
  });
}

export async function verifyWebhookSignature(
  stripe: Stripe,
  payload: string,
  signature: string,
  secret: string
): Promise<Stripe.Event> {
  return stripe.webhooks.constructEventAsync(payload, signature, secret);
}
