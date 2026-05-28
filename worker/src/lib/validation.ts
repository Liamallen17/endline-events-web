import type { AthleteInput, SpectatorPassInput, StripePriceRow } from '../types';

export class ValidationError extends Error {
  constructor(
    message: string,
    public code: string = 'VALIDATION_ERROR'
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}

export function validateEmail(email: string): string {
  const normalised = email.toLowerCase().trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!emailRegex.test(normalised)) {
    throw new ValidationError(`Invalid email address: ${email}`, 'INVALID_EMAIL');
  }
  
  return normalised;
}

// Accept "Male"/"Female"/"Other"/"Unspecified" (colleague's modal sends
// title-case via a `sex` field) and normalise to our lowercase enum.
function normaliseGender(raw: unknown): AthleteInput['gender'] | undefined {
  if (raw === undefined || raw === null || raw === '') return undefined;
  if (typeof raw !== 'string') {
    throw new ValidationError('Invalid gender', 'INVALID_GENDER');
  }
  const v = raw.trim().toLowerCase();
  if (v === 'male' || v === 'female' || v === 'other' || v === 'unspecified') return v;
  throw new ValidationError(
    'Invalid gender. Must be one of: male, female, other, unspecified',
    'INVALID_GENDER'
  );
}

function validateDateOfBirth(raw: unknown): string | undefined {
  if (raw === undefined || raw === null || raw === '') return undefined;
  if (typeof raw !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
    throw new ValidationError('Date of birth must be YYYY-MM-DD', 'INVALID_DOB');
  }
  const d = new Date(`${raw}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) {
    throw new ValidationError('Date of birth is not a real date', 'INVALID_DOB');
  }
  return raw;
}

export function validateAthlete(athlete: unknown): AthleteInput {
  if (!athlete || typeof athlete !== 'object') {
    throw new ValidationError('Invalid athlete data', 'INVALID_ATHLETE');
  }

  const a = athlete as Record<string, unknown>;

  // Accept either a combined `name` or split `firstName`/`lastName`.
  const firstName = typeof a.firstName === 'string' ? a.firstName.trim() : '';
  const lastName = typeof a.lastName === 'string' ? a.lastName.trim() : '';
  const combined = typeof a.name === 'string' ? a.name.trim() : '';

  if (!combined && !(firstName && lastName)) {
    throw new ValidationError(
      'Athlete name is required (provide either name or firstName + lastName)',
      'MISSING_NAME'
    );
  }

  if (typeof a.email !== 'string') {
    throw new ValidationError('Athlete email is required', 'MISSING_EMAIL');
  }

  const email = validateEmail(a.email);

  // `sex` is the colleague's modal's field name for gender — accept both.
  const gender = normaliseGender(a.gender ?? a.sex);

  // `dob` is the colleague's modal's field name — accept both.
  const dateOfBirth = validateDateOfBirth(a.dateOfBirth ?? a.dob);

  const phone = typeof a.phone === 'string' ? a.phone.trim() || undefined : undefined;
  // `runningClub` is the colleague's modal's field name — accept both.
  const runClubRaw = typeof a.runClub === 'string' ? a.runClub : (typeof a.runningClub === 'string' ? a.runningClub : '');
  const runClub = runClubRaw.trim() || undefined;

  return {
    email,
    name: combined || undefined,
    firstName: firstName || undefined,
    lastName: lastName || undefined,
    phone,
    dateOfBirth,
    gender,
    runClub,
    isCaptain: a.isCaptain === true,
  };
}

export function validateSpectatorPass(spectator: unknown): SpectatorPassInput {
  if (!spectator || typeof spectator !== 'object') {
    throw new ValidationError('Invalid spectator data', 'INVALID_SPECTATOR');
  }

  const s = spectator as Record<string, unknown>;
  const firstName = typeof s.firstName === 'string' ? s.firstName.trim() : '';
  const lastName = typeof s.lastName === 'string' ? s.lastName.trim() : '';

  if (!firstName) {
    throw new ValidationError('Spectator first name is required', 'MISSING_NAME');
  }
  if (!lastName) {
    throw new ValidationError('Spectator last name is required', 'MISSING_NAME');
  }
  if (typeof s.email !== 'string') {
    throw new ValidationError('Spectator email is required', 'MISSING_EMAIL');
  }

  const email = validateEmail(s.email);
  const phone = typeof s.phone === 'string' ? s.phone.trim() || undefined : undefined;

  return { firstName, lastName, email, phone };
}

export function validateAddOns(raw: unknown): Array<{ priceId: string; quantity: number }> {
  if (raw === undefined || raw === null) return [];
  if (!Array.isArray(raw)) {
    throw new ValidationError('addOns must be an array', 'INVALID_ADDONS');
  }
  return raw.map((item, i) => {
    if (!item || typeof item !== 'object') {
      throw new ValidationError(`addOns[${i}] is not an object`, 'INVALID_ADDONS');
    }
    const o = item as Record<string, unknown>;
    if (typeof o.priceId !== 'string' || !o.priceId.trim()) {
      throw new ValidationError(`addOns[${i}].priceId is required`, 'INVALID_ADDONS');
    }
    const quantity = typeof o.quantity === 'number' && Number.isInteger(o.quantity) && o.quantity > 0 ? o.quantity : 1;
    return { priceId: o.priceId, quantity };
  });
}

export function validateTeamSize(athletes: AthleteInput[], price: StripePriceRow): void {
  // If the price doesn't carry size constraints in metadata, treat it as solo.
  // This is the safe default: a misconfigured price won't silently allow
  // arbitrarily large teams.
  const min = price.min_team_size ?? 1;
  const max = price.max_team_size ?? 1;

  if (athletes.length < min) {
    throw new ValidationError(
      `Team must have at least ${min} member(s)`,
      'TEAM_TOO_SMALL'
    );
  }

  if (athletes.length > max) {
    throw new ValidationError(
      `Team can have at most ${max} member(s)`,
      'TEAM_TOO_LARGE'
    );
  }
}

export function validateUniqueEmails(athletes: AthleteInput[]): void {
  const emails = athletes.map((a) => a.email);
  const unique = new Set(emails);

  if (unique.size !== emails.length) {
    throw new ValidationError(
      'Each team member must have a unique email address',
      'DUPLICATE_EMAILS'
    );
  }
}

export function ensureCaptain(athletes: AthleteInput[]): AthleteInput[] {
  const hasCaptain = athletes.some((a) => a.isCaptain);
  
  if (!hasCaptain && athletes.length > 0) {
    // First athlete is captain by default
    return athletes.map((a, i) => (i === 0 ? { ...a, isCaptain: true } : a));
  }
  
  return athletes;
}
