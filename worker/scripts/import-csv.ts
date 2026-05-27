// Import a historical Firebase+Stripe attendees CSV (produced by the
// boughton-ultra repo's export-attendees-with-stripe.js) into D1.
//
// Idempotent: re-running the same CSV produces the same DB state. Uses the
// Stripe session id as the team id so deduplication on re-runs is automatic.
// Athletes are inserted with OR IGNORE so an import never clobbers fresher
// athlete records from real (post-launch) registrations.
//
// Usage:
//   npm run import:csv:local -- \
//     --csv=../boughton-ultra/attendees-with-payments-2026-04-26.csv \
//     --event-slug=bbu-26-1 \
//     [--event-name="BBU 26.1"] \
//     [--event-date=2026-05-02]

import { writeFileSync, readFileSync, existsSync, mkdtempSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { tmpdir } from 'node:os';

const scriptDir = dirname(fileURLToPath(import.meta.url));
const workerDir = join(scriptDir, '..');

function arg(name: string): string | undefined {
  const prefix = `--${name}=`;
  return process.argv.find((a) => a.startsWith(prefix))?.slice(prefix.length);
}

const cliArgs = process.argv.slice(2);
const csvPath = arg('csv');
const eventSlug = arg('event-slug');
const eventName = arg('event-name') ?? eventSlug;
const eventDate = arg('event-date') ?? null;
const isLocal = cliArgs.includes('--local');
const isRemote = cliArgs.includes('--remote');

if (!csvPath || !eventSlug || isLocal === isRemote) {
  console.error(
    'Usage: tsx scripts/import-csv.ts --csv=<path> --event-slug=<slug>' +
      ' [--event-name=<name>] [--event-date=YYYY-MM-DD] (--local | --remote)'
  );
  process.exit(1);
}

const resolvedCsv = resolve(csvPath);
if (!existsSync(resolvedCsv)) {
  console.error(`CSV not found: ${resolvedCsv}`);
  process.exit(1);
}

function sqlString(s: string | null | undefined): string {
  if (s === null || s === undefined || s === '') return 'NULL';
  return `'${s.replace(/'/g, "''")}'`;
}

// CSV exports use DD/MM/YYYY (UK locale).
function parseUkDate(s: string): string | null {
  if (!s) return null;
  const m = s.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!m) return null;
  return `${m[3]}-${m[2]}-${m[1]}T00:00:00Z`;
}

function mapPaymentStatus(raw: string): 'paid' | 'failed' | 'refunded' | 'pending' {
  const v = raw.toLowerCase().trim();
  if (v === 'paid' || v === 'complete') return 'paid';
  if (v === 'expired') return 'failed';
  if (v === 'refunded') return 'refunded';
  return 'pending';
}

function normaliseGender(raw: string): string | null {
  const v = raw.toLowerCase().trim();
  if (v === 'male' || v === 'female' || v === 'other' || v === 'unspecified') return v;
  return null;
}

// Minimal RFC 4180-ish parser: handles "-quoted fields with "" escapes.
function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += c;
      }
    } else if (c === '"') {
      inQuotes = true;
    } else if (c === ',') {
      row.push(field);
      field = '';
    } else if (c === '\n') {
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
    } else if (c !== '\r') {
      field += c;
    }
  }
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  while (rows.length > 0 && rows[rows.length - 1].every((f) => !f)) rows.pop();
  return rows;
}

const csvText = readFileSync(resolvedCsv, 'utf8');
const allRows = parseCsv(csvText);
if (allRows.length < 2) {
  console.error('CSV is empty or has no data rows.');
  process.exit(1);
}

const headers = allRows[0];
const colIdx: Record<string, number> = {};
headers.forEach((h, i) => {
  colIdx[h] = i;
});

const required = [
  'a1email',
  'a1name',
  'a2email',
  'a2name',
  'sessionId',
  'paymentStatus',
  'registrationDate',
  'registrationType',
];
for (const r of required) {
  if (!(r in colIdx)) {
    console.error(`CSV missing required column: ${r}`);
    process.exit(1);
  }
}

const statements: string[] = [];

