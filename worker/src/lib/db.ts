import type {
  AthleteRow,
  EventRow,
  TeamRow,
  TeamMemberRow,
  AthleteInput,
  StripeProductRow,
  StripePriceRow,
  StripeProductInput,
  StripePriceInput,
} from '../types';

export class Database {
  constructor(private db: D1Database) {}

  // Events
  async getEvent(id: string): Promise<EventRow | null> {
    return this.db.prepare('SELECT * FROM events WHERE id = ?').bind(id).first<EventRow>();
  }

  async getPublishedEvents(): Promise<EventRow[]> {
    const result = await this.db
      .prepare('SELECT * FROM events WHERE is_published = 1 ORDER BY event_date ASC')
      .all<EventRow>();
    return result.results;
  }

  async isRegistrationOpen(event: EventRow): Promise<boolean> {
    const now = new Date().toISOString();
    if (event.registration_opens_at && now < event.registration_opens_at) return false;
    if (event.registration_closes_at && now > event.registration_closes_at) return false;
    return true;
  }

  // Athletes
  async getAthlete(email: string): Promise<AthleteRow | null> {
    return this.db
      .prepare('SELECT * FROM athletes WHERE email = ?')
      .bind(email.toLowerCase().trim())
      .first<AthleteRow>();
  }

  async upsertAthlete(athlete: AthleteInput): Promise<void> {
    const email = athlete.email.toLowerCase().trim();
    await this.db
      .prepare(`
        INSERT INTO athletes (email, name, gender, run_club)
        VALUES (?, ?, ?, ?)
        ON CONFLICT(email) DO UPDATE SET
          name = excluded.name,
          gender = excluded.gender,
          run_club = excluded.run_club,
          updated_at = datetime('now')
      `)
      .bind(email, athlete.name, athlete.gender ?? null, athlete.runClub ?? null)
      .run();
  }

  // Teams
  async createTeam(id: string, eventId: string, name?: string): Promise<void> {
    await this.db
      .prepare('INSERT INTO teams (id, event_id, name) VALUES (?, ?, ?)')
      .bind(id, eventId, name ?? null)
      .run();
  }

  async getTeam(id: string): Promise<TeamRow | null> {
    return this.db.prepare('SELECT * FROM teams WHERE id = ?').bind(id).first<TeamRow>();
  }

  async getTeamByStripeSession(sessionId: string): Promise<TeamRow | null> {
    return this.db
      .prepare('SELECT * FROM teams WHERE stripe_session_id = ?')
      .bind(sessionId)
      .first<TeamRow>();
  }

  async updateTeamStripeSession(teamId: string, sessionId: string): Promise<void> {
    await this.db
      .prepare('UPDATE teams SET stripe_session_id = ? WHERE id = ?')
      .bind(sessionId, teamId)
      .run();
  }

  async markTeamPaid(teamId: string): Promise<void> {
    await this.db
      .prepare(`UPDATE teams SET payment_status = 'paid', paid_at = datetime('now') WHERE id = ?`)
      .bind(teamId)
      .run();
  }

  async markTeamFailed(teamId: string): Promise<void> {
    await this.db
      .prepare(`UPDATE teams SET payment_status = 'failed' WHERE id = ?`)
      .bind(teamId)
      .run();
  }

  async markTeamRefunded(teamId: string): Promise<void> {
    await this.db
      .prepare(`UPDATE teams SET payment_status = 'refunded' WHERE id = ?`)
      .bind(teamId)
      .run();
  }

  // Stripe product/price mirror (kept in sync via webhook)
  async getStripeProduct(id: string): Promise<StripeProductRow | null> {
    return this.db
      .prepare('SELECT * FROM stripe_products WHERE id = ?')
      .bind(id)
      .first<StripeProductRow>();
  }

  async getStripePrice(id: string): Promise<StripePriceRow | null> {
    return this.db
      .prepare('SELECT * FROM stripe_prices WHERE id = ?')
      .bind(id)
      .first<StripePriceRow>();
  }

  async getEventPrices(eventId: string): Promise<StripePriceRow[]> {
    const result = await this.db
      .prepare(`
        SELECT p.*
        FROM stripe_prices p
        JOIN stripe_products pr ON p.product_id = pr.id
        WHERE pr.event_id = ? AND p.active = 1 AND pr.active = 1
        ORDER BY p.unit_amount ASC, p.id ASC
      `)
      .bind(eventId)
      .all<StripePriceRow>();
    return result.results;
  }

  async upsertStripeProduct(p: StripeProductInput): Promise<void> {
    await this.db
      .prepare(`
        INSERT INTO stripe_products (id, name, description, active, event_id, metadata_json, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, datetime('now'))
        ON CONFLICT(id) DO UPDATE SET
          name = excluded.name,
          description = excluded.description,
          active = excluded.active,
          event_id = excluded.event_id,
          metadata_json = excluded.metadata_json,
          updated_at = excluded.updated_at
      `)
      .bind(
        p.id,
        p.name,
        p.description,
        p.active ? 1 : 0,
        p.eventId,
        p.metadata ? JSON.stringify(p.metadata) : null
      )
      .run();
  }

  async deactivateStripeProduct(id: string): Promise<void> {
    await this.db
      .prepare(`UPDATE stripe_products SET active = 0, updated_at = datetime('now') WHERE id = ?`)
      .bind(id)
      .run();
  }

