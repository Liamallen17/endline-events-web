import { useState, useEffect } from "react";
import { User, Users } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  initialCategory?: Category;
  eventLabel?: string;
}

type Screen = "categories" | "checkout";

export interface Category {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  price: number;
  perPerson?: number;
  isPair: boolean;
}

interface AthleteDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
}

export const CATEGORIES: Category[] = [
  {
    id: "last-man-standing",
    name: "Last Man Standing",
    subtitle: "Individual Entry",
    description: "The ultimate individual test — run 6.7km every single hour. Pure grit and determination.",
    icon: User,
    price: 95,
    isPair: false,
  },
  {
    id: "24-hour-pairs",
    name: "24 Hour Pairs",
    subtitle: "Team Entry",
    description: "Tag-team endurance — partners alternate hourly laps across the full 24-hour window. Strategy meets stamina.",
    icon: Users,
    price: 105,
    perPerson: 52.5,
    isPair: true,
  },
  {
    id: "12-hour-solo",
    name: "12 Hour Solo",
    subtitle: "Individual 12-Hour Challenge",
    description: "A 12-hour solo gauntlet. The perfect entry point into the world of endurance sport — challenging, relentless, and unforgettable.",
    icon: User,
    price: 70,
    isPair: false,
  },
  {
    id: "12-hour-pairs",
    name: "12 Hour Pairs",
    subtitle: "Team Entry 12-Hour Challenge",
    description: "Twelve hours shared between two. A gateway into endurance sport built on trust, timing, and teamwork.",
    icon: Users,
    price: 80,
    perPerson: 40,
    isPair: true,
  },
];

const CAMPERVAN_PRICE = 15;

const emptyAthlete: AthleteDetails = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  dateOfBirth: "",
  emergencyContactName: "",
  emergencyContactPhone: "",
};