// Auto-create the event row if it doesn't exist. INSERT OR IGNORE so a re-run
// against an existing event leaves the existing name/date intact. The legacy
// stripe_price_id NOT NULL column gets a sentinel value; it's no longer read.
statements.push(`INSERT OR IGNORE INTO events (id, name, event_date, min_team_size, max_team_size, stripe_price_id, is_published)
VALUES (${sqlString(eventSlug)}, ${sqlString(eventName)}, ${sqlString(eventDate)}, 1, 2, 'historical', 1);`);

let imported = 0;
let skippedNoSession = 0;
let skippedNoCaptain = 0;

for (const row of allRows.slice(1)) {
  const get = (name: string) => (row[colIdx[name]] ?? '').trim();

  const sessionId = get('sessionId');
  if (!sessionId) {
    skippedNoSession++;
    continue;
  }

  const a1email = get('a1email').toLowerCase();
  const a1name = get('a1name');
  if (!a1email || !a1name) {
    skippedNoCaptain++;
    continue;
  }
  const a1gender = normaliseGender(get('a1gender'));
  const a1runClub = get('a1runClub') || null;

  const a2email = get('a2email').toLowerCase();
  const a2name = get('a2name');
  const isPair = !!a2email && !!a2name;
  const a2gender = isPair ? normaliseGender(get('a2gender')) : null;
  const a2runClub = isPair ? get('a2runClub') || null : null;

  const paymentStatus = mapPaymentStatus(get('paymentStatus'));
  const registrationDate = parseUkDate(get('registrationDate'));
  const paidAt = paymentStatus === 'paid' ? registrationDate : null;
  const createdAtSql = registrationDate ? sqlString(registrationDate) : "datetime('now')";

  statements.push(`INSERT OR IGNORE INTO athletes (email, name, gender, run_club)
VALUES (${sqlString(a1email)}, ${sqlString(a1name)}, ${sqlString(a1gender)}, ${sqlString(a1runClub)});`);

  if (isPair) {
    statements.push(`INSERT OR IGNORE INTO athletes (email, name, gender, run_club)
VALUES (${sqlString(a2email)}, ${sqlString(a2name)}, ${sqlString(a2gender)}, ${sqlString(a2runClub)});`);
  }

  // sessionId doubles as the team primary key — guarantees idempotency without
  // a separate SELECT roundtrip to look up an existing team's UUID.
  statements.push(`INSERT INTO teams (id, event_id, stripe_session_id, payment_status, paid_at, created_at)
VALUES (${sqlString(sessionId)}, ${sqlString(eventSlug)}, ${sqlString(sessionId)}, ${sqlString(paymentStatus)}, ${sqlString(paidAt)}, ${createdAtSql})
ON CONFLICT(id) DO UPDATE SET
  payment_status = excluded.payment_status,
  paid_at = excluded.paid_at;`);

  statements.push(`INSERT OR IGNORE INTO team_members (team_id, athlete_email, role)
VALUES (${sqlString(sessionId)}, ${sqlString(a1email)}, 'captain');`);

  if (isPair) {
    statements.push(`INSERT OR IGNORE INTO team_members (team_id, athlete_email, role)
VALUES (${sqlString(sessionId)}, ${sqlString(a2email)}, 'member');`);
  }

  imported++;
}

const sql = statements.join('\n\n');
const sqlFile = join(mkdtempSync(join(tmpdir(), 'csv-import-')), 'import.sql');
writeFileSync(sqlFile, sql);

const target = isRemote ? '--remote' : '--local';
console.log(
  `Importing ${imported} team(s) from ${resolvedCsv} into event "${eventSlug}" (D1 ${target})…`
);
if (skippedNoSession) console.log(`  Skipped ${skippedNoSession} row(s) with no Stripe sessionId`);
if (skippedNoCaptain) console.log(`  Skipped ${skippedNoCaptain} row(s) with no captain athlete`);

execSync(`npx wrangler d1 execute endline-events ${target} --file=${sqlFile}`, {
  stdio: 'inherit',
  cwd: workerDir,
});

console.log('Import complete.');
