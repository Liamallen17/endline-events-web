import type { AthleteInput, StripePriceRow } from '../types';

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

export function validateAthlete(athlete: unknown): AthleteInput {
  if (!athlete || typeof athlete !== 'object') {
    throw new ValidationError('Invalid athlete data', 'INVALID_ATHLETE');
  }

  const a = athlete as Record<string, unknown>;

  if (typeof a.name !== 'string' || a.name.trim().length === 0) {
    throw new ValidationError('Athlete name is required', 'MISSING_NAME');
  }

  if (typeof a.email !== 'string') {
    throw new ValidationError('Athlete email is required', 'MISSING_EMAIL');
  }

  const email = validateEmail(a.email);

  const validGenders = ['male', 'female', 'other', 'unspecified'];
  let gender: AthleteInput['gender'] = undefined;
  
  if (a.gender !== undefined && a.gender !== null && a.gender !== '') {
    if (typeof a.gender !== 'string' || !validGenders.includes(a.gender)) {
      throw new ValidationError(
        `Invalid gender. Must be one of: ${validGenders.join(', ')}`,
        'INVALID_GENDER'
      );
    }
    gender = a.gender as AthleteInput['gender'];
  }

  return {
    email,
    name: a.name.trim(),
    gender,
    runClub: typeof a.runClub === 'string' ? a.runClub.trim() || undefined : undefined,
    isCaptain: a.isCaptain === true,
  };
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
