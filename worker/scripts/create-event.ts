// Create a new event row in D1. Idempotent — re-running with the same slug
// leaves the existing row untouched (no clobbering names/dates).
//
// After running, set metadata.event_id = <slug> on the matching Stripe product
// (and create category prices under it with category_kind metadata); the
// webhook syncs everything into stripe_products / stripe_prices automatically.
//
// Usage:
//   npm run create-event:local -- \
//     --slug=bbu-26-2 --name="BBU 26.2" \
//     --date=2026-09-26 \
//     --opens=2026-05-01 --closes=2026-09-20

import { writeFileSync, mkdtempSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { tmpdir } from 'node:os';

const scriptDir = dirname(fileURLToPath(import.meta.url));
const workerDir = join(scriptDir, '..');

function arg(name: string): string | undefined {
  const prefix = `--${name}=`;
  return process.argv.find((a) => a.startsWith(prefix))?.slice(prefix.length);
}

const cliArgs = process.argv.slice(2);
const slug = arg('slug');
const name = arg('name');
const date = arg('date');
const opens = arg('opens');
const closes = arg('closes');
const description = arg('description');
const isLocal = cliArgs.includes('--local');
const isRemote = cliArgs.includes('--remote');

if (!slug || !name || isLocal === isRemote) {
  console.error(
    'Usage: tsx scripts/create-event.ts --slug=<slug> --name=<name>\n' +
      '  [--date=YYYY-MM-DD] [--opens=YYYY-MM-DD] [--closes=YYYY-MM-DD]\n' +
      '  [--description=<text>] (--local | --remote)'
  );
  process.exit(1);
}

if (!/^[a-z0-9-]+$/.test(slug)) {
  console.error(`Slug must be lowercase letters, digits, and hyphens only (got "${slug}")`);
  process.exit(1);
}

function sqlString(s: string | null | undefined): string {
  if (s === null || s === undefined || s === '') return 'NULL';
  return `'${s.replace(/'/g, "''")}'`;
}

// Accept either a bare YYYY-MM-DD or a full ISO timestamp. Bare dates get
// normalised: opens defaults to start-of-day UTC, closes to end-of-day UTC,
// which matches how registration windows are usually expressed ("open 1 May",
// "closes 20 Sep" really means the whole of those days).
function normaliseDateTime(raw: string | undefined, end: boolean): string | null {
  if (!raw) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
    return `${raw}T${end ? '23:59:59' : '00:00:00'}Z`;
  }
  if (!Number.isNaN(Date.parse(raw))) return raw;
  console.error(`Invalid date "${raw}" — use YYYY-MM-DD`);
  process.exit(1);
}

const opensIso = normaliseDateTime(opens, false);
const closesIso = normaliseDateTime(closes, true);

// stripe_price_id, min_team_size, max_team_size are dead legacy columns from
// migration 0001 we left in for back-compat. The new code never reads them;
// the sentinel values exist only to satisfy NOT NULL.
const sql = `INSERT OR IGNORE INTO events (
  id, name, description, event_date,
  min_team_size, max_team_size, stripe_price_id,
  registration_opens_at, registration_closes_at,
  is_published
) VALUES (
  ${sqlString(slug)}, ${sqlString(name)}, ${sqlString(description)}, ${sqlString(date)},
  1, 1, 'unused',
  ${sqlString(opensIso)}, ${sqlString(closesIso)},
  1
);
SELECT id, name, event_date, registration_opens_at, registration_closes_at, is_published
FROM events WHERE id = ${sqlString(slug)};`;

const sqlFile = join(mkdtempSync(join(tmpdir(), 'event-create-')), 'create.sql');
writeFileSync(sqlFile, sql);

const target = isRemote ? '--remote' : '--local';
console.log(`Applying to D1 ${target}…`);
execSync(`npx wrangler d1 execute endline-events ${target} --file=${sqlFile}`, {
  stdio: 'inherit',
  cwd: workerDir,
});

console.log(`
Next steps:
  1. In Stripe, create the product for "${name}" and set metadata.event_id = "${slug}".
  2. Under that product, create one price per category:
       - athlete prices  → category_kind="athlete", min_team_size, max_team_size
       - spectator pass  → category_kind="spectator"
       - campervan etc.  → category_kind="addon", addon_type="campervan"
     (Add-on products also need metadata.event_id = "${slug}".)
  3. Webhook syncs prices/products into D1 automatically. Verify with:
       curl https://endlineevents.com/api/events/${slug}
       # or in dev: http://localhost:8787/api/events/${slug}`);
