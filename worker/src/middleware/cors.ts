import type { Context, Next } from 'hono';

export async function cors(c: Context, next: Next) {
  const origin = c.req.header('Origin');

  // In production the API and frontend share an origin (endlineevents.com),
  // so CORS is only relevant for `wrangler dev` against the local Vite server.
  const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:5173',
    c.env?.SITE_URL,
  ].filter(Boolean);

  if (origin && allowedOrigins.includes(origin)) {
    c.header('Access-Control-Allow-Origin', origin);
  }

  c.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  c.header('Access-Control-Allow-Headers', 'Content-Type');
  c.header('Access-Control-Max-Age', '86400');

  if (c.req.method === 'OPTIONS') {
    return c.body(null, 204);
  }

  return next();
}
