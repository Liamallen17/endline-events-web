# Racing Events API

Cloudflare Workers API for managing racing event registrations with Stripe payments.

## Architecture

```
├── src/
│   ├── index.ts             # Hono app, route mounting
│   ├── types.ts             # Shared TypeScript types (Env, row shapes, request/response)
│   ├── lib/
│   │   ├── db.ts            # D1 wrapper with typed queries
│   │   ├── stripe.ts        # Stripe client + createCheckoutSession
│   │   ├── prices.ts        # Stripe price metadata helpers (category_kind, addon_type)
│   │   └── validation.ts    # Input validation
│   ├── middleware/
│   │   ├── cors.ts          # CORS for local dev across :5173 / :8787
│   │   └── admin.ts         # Bearer-token gate for ADMIN_TOKEN
│   └── routes/
│       ├── events.ts        # GET /api/events, /api/events/:id, /api/events/:id/roster (admin)
│       ├── register.ts      # POST /api/register, GET /api/register/:teamId
│       ├── spectator.ts     # POST /api/spectator-checkout, GET /api/spectator-checkout/:passId
│       └── webhook.ts       # POST /api/webhook/stripe
├── migrations/
│   ├── 0001_initial.sql                       # athletes, events, teams, team_members
│   ├── 0003_stripe_products.sql               # stripe_products / stripe_prices mirror + webhook dedup
│   └── 0004_athlete_fields_and_spectator_passes.sql  # phone/dob/first-last; spectator_passes
└── scripts/
    ├── create-event.ts        # see Scripts section
    ├── read-event.ts
    ├── sync-stripe.ts
    ├── export-stripe.ts
    ├── apply-stripe.ts
    ├── import-csv.ts
    └── stripe-definitions/    # versioned per-event TS modules
```

Local dev data is populated by syncing real Stripe test-mode products via `npm run sync:stripe:local` rather than a static seed file.

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
wrangler secret put ADMIN_TOKEN          # bearer token for /api/events/:id/roster
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

## Scripts

All operator scripts are npm scripts in `worker/package.json`. Most database scripts take `--local` (the wrangler D1 emulator at `worker/.wrangler/state/v3/d1/`) or `--remote` (production D1). Stripe-touching scripts read `STRIPE_SECRET_KEY` from env, falling back to `.dev.vars`.

### Event lifecycle

#### `create-event:local` / `create-event:remote`

Insert a new event row in D1. The slug is the only thing the rest of the system keys off (Stripe products attach to it via `metadata.event_id`, the frontend modal fetches `/api/events/<slug>`).

```bash
npm run create-event:remote -- \
  --slug=bbu-26-2 \
  --name="BBU 26.2" \
  --date=2026-09-26 \
  --opens=2026-05-01 \
  --closes=2026-09-20
```

Flags: `--slug` (required), `--name` (required), `--date`, `--opens`, `--closes`, `--description`. Bare `YYYY-MM-DD` dates are normalised to UTC midnight (opens) / end-of-day (closes); pass a full ISO timestamp for precise times. Idempotent — re-running with the same slug leaves the existing row untouched.

#### `read-event:local` / `read-event:remote`

CLI summary of an event's current state in D1: row details, linked Stripe products and prices grouped by category kind, team counts by payment status (and broken down by category), spectator pass counts, unique paid athlete count, and the 10 most recent registrations. Read-only — only SELECT queries.

```bash
npm run read-event:remote -- --slug=bbu-26-2
```

### Stripe sync & versioning

#### `sync:stripe:local` / `sync:stripe:remote`

Pull every product and price from Stripe into D1 via the Stripe API. Use after creating products in Stripe (instead of waiting for individual webhooks), or to backfill anything the webhook missed. Re-runnable, idempotent via `ON CONFLICT DO UPDATE`.

```bash
STRIPE_SECRET_KEY=sk_live_xxx npm run sync:stripe:remote
```

**Mode guard:** `:remote` refuses to run with a non-live key (`sk_test_…` or anything else), `:local` refuses to run with a live key. Bypass with `--force` if you genuinely intend to mix — almost never the right move, because the mirrored IDs would belong to the wrong Stripe environment and every subsequent webhook would FK-fail.

#### `stripe:export`

