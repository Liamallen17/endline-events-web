import { useState, useEffect } from "react";
import { Users } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

type Screen = "event" | "athlete";

interface AthleteDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  sex: "male" | "female" | "";
  runningClub: string;
}

const emptyAthlete: AthleteDetails = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  dateOfBirth: "",
  sex: "",
  runningClub: "",
};

export function TracksixRaceFinderModal({ isOpen, onClose }: Props) {
  const [screen, setScreen] = useState<Screen>("event");
  const [athlete, setAthlete] = useState<AthleteDetails>(emptyAthlete);

  useEffect(() => {
    if (isOpen) {
      setScreen("event");
    } else {
      const timeout = setTimeout(() => {
        setAthlete(emptyAthlete);
      }, 200);
      return () => clearTimeout(timeout);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = "0";
      document.body.style.right = "0";
      document.body.style.width = "100%";
      return () => {
        const top = document.body.style.top;
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.left = "";
        document.body.style.right = "";
        document.body.style.width = "";
        window.scrollTo(0, parseInt(top || "0") * -1);
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleBack = () => {
    if (screen === "athlete") setScreen("event");
  };

  const isAthleteFormValid = (a: AthleteDetails) =>
    Boolean(a.firstName && a.lastName && a.email && a.phone && a.dateOfBirth && a.sex);

  return (
    <div
      className="fixed inset-0 z-50 flex items-stretch md:items-center md:justify-center md:p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full h-full md:h-auto md:max-h-[90vh] md:max-w-lg md:rounded-lg bg-syncra-black border border-syncra-gray flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between p-4 border-b border-syncra-gray bg-syncra-black">
          <button
            onClick={screen === "event" ? onClose : handleBack}
            className="text-[#38BDF8] font-mono text-sm tracking-widest hover:opacity-80 transition-opacity"
            aria-label={screen === "event" ? "Close" : "Back"}
          >
            {screen === "event" ? "✕ CLOSE" : "← BACK"}
          </button>
          <div className="text-center">
            <h2 className="font-display text-xs tracking-widest text-white uppercase">
              {screen === "event" ? "TrackSix" : "Athlete Details"}
            </h2>
          </div>
          <div className="w-12" />
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto overscroll-contain">
          {screen === "event" && (
            <div className="p-6 space-y-6">
              <div className="flex items-center gap-3 p-5 border border-[#38BDF8]/20 rounded-xl">
                <Users size={28} className="text-[#38BDF8] shrink-0" />
                <div>
                  <h3 className="font-mono text-base text-white uppercase tracking-wider">
                    TrackSix
                  </h3>
                  <p className="font-mono text-sm text-[#38BDF8]/70 mt-1">
                    Date TBC — Northants, NN14
                  </p>
                </div>
              </div>
              <p className="font-mono text-sm text-white/60 leading-relaxed">
                6-hour team relay. Teams of 4. Most laps wins. Register your team below — full
                team details will be confirmed closer to the event.
              </p>
            </div>
          )}
          {screen === "athlete" && (
            <AthleteScreen athlete={athlete} setAthlete={setAthlete} />
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 border-t border-syncra-gray bg-syncra-black p-4">
          {screen === "event" ? (
            <button
              onClick={() => setScreen("athlete")}
              className="w-full py-4 font-mono text-sm tracking-widest uppercase bg-[#38BDF8] text-syncra-black hover:opacity-90 transition-opacity"
            >
              Register your team →
            </button>
          ) : (
            <button
              onClick={() => {
                const payload = { athlete };
                console.log(
                  "[TracksixRaceFinderModal] Placeholder payload — wire registration here:",
                  payload
                );
                alert("Registration flow coming soon. Payload logged to console.");
              }}
              disabled={!isAthleteFormValid(athlete)}
              className="w-full py-4 font-mono text-sm tracking-widest uppercase bg-[#38BDF8] text-syncra-black disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
            >
              Continue to Payment →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

interface AthleteScreenProps {
  athlete: AthleteDetails;
  setAthlete: (a: AthleteDetails) => void;
}

function AthleteScreen({ athlete, setAthlete }: AthleteScreenProps) {
  const update = (field: keyof AthleteDetails, value: string) => {
    setAthlete({ ...athlete, [field]: value });
  };

  return (
    <div className="p-4 space-y-6">
      <div className="p-4 border border-syncra-gray rounded">
        <p className="font-mono text-xs tracking-widest text-[#38BDF8] uppercase mb-1">Event</p>
        <p className="font-display text-base text-white uppercase">TrackSix</p>
        <p className="font-mono text-xs text-white/60 mt-1">4-person team relay · 6 hours</p>
      </div>

      <div>
        <h3 className="font-display text-sm text-[#38BDF8] uppercase tracking-widest mb-4">
          Athlete Details
        </h3>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="min-w-0">
              <Field
                label="First Name"
                value={athlete.firstName}
                onChange={(v) => update("firstName", v)}
              />
            </div>
            <div className="min-w-0">
              <Field
                label="Last Name"
                value={athlete.lastName}
                onChange={(v) => update("lastName", v)}
              />
            </div>
          </div>
          <Field
            label="Email"
            type="email"
            value={athlete.email}
            onChange={(v) => update("email", v)}
          />
          <Field
            label="Phone"
            type="tel"
            value={athlete.phone}
            onChange={(v) => update("phone", v)}
          />
          <div>
            <span className="block font-mono text-xs tracking-widest text-white/60 uppercase mb-1">
              Sex
            </span>
            <div className="flex gap-3">
              {(["male", "female"] as const).map((s) => (
                <label
                  key={s}
                  className={`flex-1 min-w-0 flex items-center justify-center px-3 py-3 border rounded cursor-pointer font-mono text-sm transition-colors ${
                    athlete.sex === s
                      ? "border-[#38BDF8] text-[#38BDF8]"
                      : "border-syncra-gray text-white"
                  }`}
                >
                  <input
                    type="radio"
                    name="sex-athlete"
                    value={s}
                    checked={athlete.sex === s}
                    onChange={() => update("sex", s)}
                    className="sr-only"
                  />
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </label>
              ))}
            </div>
          </div>
          <Field
            label="Date of Birth"
            type="date"
            value={athlete.dateOfBirth}
            onChange={(v) => update("dateOfBirth", v)}
          />
          <Field
            label="Running Club"
            value={athlete.runningClub}
            onChange={(v) => update("runningClub", v)}
            placeholder="Optional"
          />
        </div>
      </div>
    </div>
  );
}

interface FieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}

function Field({ label, value, onChange, type = "text", placeholder }: FieldProps) {
  return (
    <label className="block">
      <span className="block font-mono text-xs tracking-widest text-white/60 uppercase mb-1">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full max-w-full appearance-none box-border px-3 py-3 bg-transparent border border-syncra-gray rounded font-mono text-sm text-white focus:border-[#38BDF8] focus:outline-none transition-colors"
      />
    </label>
  );
}
