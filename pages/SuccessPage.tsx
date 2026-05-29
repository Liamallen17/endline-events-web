import React, { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Loader2 } from 'lucide-react';

interface TeamResponse {
  team: { id: string; name: string | null; paymentStatus: string; paidAt: string | null; vehicleReg: string | null };
  event: { id: string; name: string; eventDate: string | null } | null;
  price: { id: string; nickname: string | null; unitAmount: number | null; currency: string } | null;
  members: Array<{ name: string; email: string; gender: string | null; runClub: string | null; role: string }>;
}

interface PassResponse {
  pass: {
    id: string;
    paymentStatus: string;
    paidAt: string | null;
    firstName: string;
    lastName: string;
    email: string;
    phone: string | null;
    vehicleReg: string | null;
  };
  event: { id: string; name: string; eventDate: string | null } | null;
  price: { id: string; nickname: string | null; unitAmount: number | null; currency: string } | null;
}

type Loaded =
  | { kind: 'team'; data: TeamResponse }
  | { kind: 'pass'; data: PassResponse };

function pounds(unitAmount: number | null | undefined): string {
  if (unitAmount == null) return '—';
  const v = unitAmount / 100;
  return `£${v.toFixed(v % 1 === 0 ? 0 : 2)}`;
}

export const SuccessPage: React.FC = () => {
  const [params] = useSearchParams();
  const teamId = params.get('team');
  const passId = params.get('pass');

  const [loaded, setLoaded] = useState<Loaded | null>(null);
  const [error, setError] = useState<string | null>(null);
  const stopPollingRef = useRef(false);

  useEffect(() => {
    stopPollingRef.current = false;
    if (!teamId && !passId) {
      setError('Missing registration reference.');
      return;
    }

    const endpoint = teamId
      ? `/api/register/${encodeURIComponent(teamId)}`
      : `/api/spectator-checkout/${encodeURIComponent(passId!)}`;
    const kind: Loaded['kind'] = teamId ? 'team' : 'pass';

    const fetchOnce = async (): Promise<string | null> => {
      try {
        const r = await fetch(endpoint);
        if (!r.ok) {
          if (r.status === 404) return 'Registration not found.';
          return 'Could not load registration.';
        }
        const json = (await r.json()) as TeamResponse | PassResponse;
        setLoaded({ kind, data: json } as Loaded);
        return null;
      } catch {
        return 'Could not load registration.';
      }
    };

    // Stripe redirects users back as soon as payment is captured but the
    // webhook is async — payment_status may still be "pending" for a
    // second or two. Poll every 2s until we see "paid" (or 30s elapses).
    const start = Date.now();
    const tick = async () => {
      if (stopPollingRef.current) return;
      const err = await fetchOnce();
      if (err) {
        setError(err);
        return;
      }
      // Check if we're still pending and within the poll window
      const elapsed = Date.now() - start;
      // Re-read loaded after setLoaded — use a small timeout to let state settle
      setLoaded((current) => {
        if (!current) return current;
        const status =
          current.kind === 'team' ? current.data.team.paymentStatus : current.data.pass.paymentStatus;
        if (status === 'pending' && elapsed < 30_000 && !stopPollingRef.current) {
          setTimeout(tick, 2_000);
        }
        return current;
      });
    };
    tick();

    return () => {
      stopPollingRef.current = true;
    };
  }, [teamId, passId]);

  return (
    <div className="min-h-screen bg-syncra-black text-syncra-lime selection:bg-syncra-lime selection:text-syncra-black">
      <Link
        to="/"
        className="fixed top-6 left-6 md:top-8 md:left-12 z-50 flex items-center gap-2 text-syncra-lime hover:opacity-70 transition-opacity bg-syncra-black/80 backdrop-blur-sm px-4 py-2 rounded-full"
      >
        <ArrowLeft size={20} />
        <span className="text-sm font-mono uppercase">Back to home</span>
      </Link>

      <main className="container py-32 max-w-2xl mx-auto">
        {error ? (
          <Status
            icon={<span className="text-4xl">✕</span>}
            title="Something went wrong"
            body={error}
          />
        ) : !loaded ? (
          <Status
            icon={<Loader2 size={56} className="animate-spin" />}
            title="Loading your registration…"
            body="One moment."
          />
        ) : (
          <Confirmation loaded={loaded} />
        )}
      </main>
    </div>
  );
};

interface ConfirmationProps {
  loaded: Loaded;
}

