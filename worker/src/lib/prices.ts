// Stripe price metadata helpers. The price row stores metadata as a raw JSON
// string (forward-compatible with whatever fields admins add in Stripe);
// these functions extract the conventional keys our worker cares about.
//
// Convention (set on each price in the Stripe dashboard):
//   category_kind: "athlete" | "addon" | "spectator"   (default "athlete")
//   addon_type:    free-form string, e.g. "campervan"   (only meaningful when category_kind="addon")

import type { StripePriceRow } from '../types';

export type PriceCategoryKind = 'athlete' | 'addon' | 'spectator';

export function priceMetadata(price: StripePriceRow): Record<string, string> {
  if (!price.metadata_json) return {};
  try {
    const parsed = JSON.parse(price.metadata_json);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

export function priceCategoryKind(price: StripePriceRow): PriceCategoryKind {
  const k = priceMetadata(price).category_kind;
  if (k === 'addon' || k === 'spectator') return k;
  return 'athlete';
}

export function priceAddonType(price: StripePriceRow): string | null {
  return priceMetadata(price).addon_type ?? null;
}
