// One-off backfill that mirrors all Stripe products and prices into D1.
// Run before turning on the webhook (or any time you want to resync from scratch).
// The webhook keeps the mirror current after this; this script is just the bootstrap.
//
// Usage: npm run sync:stripe:local   (or sync:stripe:remote)

import Stripe from 'stripe';
import { writeFileSync, readFileSync, existsSync, mkdtempSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { tmpdir } from 'node:os';

const scriptDir = dirname(fileURLToPath(import.meta.url));
const workerDir = join(scriptDir, '..');

const args = process.argv.slice(2);
const isRemote = args.includes('--remote');
const isLocal = args.includes('--local');
if (isRemote === isLocal) {
  console.error('Usage: tsx scripts/sync-stripe.ts (--local | --remote)');
  process.exit(1);
}

function readDevVars(path: string): Record<string, string> {
  if (!existsSync(path)) return {};
  const out: Record<string, string> = {};
  for (const line of readFileSync(path, 'utf8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    out[key] = value;
  }
  return out;
}

const devVars = readDevVars(join(workerDir, '.dev.vars'));
const stripeKey = process.env.STRIPE_SECRET_KEY ?? devVars.STRIPE_SECRET_KEY;
if (!stripeKey) {
  console.error('STRIPE_SECRET_KEY not found in env or worker/.dev.vars');
  process.exit(1);
}

const stripe = new Stripe(stripeKey, { apiVersion: '2025-02-24.acacia' });

// Single quotes doubled per SQLite spec. Stripe data is trusted (the user's own
// Stripe account) but we still need correct escaping to avoid syntax errors on
// apostrophes in product names like "Last Man Standing".
function sqlString(s: string | null | undefined): string {
  if (s === null || s === undefined) return 'NULL';
  return `'${s.replace(/'/g, "''")}'`;
}

function sqlInt(n: number | null | undefined): string {
  if (n === null || n === undefined || !Number.isFinite(n)) return 'NULL';
  return String(Math.floor(n));
}

function parseTeamSize(raw: string | undefined): number | null {
  if (!raw) return null;
  const n = parseInt(raw, 10);
  return Number.isFinite(n) && n > 0 ? n : null;
}

async function listAll<T>(iter: AsyncIterable<T>): Promise<T[]> {
  const out: T[] = [];
  for await (const item of iter) out.push(item);
  return out;
}

console.log('Fetching Stripe products…');
const products = await listAll(stripe.products.list({ limit: 100 }));
console.log(`  ${products.length} products`);

console.log('Fetching Stripe prices…');
const prices = await listAll(stripe.prices.list({ limit: 100 }));
console.log(`  ${prices.length} prices`);

const statements: string[] = [];

for (const product of products) {
  // Resolve event_id in SQL: subquery returns the event slug if it exists,
  // otherwise NULL. Webhook does the same on subsequent product updates.
  const eventLookup = product.metadata?.event_id
    ? `(SELECT id FROM events WHERE id = ${sqlString(product.metadata.event_id)})`
    : 'NULL';

  statements.push(`INSERT INTO stripe_products (id, name, description, active, event_id, metadata_json, updated_at)
VALUES (${sqlString(product.id)}, ${sqlString(product.name)}, ${sqlString(product.description)}, ${product.active ? 1 : 0}, ${eventLookup}, ${sqlString(JSON.stringify(product.metadata ?? {}))}, datetime('now'))
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  description = excluded.description,
  active = excluded.active,
  event_id = excluded.event_id,
  metadata_json = excluded.metadata_json,
  updated_at = excluded.updated_at;`);
}

for (const price of prices) {
  const productId = typeof price.product === 'string' ? price.product : price.product.id;
  statements.push(`INSERT INTO stripe_prices (id, product_id, nickname, unit_amount, currency, active, min_team_size, max_team_size, metadata_json, updated_at)
VALUES (${sqlString(price.id)}, ${sqlString(productId)}, ${sqlString(price.nickname)}, ${sqlInt(price.unit_amount)}, ${sqlString(price.currency)}, ${price.active ? 1 : 0}, ${sqlInt(parseTeamSize(price.metadata?.min_team_size))}, ${sqlInt(parseTeamSize(price.metadata?.max_team_size))}, ${sqlString(JSON.stringify(price.metadata ?? {}))}, datetime('now'))
ON CONFLICT(id) DO UPDATE SET
  product_id = excluded.product_id,
  nickname = excluded.nickname,
  unit_amount = excluded.unit_amount,
  currency = excluded.currency,
  active = excluded.active,
  min_team_size = excluded.min_team_size,
  max_team_size = excluded.max_team_size,
  metadata_json = excluded.metadata_json,
  updated_at = excluded.updated_at;`);
}

if (statements.length === 0) {
  console.log('Nothing to sync.');
  process.exit(0);
}

const sql = statements.join('\n\n');
const sqlFile = join(mkdtempSync(join(tmpdir(), 'stripe-sync-')), 'sync.sql');
writeFileSync(sqlFile, sql);

const target = isRemote ? '--remote' : '--local';
console.log(`Applying to D1 ${target}…`);
execSync(`npx wrangler d1 execute endline-events ${target} --file=${sqlFile}`, {
  stdio: 'inherit',
  cwd: workerDir,
});

const withLink = products.filter((p) => p.metadata?.event_id).length;
const withoutLink = products.length - withLink;
console.log(
  `\nSynced ${products.length} products (${withLink} linked to an event via metadata.event_id, ${withoutLink} unlinked) and ${prices.length} prices.`
);
if (withoutLink > 0) {
  console.log(
    `Unlinked products are stored with event_id=NULL. Set metadata.event_id on each Stripe product and resync (or update them in Stripe — the webhook will reconcile).`
  );
}
