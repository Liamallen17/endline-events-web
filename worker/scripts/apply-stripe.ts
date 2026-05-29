// Apply a versioned event definition (TS module from
// scripts/stripe-definitions/) to a Stripe account: create the products and
// their prices. Use this to recreate a test setup in live (or to rebuild test
// after archiving everything).
//
// Reads STRIPE_SECRET_KEY from env, falling back to worker/.dev.vars.
// Override the env var to point at live: `STRIPE_SECRET_KEY=sk_live_... npm run stripe:apply -- ...`.
//
// Idempotency: by default refuses to run if any product in the definition
// already exists in Stripe (matched by name + metadata.event_id), so a
// rerun against the wrong account can't silently double up products. Pass
// --skip-existing to apply only the missing ones; pass --dry-run to list
// what would be created without touching Stripe.
//
// Usage:
//   npm run stripe:apply -- --file=scripts/stripe-definitions/bbu-26-2.ts
//   npm run stripe:apply -- --file=scripts/stripe-definitions/bbu-26-2.ts --dry-run
//   npm run stripe:apply -- --file=scripts/stripe-definitions/bbu-26-2.ts --skip-existing

import Stripe from 'stripe';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import type { EventDefinition } from './stripe-definitions/_types';

const scriptDir = dirname(fileURLToPath(import.meta.url));
const workerDir = join(scriptDir, '..');

function arg(name: string): string | undefined {
  const prefix = `--${name}=`;
  return process.argv.find((a) => a.startsWith(prefix))?.slice(prefix.length);
}

const cliArgs = process.argv.slice(2);
const file = arg('file');
const dryRun = cliArgs.includes('--dry-run');
const skipExisting = cliArgs.includes('--skip-existing');

if (!file) {
  console.error(
    'Usage: tsx scripts/apply-stripe.ts --file=<definition.ts> [--dry-run] [--skip-existing]'
  );
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
const mode = stripeKey.startsWith('sk_live_') ? 'live' : stripeKey.startsWith('sk_test_') ? 'test' : 'unknown';

const resolvedFile = resolve(file);
if (!existsSync(resolvedFile)) {
  console.error(`Definition file not found: ${resolvedFile}`);
  process.exit(1);
}

// Dynamic import — tsx will resolve and transpile the TS module on the fly.
const mod = (await import(pathToFileURL(resolvedFile).href)) as { definition: EventDefinition };
const definition = mod.definition;
if (!definition || !definition.eventSlug || !Array.isArray(definition.products)) {
  console.error('Definition file did not export a valid `definition` object.');
  process.exit(1);
}

console.log(`Applying definition for "${definition.eventSlug}" to Stripe (${mode} mode)…`);
console.log(`  ${definition.products.length} product(s), ${definition.products.reduce((s, p) => s + p.prices.length, 0)} price(s)`);
if (dryRun) console.log('  (dry run — no changes will be made)');
console.log('');

async function listAll<T>(iter: AsyncIterable<T>): Promise<T[]> {
  const out: T[] = [];
  for await (const item of iter) out.push(item);
  return out;
}

// Pre-flight: see which products in the definition already exist in Stripe.
// Match by metadata.event_id (set on each product) AND name — name is the
// human-facing line-item label, so duplicates would be visible at checkout.
const existing = await listAll(stripe.products.list({ limit: 100 }));
const existingByKey = new Map<string, Stripe.Product>();
for (const p of existing) {
  if (p.metadata?.event_id === definition.eventSlug) {
    existingByKey.set(p.name, p);
  }
}

const toCreate = definition.products.filter((p) => !existingByKey.has(p.name));
const conflicts = definition.products.filter((p) => existingByKey.has(p.name));

if (conflicts.length > 0) {
  console.log(`Already in Stripe: ${conflicts.length}`);
  for (const c of conflicts) {
    const existingId = existingByKey.get(c.name)!.id;
    console.log(`  ${c.name}  (${existingId})`);
  }
  if (!skipExisting) {
    console.error(
      `\nRefusing to apply because ${conflicts.length} product(s) already exist in Stripe.\n` +
        `Run with --skip-existing to only create the missing ones, or archive\n` +
        `the existing products in Stripe first and re-run.`
    );
    process.exit(1);
  }
  console.log('  (skipping these — --skip-existing was passed)\n');
}

console.log(`To create: ${toCreate.length}`);
for (const p of toCreate) console.log(`  ${p.name}  (${p.prices.length} price(s))`);
console.log('');

if (dryRun) {
  console.log('Dry run complete. No changes made.');
  process.exit(0);
}

let createdProducts = 0;
let createdPrices = 0;
for (const def of toCreate) {
  const product = await stripe.products.create({
    name: def.name,
    description: def.description ?? undefined,
    metadata: def.metadata,
  });
  createdProducts++;
  console.log(`  ✓ Product  ${product.id}  ${def.name}`);

  for (const priceDef of def.prices) {
    const price = await stripe.prices.create({
      product: product.id,
      nickname: priceDef.nickname,
      unit_amount: priceDef.unitAmount,
      currency: priceDef.currency,
      metadata: priceDef.metadata,
    });
    createdPrices++;
    console.log(`    ✓ Price  ${price.id}  ${priceDef.nickname}  £${(priceDef.unitAmount / 100).toFixed(2)}`);
  }
}

console.log(`\nCreated ${createdProducts} product(s) and ${createdPrices} price(s).`);
console.log(`\nNext: mirror into D1 with:`);
console.log(`  ${mode === 'live' ? 'npm run sync:stripe:remote' : 'npm run sync:stripe:local'}`);
