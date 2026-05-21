import { Hono } from 'hono';
import type { Env, EventPriceView, EventRow, StripePriceRow } from '../types';
import { Database } from '../lib/db';

const events = new Hono<{ Bindings: Env }>();

function toPriceView(p: StripePriceRow): EventPriceView {
  return {
    id: p.id,
    productId: p.product_id,
    nickname: p.nickname,
    unitAmount: p.unit_amount,
    currency: p.currency,
    minTeamSize: p.min_team_size,
    maxTeamSize: p.max_team_size,
  };
}

async function eventView(db: Database, event: EventRow) {
  const prices = await db.getEventPrices(event.id);
  return {
    id: event.id,
    name: event.name,
    description: event.description,
    eventDate: event.event_date,
    registrationOpen: await db.isRegistrationOpen(event),
    registrationOpensAt: event.registration_opens_at,
    registrationClosesAt: event.registration_closes_at,
    prices: prices.map(toPriceView),
  };
}

// GET /api/events - List published events with their prices
events.get('/', async (c) => {
  const db = new Database(c.env.DB);
  const eventList = await db.getPublishedEvents();
  const eventsWithStatus = await Promise.all(eventList.map((e) => eventView(db, e)));
  return c.json({ events: eventsWithStatus });
});

// GET /api/events/:id - Get single event details with prices
events.get('/:id', async (c) => {
  const db = new Database(c.env.DB);
  const event = await db.getEvent(c.req.param('id'));

  if (!event || !event.is_published) {
    return c.json({ error: 'Event not found' }, 404);
  }

  return c.json(await eventView(db, event));
});

// GET /api/events/:id/roster - Get event roster (for admin/display)
events.get('/:id/roster', async (c) => {
  const db = new Database(c.env.DB);
  const event = await db.getEvent(c.req.param('id'));

  if (!event) {
    return c.json({ error: 'Event not found' }, 404);
  }

  const roster = await db.getEventRoster(event.id);

  // Group by team
  const teams = new Map<string, {
    id: string;
    name: string | null;
    members: Array<{
      name: string;
      email: string;
      gender: string | null;
      runClub: string | null;
      role: string;
    }>;
  }>();

  for (const row of roster) {
    if (!teams.has(row.team_id)) {
      teams.set(row.team_id, {
        id: row.team_id,
        name: row.team_name,
        members: [],
      });
    }
    teams.get(row.team_id)!.members.push({
      name: row.athlete_name,
      email: row.athlete_email,
      gender: row.gender,
      runClub: row.run_club,
      role: row.role,
    });
  }

  return c.json({
    event: {
      id: event.id,
      name: event.name,
      eventDate: event.event_date,
    },
    teams: Array.from(teams.values()),
    totalTeams: teams.size,
    totalAthletes: roster.length,
  });
});

export default events;
