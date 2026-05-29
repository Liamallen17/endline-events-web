// CLI summary of an event's current state: row details, linked Stripe
// products/prices, team registration counts grouped by status and category,
// spectator pass counts, and the most recent registrations.
//
// Useful as a "what's going on with this event right now" overview without
// having to open D1 Studio or write SQL by hand.
//
// Usage:
//   npm run read-event:local  -- --slug=bbu-26-2
//   npm run read-event:remote -- --slug=bbu-26-2

import { execSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = dirname(fileURLToPath(import.meta.url));
const workerDir = join(scriptDir, '..');

function arg(name: string): string | undefined {
  const prefix = `--${name}=`;
  return process.argv.find((a) => a.startsWith(prefix))?.slice(prefix.length);
}

const cliArgs = process.argv.slice(2);
const slug = arg('slug');
const isLocal = cliArgs.includes('--local');
const isRemote = cliArgs.includes('--remote');

if (!slug || isLocal === isRemote) {
  console.error('Usage: tsx scripts/read-event.ts --slug=<slug> (--local | --remote)');
  process.exit(1);
}

if (!/^[a-z0-9-]+$/.test(slug)) {
  console.error(`Slug must be lowercase letters, digits, and hyphens only (got "${slug}")`);
  process.exit(1);
}

const target = isRemote ? '--remote' : '--local';
const slugSql = `'${slug.replace(/'/g, "''")}'`;

// wrangler --json serialises SQL NULL as the literal string "null" rather
// than JSON null, so we strip that here so callers can use plain ?? / ?: checks.
// Real string values of "null" never occur in our schema (slugs, IDs, names).
function normalise<T extends Record<string, unknown>>(row: T): T {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(row)) {
    out[k] = v === 'null' ? null : v;
  }
  return out as T;
}

function query<T extends Record<string, unknown> = Record<string, unknown>>(sql: string): T[] {
  // wrangler with --json puts the JSON result on stdout; we leave stderr
  // inherited so any wrangler errors are visible to the operator.
  const out = execSync(
    `npx wrangler d1 execute endline-events ${target} --json --command "${sql.replace(/"/g, '\\"')}"`,
    { cwd: workerDir, encoding: 'utf8', stdio: ['ignore', 'pipe', 'inherit'] }
  );
  const parsed = JSON.parse(out) as Array<{ results?: T[] }>;
  return (parsed[0]?.results ?? []).map(normalise);
}

function pounds(unitAmount: number | null | undefined): string {
  if (unitAmount == null) return '—';
  const v = unitAmount / 100;
  return `£${v.toFixed(v % 1 === 0 ? 0 : 2)}`;
}

interface EventRow {
  id: string;
  name: string;
  description: string | null;
  event_date: string | null;
  registration_opens_at: string | null;
  registration_closes_at: string | null;
  is_published: number;
}

const events = query<EventRow>(`SELECT id, name, description, event_date, registration_opens_at, registration_closes_at, is_published FROM events WHERE id=${slugSql}`);
if (events.length === 0) {
  console.error(`Event "${slug}" not found in ${isRemote ? 'remote' : 'local'} D1.`);
  process.exit(1);
}

const event = events[0]!;
console.log('');
console.log(`Event: ${event.name}  [${event.id}]`);
if (event.description) console.log(`  ${event.description}`);
console.log(`  Date: ${event.event_date ?? '—'}`);
console.log(`  Registration: ${event.registration_opens_at ?? '—'}  →  ${event.registration_closes_at ?? '—'}`);
console.log(`  Published: ${event.is_published ? 'yes' : 'no'}`);

interface ProductRow {
  id: string;
  name: string;
  active: number;
}
const products = query<ProductRow>(`SELECT id, name, active FROM stripe_products WHERE event_id=${slugSql} ORDER BY name`);
console.log('');
console.log(`Stripe products linked: ${products.length}`);
for (const p of products) {
  console.log(`  ${p.id} — ${p.name}${p.active ? '' : '  (inactive)'}`);
}

interface PriceRow {
  id: string;
  nickname: string | null;
  unit_amount: number | null;
  currency: string;
  active: number;
  min_team_size: number | null;
  max_team_size: number | null;
  metadata_json: string | null;
}
const prices = query<PriceRow>(
  `SELECT p.id, p.nickname, p.unit_amount, p.currency, p.active, p.min_team_size, p.max_team_size, p.metadata_json ` +
  `FROM stripe_prices p JOIN stripe_products pr ON p.product_id=pr.id ` +
  `WHERE pr.event_id=${slugSql} ORDER BY p.unit_amount`
);

