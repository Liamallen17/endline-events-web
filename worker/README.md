# Racing Events API

Cloudflare Workers API for managing racing event registrations with Stripe payments.

## Architecture

```
├── src/
│   ├── index.ts          # Main entry point, route mounting
│   ├── types.ts          # TypeScript types for env, DB rows, API
│   ├── lib/
│   │   ├── db.ts         # Database wrapper with typed queries
│   │   ├── stripe.ts     # Stripe client and helpers
│   │   └── validation.ts # Input validation
│   ├── middleware/
│   │   └── cors.ts       # CORS handling
│   └── routes/
│       ├── events.ts     # GET /api/events, /api/events/:id
│       ├── register.ts   # POST /api/register
│       └── webhook.ts    # POST /api/webhook/stripe
└── migrations/
    ├── 0001_initial.sql            # Initial schema (athletes, events, teams, team_members)
    └── 0003_stripe_products.sql    # Stripe product/price mirror + webhook dedup
```

Local dev data is populated by syncing real Stripe test-mode products via `scripts/sync-stripe.ts` rather than a static seed file.

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Create D1 database

```bash
wrangler d1 create racing-events-db
```

Copy the `database_id` from the output into `wrangler.toml`.

### 3. Run migrations

```bash
# Local development
npm run db:migrate:local

# Production
npm run db:migrate:remote
```

### 4. Set secrets

```bash
wrangler secret put STRIPE_SECRET_KEY
wrangler secret put STRIPE_WEBHOOK_SECRET
```

### 5. Run locally

```bash
npm run dev
```

The API will be available at `http://localhost:8787`.

### 6. Deploy

```bash
npm run deploy
```

## API Endpoints

### Events

#### `GET /api/events`

List all published events.

```json
{
  "events": [
    {
      "id": "autumn-team-relay-2025",
      "name": "Autumn Team Relay",
      "description": "Team relay race for groups of 4-6",
      "eventDate": "2025-09-15",
      "minTeamSize": 4,
      "maxTeamSize": 6,
      "registrationOpen": true,
      "registrationOpensAt": "2025-06-01T00:00:00Z",
      "registrationClosesAt": "2025-09-10T23:59:59Z"
    }
  ]
}
```

#### `GET /api/events/:id`

Get single event details.

#### `GET /api/events/:id/roster`

Get all paid teams and their members for an event.

### Registration

#### `POST /api/register`

Create a team and start Stripe checkout.

**Request:**
```json
{
  "eventId": "autumn-team-relay-2025",
  "teamName": "The Speedsters",
  "athletes": [
    {
      "email": "captain@example.com",
      "name": "Alice Runner",
      "gender": "female",
      "runClub": "City Striders",
      "isCaptain": true
    },
    {
      "email": "member1@example.com",
      "name": "Bob Sprinter",
      "gender": "male"
    }
  ]
}
```

**Response:**
```json
{
  "url": "https://checkout.stripe.com/...",
  "teamId": "abc123..."
}
```

#### `GET /api/register/:teamId`

Get team registration status and members.

### Webhooks

#### `POST /api/webhook/stripe`

Stripe webhook endpoint. Configure in Stripe Dashboard with events:
- `checkout.session.completed`
- `checkout.session.expired`
- `charge.refunded` (optional)

## Database Schema

See `migrations/0001_initial.sql` for the full schema. Key tables:

- **athletes**: Canonical record of participants (email as PK)
- **events**: Race definitions with team size constraints
- **teams**: Registration groups linked to events and Stripe sessions
- **team_members**: Junction table linking athletes to teams

## Development

### View local database

```bash
npm run db:studio
```

### Type checking

```bash
npm run typecheck
```

## Stripe Setup

Stripe is the source of truth for products and prices. The link to an event is carried in `product.metadata`.

1. Create the event row in the database (slug, dates, registration window) — Stripe products attach to it by slug.
2. In Stripe Dashboard, create one product per event and set `metadata.event_id = "<event-slug>"`.
3. Under that product, create one price per category. Use the `nickname` field for the human label ("Full Pair", "Half Solo"). Set `metadata.min_team_size` and `metadata.max_team_size` on each price for the team-size constraints.
4. Configure the webhook endpoint pointing to `/api/webhook/stripe` with events: `product.created/updated/deleted`, `price.created/updated/deleted`, `checkout.session.completed/expired`, `charge.refunded`.
5. Add the webhook signing secret as `STRIPE_WEBHOOK_SECRET`.
6. Run the initial sync to backfill products and prices into D1:
   ```bash
   npm run sync:stripe:local    # local D1 emulator
   npm run sync:stripe:remote   # production D1
   ```
   The script lists all products and prices via the Stripe API and upserts them. Re-runnable; idempotent via `ON CONFLICT DO UPDATE`. Ongoing changes after this initial sync flow in through the webhook.

## Importing historical race data

For races that ran on the previous Firebase + Stripe setup, the canonical attendee export from the old `boughton-ultra` repo (`scripts/export-attendees-with-stripe.js` → `attendees-with-payments-YYYY-MM-DD.csv`) can be imported with:

```bash
npm run import:csv:local -- \
  --csv=../../boughton-ultra/attendees-with-payments-2026-04-26.csv \
  --event-slug=bbu-26-1 \
  --event-name="BBU 26.1" \
  --event-date=2026-05-02
```

The script:
- Auto-creates the event row if it doesn't exist (with `is_published=1` and a sentinel `stripe_price_id='historical'` to satisfy the legacy NOT NULL column).
- Uses the Stripe `sessionId` from the CSV as the team's primary key, which makes re-runs idempotent without needing a lookup.
- Inserts athletes with `OR IGNORE` so importing old data never overwrites fresher athlete records from real registrations.
- Leaves `teams.stripe_price_id` NULL — the CSV doesn't carry which price category was paid for, so the per-team category isn't recovered. Roster lookups still work.
- Skips rows with no Stripe sessionId (Firebase-only registrations that never paid).

Replace `--local` with `--remote` to import into production D1.

## Frontend Integration

Replace the Firebase registration form with a simple fetch:

```typescript
const handleSubmit = async (formData: FormData) => {
  const response = await fetch('/api/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      priceId: 'price_xxx', // user picks a category card
      teamName: formData.teamName,
      athletes: formData.athletes.map((a, i) => ({
        ...a,
        isCaptain: i === 0,
      })),
    }),
  });

  const { url } = await response.json();
  window.location.assign(url);
};
```

## Future Improvements

- [ ] Email confirmations (Resend/Postmark integration)
- [ ] Admin authentication for roster endpoints
- [ ] Capacity limits per event
- [ ] Waiting list functionality
- [ ] Export to CSV/Excel