export default function RaceFinderModal({ isOpen, onClose, initialCategory, eventLabel }: Props) {
  const [screen, setScreen] = useState<Screen>("categories");
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [athleteStep, setAthleteStep] = useState<1 | 2>(1);
  const [athlete1, setAthlete1] = useState<AthleteDetails>(emptyAthlete);
  const [athlete2, setAthlete2] = useState<AthleteDetails>(emptyAthlete);
  const [campervan, setCampervan] = useState(false);
  const [vehicleReg, setVehicleReg] = useState("");

  useEffect(() => {
    if (isOpen) {
      setScreen(initialCategory ? "checkout" : "categories");
      setSelectedCategory(initialCategory ?? null);
      setAthleteStep(1);
    } else {
      const timeout = setTimeout(() => {
        setAthlete1(emptyAthlete);
        setAthlete2(emptyAthlete);
        setCampervan(false);
        setVehicleReg("");
      }, 200);
      return () => clearTimeout(timeout);
    }
  }, [isOpen, initialCategory]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const total = selectedCategory
    ? selectedCategory.price + (campervan ? CAMPERVAN_PRICE : 0)
    : 0;

  const handleCategorySelect = (category: Category) => {
    setSelectedCategory(category);
    setScreen("checkout");
    setAthleteStep(1);
  };

  const handleBack = () => {
    if (screen === "checkout") {
      if (selectedCategory?.isPair && athleteStep === 2) {
        setAthleteStep(1);
      } else {
        setScreen("categories");
        setSelectedCategory(null);
      }
    }
  };

  const handleContinue = () => {
    if (selectedCategory?.isPair && athleteStep === 1) {
      setAthleteStep(2);
      return;
    }
    const payload = {
      category: selectedCategory,
      athletes: selectedCategory?.isPair ? [athlete1, athlete2] : [athlete1],
      campervan: campervan ? { vehicleReg } : null,
      total,
    };
    console.log("[RaceFinderModal] Checkout payload — wire to Stripe here:", payload);
    alert("Stripe checkout will be wired here. Payload logged to console.");
  };

  const currentAthlete = athleteStep === 1 ? athlete1 : athlete2;
  const setCurrentAthlete = athleteStep === 1 ? setAthlete1 : setAthlete2;

  const isAthleteFormValid = (a: AthleteDetails) =>
    a.firstName && a.lastName && a.email && a.phone && a.dateOfBirth;

  const canContinue = (() => {
    if (!selectedCategory) return false;
    if (selectedCategory.isPair && athleteStep === 1) {
      return isAthleteFormValid(athlete1);
    }
    if (selectedCategory.isPair && athleteStep === 2) {
      return isAthleteFormValid(athlete2) && (!campervan || vehicleReg.length > 0);
    }
    return isAthleteFormValid(athlete1) && (!campervan || vehicleReg.length > 0);
  })();

  return (
    <div
      className="fixed inset-0 z-50 flex items-stretch md:items-center md:justify-center md:p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full h-full md:h-auto md:max-h-[90vh] md:max-w-lg md:rounded-lg bg-syncra-black border border-syncra-gray flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between p-4 border-b border-syncra-gray bg-syncra-black">
          <button
            onClick={screen === "categories" ? onClose : handleBack}
            className="text-syncra-lime font-mono text-sm tracking-widest hover:opacity-80 transition-opacity"
            aria-label={screen === "categories" ? "Close" : "Back"}
          >
            {screen === "categories" ? "✕ CLOSE" : "← BACK"}
          </button>
          <div className="text-center">
            <h2 className="font-display text-xs tracking-widest text-white uppercase">
              {screen === "categories"
                ? "Select Category"
                : selectedCategory?.isPair
                ? `Athlete ${athleteStep} of 2`
                : "Athlete Details"}
            </h2>
            {screen === "categories" && eventLabel && (
              <p className="font-mono text-xs text-syncra-lime/70 mt-0.5">{eventLabel}</p>
            )}
          </div>
          <div className="w-12" />
        </div>

        <div className="flex-1 overflow-y-auto">
          {screen === "categories" && (
            <CategoriesScreen onSelect={handleCategorySelect} />
          )}
          {screen === "checkout" && selectedCategory && (
            <CheckoutScreen
              category={selectedCategory}
              athleteNumber={athleteStep}
              athlete={currentAthlete}
              setAthlete={setCurrentAthlete}
              campervan={campervan}
              setCampervan={setCampervan}
              vehicleReg={vehicleReg}
              setVehicleReg={setVehicleReg}
              showExtras={!selectedCategory.isPair || athleteStep === 2}
            />
          )}
        </div>

        {screen === "checkout" && selectedCategory && (
          <div className="sticky bottom-0 border-t border-syncra-gray bg-syncra-black p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono text-xs tracking-widest text-syncra-lime uppercase">
                Total
              </span>
              <span className="font-display text-2xl text-white">
                £{total.toFixed(total % 1 === 0 ? 0 : 2)}
              </span>
            </div>
            <button
              onClick={handleContinue}
              disabled={!canContinue}
              className="w-full py-4 font-mono text-sm tracking-widest uppercase bg-syncra-lime text-syncra-black disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
            >
              {selectedCategory.isPair && athleteStep === 1
                ? "Continue to Athlete 2 →"
                : "Continue to Payment →"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

interface CategoriesScreenProps {
  onSelect: (category: Category) => void;
}

function CategoriesScreen({ onSelect }: CategoriesScreenProps) {
  return (
    <div className="p-4 space-y-3">
      {CATEGORIES.map((category) => (
        <button
          key={category.id}
          onClick={() => onSelect(category)}
          className="w-full text-left p-5 border border-syncra-lime/20 rounded-xl hover:border-syncra-lime/50 hover:bg-syncra-lime/5 transition-colors"
        >
          <div className="flex items-center gap-3 mb-3">
            <category.icon size={24} className="text-syncra-lime shrink-0" />
            <h3 className="font-mono text-base text-white uppercase tracking-wider">
              {category.name}
            </h3>
          </div>
          <p className="font-mono text-sm text-syncra-lime/70 leading-relaxed mb-4">
            {category.description}
          </p>
          <p className="font-display text-2xl text-syncra-lime">
            £{category.price}
            {category.perPerson && (
              <span className="font-mono text-xs text-white/60 ml-2">
                (£{category.perPerson.toFixed(2)} each)
              </span>
            )}
          </p>
        </button>
      ))}
    </div>
  );
}

interface CheckoutScreenProps {
  category: Category;
  athleteNumber: 1 | 2;
  athlete: AthleteDetails;
  setAthlete: (a: AthleteDetails) => void;
  campervan: boolean;
  setCampervan: (v: boolean) => void;
  vehicleReg: string;
  setVehicleReg: (v: string) => void;
  showExtras: boolean;
}

function CheckoutScreen({
  category,
  athleteNumber,
  athlete,
  setAthlete,
  campervan,
  setCampervan,
  vehicleReg,
  setVehicleReg,
  showExtras,
}: CheckoutScreenProps) {
  const update = (field: keyof AthleteDetails, value: string) => {
    setAthlete({ ...athlete, [field]: value });
  };

  return (
    <div className="p-4 space-y-6">
      <div className="p-4 border border-syncra-gray rounded">
        <p className="font-mono text-xs tracking-widest text-syncra-lime uppercase mb-1">
          Selected
        </p>
        <p className="font-display text-base text-white uppercase">
          {category.name}
        </p>
        <p className="font-mono text-xs text-white/60 mt-1">{category.subtitle}</p>
      </div>

      <div>
        <h3 className="font-display text-sm text-syncra-lime uppercase tracking-widest mb-4">
          {category.isPair ? `Athlete ${athleteNumber}` : "Athlete Details"}
        </h3>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Field
              label="First Name"
              value={athlete.firstName}
              onChange={(v) => update("firstName", v)}
            />
            <Field
              label="Last Name"
              value={athlete.lastName}
              onChange={(v) => update("lastName", v)}
            />
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
          <Field
            label="Date of Birth"
            type="date"
            value={athlete.dateOfBirth}
            onChange={(v) => update("dateOfBirth", v)}
          />
          <Field
            label="Emergency Contact Name"
            value={athlete.emergencyContactName}
            onChange={(v) => update("emergencyContactName", v)}
          />
          <Field
            label="Emergency Contact Phone"
            type="tel"
            value={athlete.emergencyContactPhone}
            onChange={(v) => update("emergencyContactPhone", v)}
          />
        </div>
      </div>

      {showExtras && (
        <div>
          <h3 className="font-display text-sm text-syncra-lime uppercase tracking-widest mb-4">
            Extras
          </h3>
          <label className="flex items-center gap-3 p-4 border border-syncra-gray rounded cursor-pointer hover:border-syncra-lime/50 transition-colors">
            <input
              type="checkbox"
              checked={campervan}
              onChange={(e) => setCampervan(e.target.checked)}
              className="w-5 h-5 accent-syncra-lime"
            />
            <span className="flex-1 font-mono text-sm text-white">
              Add Campervan Pass
            </span>
            <span className="font-mono text-sm text-syncra-lime">+£15</span>
          </label>
          {campervan && (
            <div className="mt-3">
              <Field
                label="Vehicle Registration"
                value={vehicleReg}
                onChange={(v) => setVehicleReg(v.toUpperCase())}
                placeholder="AB12 CDE"
              />
            </div>
          )}
        </div>
      )}
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
        className="w-full px-3 py-3 bg-transparent border border-syncra-gray rounded font-mono text-sm text-white focus:border-syncra-lime focus:outline-none transition-colors"
      />
    </label>
  );
}