function Confirmation({ loaded }: ConfirmationProps) {
  const status =
    loaded.kind === 'team' ? loaded.data.team.paymentStatus : loaded.data.pass.paymentStatus;
  const event = loaded.data.event;
  const price = loaded.data.price;
  const isPending = status === 'pending';
  const isPaid = status === 'paid';
  const isOther = !isPending && !isPaid;

  const heading = isPaid ? "You're in!" : isPending ? 'Confirming your payment…' : 'Payment issue';
  const subheading = isPaid
    ? "We've received your registration and payment."
    : isPending
      ? 'Stripe has captured your card. We just need a moment to record the registration.'
      : `Payment status: ${status}. If this is unexpected, please email endlineevents@gmail.com.`;

  return (
    <div>
      <div className="flex flex-col items-center text-center mb-12">
        {isPaid ? (
          <CheckCircle2 size={64} className="text-syncra-lime mb-6" />
        ) : isPending ? (
          <Loader2 size={56} className="animate-spin text-syncra-lime mb-6" />
        ) : (
          <span className="text-5xl mb-6">⚠︎</span>
        )}
        <h1 className="font-display text-3xl md:text-4xl text-white uppercase tracking-widest mb-3">
          {heading}
        </h1>
        <p className="font-mono text-sm md:text-base text-syncra-lime/80 max-w-md">{subheading}</p>
      </div>

      <div className="border border-syncra-lime/30 rounded-lg p-6 md:p-8 space-y-4">
        {event && (
          <Row label="Event">
            {event.name}
            {event.eventDate && (
              <span className="block font-mono text-xs text-white/60 mt-1">{event.eventDate}</span>
            )}
          </Row>
        )}
        {price && (
          <Row label="Category">
            {price.nickname ?? '—'}
            <span className="block font-mono text-xs text-white/60 mt-1">{pounds(price.unitAmount)}</span>
          </Row>
        )}
        {loaded.kind === 'team' ? (
          <TeamDetails data={loaded.data} />
        ) : (
          <PassDetails data={loaded.data} />
        )}
      </div>

      {isPaid && (
        <p className="font-mono text-sm text-syncra-lime/70 text-center mt-8">
          A confirmation email is on its way. Questions? <a className="underline" href="mailto:endlineevents@gmail.com">endlineevents@gmail.com</a>
        </p>
      )}

      {isOther && (
        <p className="font-mono text-sm text-syncra-lime/70 text-center mt-8">
          If you've been charged, please contact us at{' '}
          <a className="underline" href="mailto:endlineevents@gmail.com">endlineevents@gmail.com</a>
        </p>
      )}
    </div>
  );
}

function TeamDetails({ data }: { data: TeamResponse }) {
  return (
    <>
      {data.team.name && (
        <Row label="Team name">{data.team.name}</Row>
      )}
      <Row label={data.members.length > 1 ? 'Athletes' : 'Athlete'}>
        <ul className="space-y-1">
          {data.members.map((m) => (
            <li key={m.email} className="text-white">
              {m.name}
              {m.role === 'captain' && (
                <span className="font-mono text-xs text-syncra-lime/60 ml-2 uppercase tracking-widest">Captain</span>
              )}
            </li>
          ))}
        </ul>
      </Row>
      {data.team.vehicleReg && (
        <Row label="Campervan">{data.team.vehicleReg}</Row>
      )}
    </>
  );
}

function PassDetails({ data }: { data: PassResponse }) {
  return (
    <>
      <Row label="Spectator">
        {data.pass.firstName} {data.pass.lastName}
        <span className="block font-mono text-xs text-white/60 mt-1">{data.pass.email}</span>
      </Row>
      {data.pass.vehicleReg && <Row label="Campervan">{data.pass.vehicleReg}</Row>}
    </>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col md:flex-row md:items-baseline md:gap-6 border-b border-syncra-lime/10 pb-4 last:border-0 last:pb-0">
      <span className="font-mono text-xs tracking-widest text-syncra-lime/70 uppercase shrink-0 md:w-32">
        {label}
      </span>
      <div className="font-mono text-base text-white">{children}</div>
    </div>
  );
}

function Status({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="text-syncra-lime mb-6">{icon}</div>
      <h1 className="font-display text-2xl md:text-3xl text-white uppercase tracking-widest mb-3">{title}</h1>
      <p className="font-mono text-sm text-syncra-lime/80 max-w-md">{body}</p>
      <Link
        to="/"
        className="mt-8 inline-block px-8 py-3 border border-syncra-lime text-syncra-lime uppercase tracking-widest font-mono text-sm hover:bg-syncra-lime hover:text-syncra-black transition-colors"
      >
        Back to home
      </Link>
    </div>
  );
}
