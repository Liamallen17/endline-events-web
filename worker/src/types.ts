export interface Env {
  DB: D1Database;
  STRIPE_SECRET_KEY: string;
  STRIPE_WEBHOOK_SECRET: string;
  SITE_URL: string;
}

// Database row types
export interface AthleteRow {
  email: string;
  name: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  date_of_birth: string | null;
  gender: 'male' | 'female' | 'other' | 'unspecified' | null;
  run_club: string | null;
  created_at: string;
  updated_at: string;
}

export interface EventRow {
  id: string;
  name: string;
  description: string | null;
  event_date: string | null;
  min_team_size: number;
  max_team_size: number;
  stripe_price_id: string;
  registration_opens_at: string | null;
  registration_closes_at: string | null;
  is_published: number;
  created_at: string;
}

export interface TeamRow {
  id: string;
  event_id: string;
  stripe_price_id: string | null;
  name: string | null;
  stripe_session_id: string | null;
  vehicle_reg: string | null;
  payment_status: 'pending' | 'paid' | 'refunded' | 'failed';
  paid_at: string | null;
  created_at: string;
}

export interface TeamMemberRow {
  team_id: string;
  athlete_email: string;
  role: 'captain' | 'member';
  added_at: string;
}

export interface StripeProductRow {
  id: string;
  name: string;
  description: string | null;
  active: number;
  event_id: string | null;
  metadata_json: string | null;
  updated_at: string;
}

export interface StripePriceRow {
  id: string;
  product_id: string;
  nickname: string | null;
  unit_amount: number | null;
  currency: string;
  active: number;
  min_team_size: number | null;
  max_team_size: number | null;
  metadata_json: string | null;
  updated_at: string;
}

export interface StripeEventRow {
  id: string;
  type: string;
  processed_at: string;
}

export interface StripeProductInput {
  id: string;
  name: string;
  description: string | null;
  active: boolean;
  eventId: string | null;
  metadata: Record<string, string> | null;
}

export interface StripePriceInput {
  id: string;
  productId: string;
  nickname: string | null;
  unitAmount: number | null;
  currency: string;
  active: boolean;
  minTeamSize: number | null;
  maxTeamSize: number | null;
  metadata: Record<string, string> | null;
}

// API request/response types
//
// AthleteInput accepts either the legacy combined `name` field or split
// `firstName`/`lastName`. The API layer reconciles: when first/last are
// supplied, `name` is derived as their concatenation so the NOT NULL
// `athletes.name` column stays satisfied for back-compat with old rows.
export interface AthleteInput {
  email: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other' | 'unspecified';
  runClub?: string;
  isCaptain?: boolean;
}

export interface SpectatorPassRow {
  id: string;
  event_id: string;
  stripe_session_id: string | null;
  stripe_price_id: string | null;
  payment_status: 'pending' | 'paid' | 'refunded' | 'failed';
  paid_at: string | null;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  vehicle_reg: string | null;
  created_at: string;
}

export interface SpectatorPassInput {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
}

export interface RegisterTeamRequest {
  priceId: string;
  teamName?: string;
  athletes: AthleteInput[];
}

export interface RegisterTeamResponse {
  url: string;
  teamId: string;
}

export interface EventPriceView {
  id: string;
  productId: string;
  nickname: string | null;
  unitAmount: number | null;
  currency: string;
  minTeamSize: number | null;
  maxTeamSize: number | null;
}

export interface ApiError {
  error: string;
  code?: string;
}
