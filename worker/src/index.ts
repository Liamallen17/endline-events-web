import { Hono } from 'hono';
import { logger } from 'hono/logger';
import type { Env } from './types';
import { cors } from './middleware/cors';
import events from './routes/events';
import register from './routes/register';
import spectator from './routes/spectator';
import webhook from './routes/webhook';

const app = new Hono<{ Bindings: Env }>();

// Global middleware
app.use('*', logger());
app.use('/api/*', cors);

// Health check
app.get('/health', (c) => c.json({ status: 'ok', timestamp: new Date().toISOString() }));

// Mount routes
app.route('/api/events', events);
app.route('/api/register', register);
app.route('/api/spectator-checkout', spectator);
app.route('/api/webhook', webhook);

// 404 handler
app.notFound((c) => c.json({ error: 'Not found' }, 404));

// Error handler
app.onError((err, c) => {
  console.error('Unhandled error:', err);
  return c.json(
    {
      error: 'Internal server error',
      message: c.env?.SITE_URL?.includes('localhost') ? err.message : undefined,
    },
    500
  );
});

export default app;