  async upsertStripePrice(p: StripePriceInput): Promise<void> {
    await this.db
      .prepare(`
        INSERT INTO stripe_prices
          (id, product_id, nickname, unit_amount, currency, active, min_team_size, max_team_size, metadata_json, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
        ON CONFLICT(id) DO UPDATE SET
          product_id = excluded.product_id,
          nickname = excluded.nickname,
          unit_amount = excluded.unit_amount,
          currency = excluded.currency,
          active = excluded.active,
          min_team_size = excluded.min_team_size,
          max_team_size = excluded.max_team_size,
          metadata_json = excluded.metadata_json,
          updated_at = excluded.updated_at
      `)
      .bind(
        p.id,
        p.productId,
        p.nickname,
        p.unitAmount,
        p.currency,
        p.active ? 1 : 0,
        p.minTeamSize,
        p.maxTeamSize,
        p.metadata ? JSON.stringify(p.metadata) : null
      )
      .run();
  }

  async deactivateStripePrice(id: string): Promise<void> {
    await this.db
      .prepare(`UPDATE stripe_prices SET active = 0, updated_at = datetime('now') WHERE id = ?`)
      .bind(id)
      .run();
  }

  // Returns true if the event id was newly recorded, false if it was a duplicate.
  // Handlers must remain idempotent regardless — this is best-effort observability,
  // not a correctness gate.
  async recordStripeEvent(id: string, type: string): Promise<boolean> {
    const result = await this.db
      .prepare(`INSERT INTO stripe_events (id, type) VALUES (?, ?) ON CONFLICT(id) DO NOTHING`)
      .bind(id, type)
      .run();
    return (result.meta.changes ?? 0) > 0;
  }

  // Team Members
  async addTeamMember(teamId: string, athleteEmail: string, role: 'captain' | 'member'): Promise<void> {
    await this.db
      .prepare('INSERT INTO team_members (team_id, athlete_email, role) VALUES (?, ?, ?)')
      .bind(teamId, athleteEmail.toLowerCase().trim(), role)
      .run();
  }

  async getTeamMembers(teamId: string): Promise<(TeamMemberRow & AthleteRow)[]> {
    const result = await this.db
      .prepare(`
        SELECT tm.*, a.name, a.gender, a.run_club
        FROM team_members tm
        JOIN athletes a ON tm.athlete_email = a.email
        WHERE tm.team_id = ?
        ORDER BY tm.role DESC, a.name ASC
      `)
      .bind(teamId)
      .all<TeamMemberRow & AthleteRow>();
    return result.results;
  }

  // Queries for event management
  async getEventTeams(eventId: string, paidOnly = true): Promise<TeamRow[]> {
    const query = paidOnly
      ? 'SELECT * FROM teams WHERE event_id = ? AND payment_status = ? ORDER BY paid_at ASC'
      : 'SELECT * FROM teams WHERE event_id = ? ORDER BY created_at ASC';
    
    const result = paidOnly
      ? await this.db.prepare(query).bind(eventId, 'paid').all<TeamRow>()
      : await this.db.prepare(query).bind(eventId).all<TeamRow>();
    
    return result.results;
  }

  async getEventRoster(eventId: string): Promise<Array<{
    team_id: string;
    team_name: string | null;
    athlete_name: string;
    athlete_email: string;
    gender: string | null;
    run_club: string | null;
    role: string;
  }>> {
    const result = await this.db
      .prepare(`
        SELECT 
          t.id as team_id,
          t.name as team_name,
          a.name as athlete_name,
          a.email as athlete_email,
          a.gender,
          a.run_club,
          tm.role
        FROM teams t
        JOIN team_members tm ON t.id = tm.team_id
        JOIN athletes a ON tm.athlete_email = a.email
        WHERE t.event_id = ? AND t.payment_status = 'paid'
        ORDER BY t.name, tm.role DESC, a.name
      `)
      .bind(eventId)
      .all();
    return result.results as any;
  }

  async getAthleteHistory(email: string): Promise<Array<{
    event_id: string;
    event_name: string;
    event_date: string | null;
    team_name: string | null;
    payment_status: string;
  }>> {
    const result = await this.db
      .prepare(`
        SELECT 
          e.id as event_id,
          e.name as event_name,
          e.event_date,
          t.name as team_name,
          t.payment_status
        FROM events e
        JOIN teams t ON e.id = t.event_id
        JOIN team_members tm ON t.id = tm.team_id
        WHERE tm.athlete_email = ?
        ORDER BY e.event_date DESC
      `)
      .bind(email.toLowerCase().trim())
      .all();
    return result.results as any;
  }

  // Batch operations for atomic team creation
  async createTeamWithMembers(
    teamId: string,
    eventId: string,
    priceId: string,
    teamName: string | undefined,
    athletes: AthleteInput[]
  ): Promise<void> {
    const statements: D1PreparedStatement[] = [];

    // Upsert all athletes
    for (const athlete of athletes) {
      const email = athlete.email.toLowerCase().trim();
      statements.push(
        this.db
          .prepare(`
            INSERT INTO athletes (email, name, gender, run_club)
            VALUES (?, ?, ?, ?)
            ON CONFLICT(email) DO UPDATE SET
              name = excluded.name,
              gender = excluded.gender,
              run_club = excluded.run_club,
              updated_at = datetime('now')
          `)
          .bind(email, athlete.name, athlete.gender ?? null, athlete.runClub ?? null)
      );
    }

    // Create team with both event and price linkage
    statements.push(
      this.db
        .prepare('INSERT INTO teams (id, event_id, stripe_price_id, name) VALUES (?, ?, ?, ?)')
        .bind(teamId, eventId, priceId, teamName ?? null)
    );

    // Add all team members
    for (const athlete of athletes) {
      const email = athlete.email.toLowerCase().trim();
      statements.push(
        this.db
          .prepare('INSERT INTO team_members (team_id, athlete_email, role) VALUES (?, ?, ?)')
          .bind(teamId, email, athlete.isCaptain ? 'captain' : 'member')
      );
    }

    await this.db.batch(statements);
  }
}