Capture the current Stripe products + prices for one event into a versioned TS module under `scripts/stripe-definitions/`. The output is hand-editable — common case is to split a single multi-price product into one product per category so Stripe Checkout shows distinct line item names.

```bash
npm run stripe:export -- --slug=bbu-26-2 [--out=<path>]
```

#### `stripe:apply`

Apply a definition module to whichever Stripe account `STRIPE_SECRET_KEY` points at. Used to promote a tested test-mode setup to live, or to rebuild test after archiving.

```bash
# Test (uses .dev.vars)
npm run stripe:apply -- --file=scripts/stripe-definitions/bbu-26-2.ts

# Live
STRIPE_SECRET_KEY=sk_live_xxx npm run stripe:apply -- --file=scripts/stripe-definitions/bbu-26-2.ts
```

Refuses to run if any product in the definition already exists in Stripe (matched by name + `metadata.event_id`). Flags: `--dry-run` (preview without touching Stripe), `--skip-existing` (incremental apply — create only the missing products), `--allow-live` (required when `STRIPE_SECRET_KEY` is a live key, so a stale env var can't silently provision real products). After applying, run `sync:stripe:*` to mirror into D1.

### Historical data

#### `import:csv:local` / `import:csv:remote`

Import a Firebase + Stripe attendees CSV (from the `boughton-ultra` repo's `export-attendees-with-stripe.js`) into D1. Auto-creates the event row if missing, uses Stripe sessionId as the team PK for idempotency, inserts athletes with `OR IGNORE` so historical data never clobbers fresher records, skips rows with no sessionId. Leaves `teams.stripe_price_id` NULL — the CSV doesn't carry per-team category.

```bash
npm run import:csv:remote -- \
  --csv=../../boughton-ultra/attendees-with-payments-2026-04-26.csv \
  --event-slug=bbu-26-1 \
  --event-name="BBU 26.1" \
  --event-date=2026-05-02
```

### Database & development

| Script | What it does |
|---|---|
| `db:migrate:local` / `db:migrate:remote` | Apply outstanding D1 migrations |
| `db:studio` | Open wrangler's D1 Studio against the local DB |
| `dev` | Run the worker locally via `wrangler dev` (port 8787) |
| `deploy` | One-off production deploy (CI normally handles this via GitHub Actions) |
| `typecheck` | `tsc --noEmit` over `src/` |
| `lint` | `eslint src --ext .ts` |

### Common workflows

**Set up a new event end-to-end:**
```bash
npm run create-event:remote -- --slug=<slug> --name=<name> ...
# (set up products + prices in Stripe Dashboard, or stripe:apply a definition)
npm run sync:stripe:remote
npm run read-event:remote -- --slug=<slug>     # verify
```

**Promote a tested Stripe setup from test to live:**
```bash
npm run stripe:export -- --slug=<slug>
# (commit the generated scripts/stripe-definitions/<slug>.ts)
STRIPE_SECRET_KEY=sk_live_xxx npm run stripe:apply -- --file=scripts/stripe-definitions/<slug>.ts
npm run sync:stripe:remote
```

**Resync prices after a Stripe edit:**
```bash
npm run sync:stripe:remote
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

#### `GET /api/events/:id/roster` *(admin)*

Get all paid teams and their members for an event, including PII (name, email, gender, run club). Requires the `ADMIN_TOKEN` bearer:

```bash
curl -H "Authorization: Bearer $ADMIN_TOKEN" https://endlineevents.com/api/events/bbu-26-2/roster
```

Set the token with `wrangler secret put ADMIN_TOKEN` (production) and in `.dev.vars` locally. Unauthenticated requests return 401; requests when no `ADMIN_TOKEN` is configured return 500 (fail closed).

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
6. Run `npm run sync:stripe:remote` to backfill products and prices into D1 (see [Scripts](#scripts) — `sync:stripe:*`). Ongoing changes flow through the webhook after this initial sync.

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
- [ ] Capacity limits per event
- [ ] Waiting list functionality
- [ ] Export to CSV/Excel
- [ ] Drop the legacy NOT NULL columns on `events` (`stripe_price_id`, `min_team_size`, `max_team_size`) — sentinel values currently satisfy them
- [ ] Per-event cancel landing page (currently Stripe cancel returns to home)
