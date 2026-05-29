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

List all published events with their prices grouped by category kind.

```json
{
  "events": [
    {
      "id": "bbu-26-1",
      "name": "BBU 26.1",
      "eventDate": "2026-05-02",
      "registrationOpen": true,
      "athletePrices": [
        { "id": "price_xxx", "nickname": "Full Pair", "unitAmount": 8000, "currency": "gbp", "minTeamSize": 2, "maxTeamSize": 2, "addonType": null }
      ],
      "addOnPrices": [
        { "id": "price_yyy", "nickname": "Campervan", "unitAmount": 2500, "currency": "gbp", "minTeamSize": null, "maxTeamSize": null, "addonType": "campervan" }
      ],
      "spectatorPrices": [
        { "id": "price_zzz", "nickname": "Spectator Pass", "unitAmount": 1000, "currency": "gbp", "minTeamSize": null, "maxTeamSize": null, "addonType": null }
      ]
    }
  ]
}
```

The grouping is driven by Stripe price metadata — see "Stripe Setup" below.

#### `GET /api/events/:id`

Get single event details (same shape as above, single object).

#### `GET /api/events/:id/roster`

Get all paid teams and their members for an event.

### Registration

#### `POST /api/register`

Create an athlete team and start Stripe checkout.

**Request:**
```json
{
  "priceId": "price_xxx",
  "teamName": "The Speedsters",
  "athletes": [
    {
      "email": "captain@example.com",
      "firstName": "Alice",
      "lastName": "Runner",
      "phone": "07700900000",
      "dateOfBirth": "1990-01-15",
      "gender": "female",
      "runClub": "City Striders",
      "isCaptain": true
    }
  ],
  "addOns": [
    { "priceId": "price_yyy", "quantity": 1 }
  ],
  "vehicleReg": "AB12 CDE"
}
```

`name` (combined) is accepted as an alternative to `firstName`/`lastName`. `sex`/`dob`/`runningClub` are accepted as aliases for `gender`/`dateOfBirth`/`runClub` (matching the frontend modal's field names). Add-ons must be `category_kind=addon` prices belonging to the same event.

**Response:**
```json
{ "url": "https://checkout.stripe.com/...", "teamId": "abc123..." }
```

#### `GET /api/register/:teamId`

Get team registration status, members, and which price (category) was paid for.

### Spectator passes

#### `POST /api/spectator-checkout`

Create a spectator pass and start Stripe checkout. Used for non-racing attendees (e.g. supporter wristbands).

**Request:**
```json
{
  "priceId": "price_zzz",
  "spectator": {
    "firstName": "Sam",
    "lastName": "Supporter",
    "email": "sam@example.com",
    "phone": "07700900000"
  },
  "addOns": [
    { "priceId": "price_yyy", "quantity": 1 }
  ],
  "vehicleReg": "AB12 CDE"
}
```

The chosen `priceId` must be `category_kind=spectator`.

**Response:**
```json
{ "url": "https://checkout.stripe.com/...", "passId": "def456..." }
```

#### `GET /api/spectator-checkout/:passId`

Get spectator pass status and contact details.

### Webhooks

#### `POST /api/webhook/stripe`

Stripe webhook endpoint. Configure in Stripe Dashboard with events:
- `product.created`, `product.updated`, `product.deleted`
- `price.created`, `price.updated`, `price.deleted`
- `checkout.session.completed`, `checkout.session.expired`
- `charge.refunded`

The handler routes `team_id` vs `pass_id` in checkout session metadata to the appropriate D1 record.

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

## Creating a new event

Events are rows in D1; the slug is the only thing the rest of the system keys off (Stripe products attach to it via `metadata.event_id`, the frontend modal fetches `/api/events/<slug>`).

```bash
npm run create-event:remote -- \
  --slug=bbu-26-2 \
  --name="BBU 26.2" \
  --date=2026-09-26 \
  --opens=2026-05-01 \
  --closes=2026-09-20
```

Use `create-event:local` against the local D1 emulator when testing.

The script is idempotent: re-running with the same `--slug` leaves an existing row untouched (no clobbering names or dates). Optional `--description` flag too. Dates default to UTC midnight (opens) and UTC end-of-day (closes) if given as bare `YYYY-MM-DD`, or pass a full ISO timestamp for explicit times.

Once the event row exists, jump to Stripe Setup below to add the products and prices.

## Stripe Setup

Stripe is the source of truth for products and prices. The link to an event is carried in `product.metadata`; each price is classified by metadata on the price itself.

### Product metadata
- `event_id` — required, matches the event slug in D1 (e.g. `bbu-26-1`).

### Price metadata
- `category_kind` — `"athlete"` (default if absent) | `"addon"` | `"spectator"`. Drives how the API groups the price and which endpoint accepts it for checkout.
- `min_team_size`, `max_team_size` — required for athlete prices; ignored otherwise.
- `addon_type` — optional free-form label for add-on prices (e.g. `"campervan"`), surfaced to the frontend so it can render specific UI like a vehicle-reg input.

### Steps
1. Create the event row in D1 (slug, dates, registration window) — Stripe products attach to it by slug.
2. In Stripe Dashboard, create one product per event and set `metadata.event_id`.
3. Under that product, create one price per category:
   - **Athlete categories** (BBU's "Full Pair", "Half Solo" etc.) — set `category_kind=athlete`, `min_team_size`, `max_team_size`, and use the `nickname` field for the human label.
   - **Add-ons** (campervan) — set `category_kind=addon`, optional `addon_type`. No team size needed.
   - **Spectator passes** — set `category_kind=spectator`. No team size needed.
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
