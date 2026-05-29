// Hand-edited from the auto-generated export: one product per category so
// Stripe Checkout shows distinct line item names ("24 Hour Pairs" + "Campervan"
// rather than "BBU 26.2" twice).
//
// WARNING: `npm run stripe:export -- --slug=bbu-26-2` will overwrite this file.
// If you re-export, re-apply this restructure or keep a copy first.
//
// Nicknames match the CATEGORY_PRESENTATION keys in
// components/RaceFinderModal.tsx so the frontend pairs each price with its
// long description and icon.

import type { EventDefinition } from './_types';

export const definition: EventDefinition = {
  eventSlug: 'bbu-26-2',
  products: [
    {
      name: 'Last Man Standing',
      description: null,
      metadata: { event_id: 'bbu-26-2' },
      prices: [
        {
          nickname: 'Last Man Standing',
          unitAmount: 9500,
          currency: 'gbp',
          metadata: {
            category_kind: 'athlete',
            min_team_size: '1',
            max_team_size: '1',
          },
        },
      ],
    },
    {
      name: '24 Hour Pairs',
      description: null,
      metadata: { event_id: 'bbu-26-2' },
      prices: [
        {
          nickname: '24 Hour Pairs',
          unitAmount: 10500,
          currency: 'gbp',
          metadata: {
            category_kind: 'athlete',
            min_team_size: '2',
            max_team_size: '2',
          },
        },
      ],
    },
    {
      name: '12 Hour Solo',
      description: null,
      metadata: { event_id: 'bbu-26-2' },
      prices: [
        {
          nickname: '12 Hour Solo',
          unitAmount: 7000,
          currency: 'gbp',
          metadata: {
            category_kind: 'athlete',
            min_team_size: '1',
            max_team_size: '1',
          },
        },
      ],
    },
    {
      name: '12 Hour Pairs',
      description: null,
      metadata: { event_id: 'bbu-26-2' },
      prices: [
        {
          nickname: '12 Hour Pairs',
          unitAmount: 8000,
          currency: 'gbp',
          metadata: {
            category_kind: 'athlete',
            min_team_size: '2',
            max_team_size: '2',
          },
        },
      ],
    },
    {
      name: 'Spectator Pass',
      description: null,
      metadata: { event_id: 'bbu-26-2' },
      prices: [
        {
          nickname: 'Spectator Pass',
          unitAmount: 200,
          currency: 'gbp',
          metadata: {
            category_kind: 'spectator',
          },
        },
      ],
    },
    {
      name: 'Campervan',
      description: null,
      metadata: { event_id: 'bbu-26-2' },
      prices: [
        {
          nickname: 'Campervan',
          unitAmount: 1500,
          currency: 'gbp',
          metadata: {
            category_kind: 'addon',
            addon_type: 'campervan',
          },
        },
      ],
    },
  ],
};
