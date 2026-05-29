import Stripe from 'stripe';

export function createStripeClient(secretKey: string): Stripe {
  return new Stripe(secretKey, {
    apiVersion: '2025-02-24.acacia',
    httpClient: Stripe.createFetchHttpClient(),
  });
}

// One checkout session, possibly multiple line items (the primary ticket + any
// add-ons like campervan). Exactly one of teamId or passId must be set —
// the webhook reads metadata.team_id or metadata.pass_id to know which
// record to update on payment events.
export async function createCheckoutSession(
  stripe: Stripe,
  options: {
    lineItems: Array<{ priceId: string; quantity: number }>;
    eventId: string;
    teamId?: string;
    passId?: string;
    siteUrl: string;
  }
): Promise<Stripe.Checkout.Session> {
  const metadata: Record<string, string> = {
    event_id: options.eventId,
  };
  if (options.teamId) metadata.team_id = options.teamId;
  if (options.passId) metadata.pass_id = options.passId;

  const recordRef = options.teamId ?? options.passId;
  const successPath = options.teamId ? `success?team=${recordRef}` : `success?pass=${recordRef}`;

  return stripe.checkout.sessions.create({
    line_items: options.lineItems.map((li) => ({ price: li.priceId, quantity: li.quantity })),
    mode: 'payment',
    success_url: `${options.siteUrl}/${successPath}`,
    // Frontend doesn't have a per-event slug route — send users to the home
    // page on cancel rather than a 404. They can pick the event again from there.
    cancel_url: `${options.siteUrl}/`,
    allow_promotion_codes: true,
    metadata,
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
