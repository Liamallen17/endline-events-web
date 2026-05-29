import type { Context, Next } from 'hono';

// Constant-time string comparison. Both sides are fixed-length tokens once
// configured, so we short-circuit on length difference up front.
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

// Gates an endpoint behind the ADMIN_TOKEN secret. Send the token as
// `Authorization: Bearer <token>`. If ADMIN_TOKEN isn't configured on the
// worker the endpoint refuses entirely rather than silently allowing
// everything through — that's the "fail closed on misconfiguration" stance.
export async function requireAdmin(c: Context, next: Next) {
  const expected = c.env?.ADMIN_TOKEN;
  if (typeof expected !== 'string' || expected.length === 0) {
    return c.json({ error: 'Admin endpoint not configured' }, 500);
  }

  const auth = c.req.header('authorization') ?? '';
  const supplied = auth.replace(/^Bearer\s+/i, '');
  if (!timingSafeEqual(supplied, expected)) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  return next();
}