function priceKind(p: PriceRow): 'athlete' | 'addon' | 'spectator' {
  if (!p.metadata_json) return 'athlete';
  try {
    const m = JSON.parse(p.metadata_json);
    const k = m?.category_kind;
    if (k === 'addon' || k === 'spectator') return k;
  } catch {
    // fall through
  }
  return 'athlete';
}

const grouped: Record<'athlete' | 'addon' | 'spectator', PriceRow[]> = {
  athlete: [],
  addon: [],
  spectator: [],
};
for (const p of prices) grouped[priceKind(p)].push(p);

console.log('');
console.log(`Prices: ${prices.length}`);
for (const [label, key] of [
  ['Athlete', 'athlete'] as const,
  ['Spectator', 'spectator'] as const,
  ['Add-on', 'addon'] as const,
]) {
  if (grouped[key].length === 0) continue;
  console.log(`  ${label}:`);
  for (const p of grouped[key]) {
    const team = p.max_team_size ? `  min=${p.min_team_size ?? '?'} max=${p.max_team_size}` : '';
    const active = p.active ? '' : '  (inactive)';
    console.log(`    ${p.id} — ${p.nickname ?? '(no nickname)'} (${pounds(p.unit_amount)})${team}${active}`);
  }
}

interface CountRow {
  payment_status: string;
  count: number;
}
const teamCounts = query<CountRow>(`SELECT payment_status, COUNT(*) as count FROM teams WHERE event_id=${slugSql} GROUP BY payment_status`);
const totalTeams = teamCounts.reduce((s, r) => s + r.count, 0);
console.log('');
console.log(`Teams: ${totalTeams}`);
for (const row of teamCounts) console.log(`  ${row.payment_status}: ${row.count}`);

interface CategoryCountRow {
  nickname: string | null;
  payment_status: string;
  count: number;
}
const teamsByCat = query<CategoryCountRow>(
  `SELECT p.nickname, t.payment_status, COUNT(*) as count ` +
  `FROM teams t LEFT JOIN stripe_prices p ON t.stripe_price_id=p.id ` +
  `WHERE t.event_id=${slugSql} GROUP BY p.nickname, t.payment_status ORDER BY p.nickname`
);
if (teamsByCat.length > 0) {
  console.log('  By category:');
  for (const row of teamsByCat) {
    console.log(`    ${row.nickname ?? '(unknown)'}: ${row.count} ${row.payment_status}`);
  }
}

const passCounts = query<CountRow>(`SELECT payment_status, COUNT(*) as count FROM spectator_passes WHERE event_id=${slugSql} GROUP BY payment_status`);
const totalPasses = passCounts.reduce((s, r) => s + r.count, 0);
console.log('');
console.log(`Spectator passes: ${totalPasses}`);
for (const row of passCounts) console.log(`  ${row.payment_status}: ${row.count}`);

const uniqueAthletes = query<{ count: number }>(
  `SELECT COUNT(DISTINCT tm.athlete_email) as count FROM team_members tm ` +
  `JOIN teams t ON tm.team_id=t.id WHERE t.event_id=${slugSql} AND t.payment_status='paid'`
);
console.log('');
console.log(`Unique paid athletes: ${uniqueAthletes[0]?.count ?? 0}`);

interface RecentRow {
  id: string;
  name: string | null;
  payment_status: string;
  paid_at: string | null;
  created_at: string;
  nickname: string | null;
}
const recent = query<RecentRow>(
  `SELECT t.id, t.name, t.payment_status, t.paid_at, t.created_at, p.nickname ` +
  `FROM teams t LEFT JOIN stripe_prices p ON t.stripe_price_id=p.id ` +
  `WHERE t.event_id=${slugSql} ORDER BY t.created_at DESC LIMIT 10`
);
if (recent.length > 0) {
  console.log('');
  console.log('Recent registrations (most recent first):');
  for (const t of recent) {
    const when = t.paid_at ?? t.created_at;
    const label = t.name ?? `Team ${t.id.slice(0, 8)}`;
    console.log(`  ${when}  ${label}  (${t.nickname ?? '?'})  [${t.payment_status}]`);
  }
}

console.log('');
