import { useState } from "react";
import { useNavigate, useLocation } from "react-router";
import {
  ChevronLeft,
  User,
  Mail,
  Phone,
  Heart,
  MessageSquare,
  Utensils,
  ArrowRight,
  Calendar,
  Clock,
  Users,
  MapPin,
  Info,
  ShieldCheck,
  CreditCard,
  Lock,
  Shield,
  Smartphone,
  Landmark,
} from "lucide-react";

/* ── Design tokens ── */
const C = {
  gold: "#B68A3A",
  cream: "#F3EFEA",
  card: "#182522",
  serif: "Cormorant Garamond, serif",
  sans: "Inter, sans-serif",
};

const OCCASIONS = [
  "Brak",
  "Urodziny",
  "Rocznica",
  "Zaręczyny",
  "Kolacja służbowa",
  "Randka",
  "Świętowanie",
  "Inne",
];

/* ── Step indicator (shared pattern) ── */
function StepIndicator({ current }: { current: number }) {
  const steps = ["Data i godzina", "Wybierz stolik", "Twoje dane", "Potwierdzone"];
  return (
    <div className="flex items-center gap-1 mb-10 overflow-x-auto pb-2">
      {steps.map((label, i) => {
        const isActive = i === current;
        const isDone = i < current;
        return (
          <div key={label} className="flex items-center gap-1 flex-shrink-0">
            <div className="flex items-center gap-2">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs"
                style={{
                  fontFamily: C.sans,
                  fontWeight: 600,
                  backgroundColor: isActive ? C.gold : isDone ? "rgba(182,138,58,0.25)" : "rgba(243,239,234,0.06)",
                  color: isActive ? "#1E1A16" : isDone ? C.gold : "rgba(243,239,234,0.35)",
                  border: isActive ? "none" : isDone ? `1px solid ${C.gold}` : "1px solid rgba(243,239,234,0.1)",
                }}
              >
                {isDone ? "✓" : i + 1}
              </div>
              <span
                className="text-xs tracking-wide hidden sm:inline"
                style={{
                  fontFamily: C.sans,
                  fontWeight: isActive ? 500 : 300,
                  color: isActive ? C.cream : "rgba(243,239,234,0.4)",
                }}
              >
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className="w-6 md:w-10 h-px mx-1" style={{ backgroundColor: isDone ? "rgba(182,138,58,0.4)" : "rgba(243,239,234,0.1)" }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ── Form field helper ── */
function Field({
  label,
  required,
  icon: Icon,
  children,
}: {
  label: string;
  required?: boolean;
  icon?: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label className="flex items-center gap-2">
        {Icon && <Icon size={14} style={{ color: C.gold }} />}
        <span
          className="text-xs uppercase tracking-wider"
          style={{ fontFamily: C.sans, fontWeight: 500, letterSpacing: "0.1em", color: C.gold }}
        >
          {label}
          {required && <span className="text-red-400 ml-0.5">*</span>}
        </span>
      </label>
      {children}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  fontFamily: C.sans,
  fontWeight: 300,
  backgroundColor: "rgba(243,239,234,0.04)",
  color: C.cream,
  border: "1px solid rgba(243,239,234,0.12)",
};

export function GuestDetailsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { date, time, partySize, table } = location.state || {};

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [occasion, setOccasion] = useState("None");
  const [specialRequests, setSpecialRequests] = useState("");
  const [dietary, setDietary] = useState("");
  const [tastingMenu, setTastingMenu] = useState(false);
  const [gdpr, setGdpr] = useState(false);
  const [formError, setFormError] = useState("");

  /* ── Payment / Deposit state ── */
  const [paymentMethod, setPaymentMethod] = useState<"blik" | "card" | "transfer">("blik");
  const [blikCode, setBlikCode] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const [cardName, setCardName] = useState("");
  const depositPerPerson = 30;
  const depositTotal = depositPerPerson * (partySize || 1);

  const formatCardNumber = (v: string) => {
    const digits = v.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(\d{4})(?=\d)/g, "$1 ");
  };
  const formatExpiry = (v: string) => {
    const digits = v.replace(/\D/g, "").slice(0, 4);
    if (digits.length >= 3) return digits.slice(0, 2) + "/" + digits.slice(2);
    return digits;
  };

  const formatDate = (d: Date) =>
    new Date(d).toLocaleDateString("pl-PL", {
      weekday: "short",
      month: "long",
      day: "numeric",
    });

  const handleSubmit = () => {
    if (!firstName.trim() || !lastName.trim()) {
      setFormError("Proszę podać swoje pełne imię i nazwisko.");
      return;
    }
    if (!email.includes("@")) {
      setFormError("Proszę podać prawidłowy adres e-mail.");
      return;
    }
    if (phone.length < 6) {
      setFormError("Proszę podać prawidłowy numer telefonu.");
      return;
    }
    /* Payment validation */
    if (paymentMethod === "blik") {
      if (blikCode.replace(/\s/g, "").length !== 6) {
        setFormError("Proszę podać prawidłowy 6-cyfrowy kod BLIK.");
        return;
      }
    } else if (paymentMethod === "card") {
      if (cardNumber.replace(/\s/g, "").length < 16) {
        setFormError("Proszę podać prawidłowy numer karty (16 cyfr).");
        return;
      }
      if (cardExpiry.length < 5) {
        setFormError("Proszę podać prawidłową datę ważności karty (MM/RR).");
        return;
      }
      if (cardCvc.length < 3) {
        setFormError("Proszę podać prawidłowy kod CVC (3 cyfry).");
        return;
      }
      if (!cardName.trim()) {
        setFormError("Proszę podać imię i nazwisko posiadacza karty.");
        return;
      }
    }
    if (!gdpr) {
      setFormError("Proszę zaakceptować politykę prywatności, aby kontynuować.");
      return;
    }
    setFormError("");
    navigate("/confirmation", {
      state: {
        date,
        time,
        partySize,
        table,
        guest: {
          firstName,
          lastName,
          email,
          phone,
          occasion: occasion !== "None" ? occasion : null,
          specialRequests: specialRequests.trim() || null,
          dietary: dietary.trim() || null,
          tastingMenu,
        },
        deposit: {
          amount: depositTotal,
          perPerson: depositPerPerson,
          method: paymentMethod,
          cardLast4: paymentMethod === "card" ? cardNumber.replace(/\s/g, "").slice(-4) : undefined,
        },
      },
    });
  };

  return (
    <div
      className="min-h-screen px-6 md:px-12 py-8 md:py-12"
      style={{
        background: "radial-gradient(ellipse at center, #1a2820 0%, #0E1714 100%)",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="max-w-4xl mx-auto">
        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 transition-colors duration-200"
          style={{ color: "rgba(243,239,234,0.5)" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = C.gold)}
          onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(243,239,234,0.5)")}
        >
          <ChevronLeft size={20} />
          <span className="text-sm tracking-wide" style={{ fontFamily: C.sans }}>Wróć do wyboru stolika</span>
        </button>

        <StepIndicator current={2} />

        <h1
          className="text-4xl md:text-5xl mb-3"
          style={{ fontFamily: C.serif, fontWeight: 300, letterSpacing: "0.02em", color: C.cream }}
        >
          Prawie gotowe
        </h1>
        <p className="text-base mb-10" style={{ fontFamily: C.sans, fontWeight: 300, color: "rgba(243,239,234,0.55)" }}>
          Opowiedz nam trochę o sobie, abyśmy mogli spersonalizować Twój wieczór.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* ── Left: Form ── */}
          <div className="lg:col-span-2 space-y-8">
            {/* Contact info */}
            <div
              className="rounded-2xl p-8"
              style={{
                backgroundColor: C.card,
                border: "1px solid rgba(243,239,234,0.05)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
              }}
            >
              <h2
                className="text-2xl mb-6"
                style={{ fontFamily: C.serif, fontWeight: 400, color: C.cream }}
              >
                Dane kontaktowe
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Field label="Imię" required icon={User}>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Jan"
                    className="w-full px-4 py-3 rounded-lg text-sm outline-none transition-all duration-200 focus:border-[rgba(182,138,58,0.5)]"
                    style={inputStyle}
                  />
                </Field>

                <Field label="Nazwisko" required icon={User}>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Kowalski"
                    className="w-full px-4 py-3 rounded-lg text-sm outline-none transition-all duration-200 focus:border-[rgba(182,138,58,0.5)]"
                    style={inputStyle}
                  />
                </Field>

                <Field label="Email" required icon={Mail}>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="jan@example.com"
                    className="w-full px-4 py-3 rounded-lg text-sm outline-none transition-all duration-200 focus:border-[rgba(182,138,58,0.5)]"
                    style={inputStyle}
                  />
                </Field>

                <Field label="Telefon" required icon={Phone}>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+48 500 123 456"
                    className="w-full px-4 py-3 rounded-lg text-sm outline-none transition-all duration-200 focus:border-[rgba(182,138,58,0.5)]"
                    style={inputStyle}
                  />
                </Field>
              </div>
            </div>

            {/* Personalisation */}
            <div
              className="rounded-2xl p-8"
              style={{
                backgroundColor: C.card,
                border: "1px solid rgba(243,239,234,0.05)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
              }}
            >
              <h2
                className="text-2xl mb-6"
                style={{ fontFamily: C.serif, fontWeight: 400, color: C.cream }}
              >
                Spersonalizuj swój wieczór
              </h2>

              <div className="space-y-5">
                <Field label="Szczególna okazja" icon={Heart}>
                  <div className="flex flex-wrap gap-2">
                    {OCCASIONS.map((o) => (
                      <button
                        key={o}
                        onClick={() => setOccasion(o)}
                        className={`px-4 py-2 rounded-full text-xs transition-all duration-200 ${
                          occasion === o
                            ? "bg-[rgba(182,138,58,0.2)] text-[#B68A3A] border border-[#B68A3A]"
                            : "bg-[rgba(243,239,234,0.04)] text-[rgba(243,239,234,0.6)] border border-[rgba(243,239,234,0.1)] hover:border-[rgba(182,138,58,0.3)]"
                        }`}
                        style={{ fontFamily: C.sans, fontWeight: 400 }}
                      >
                        {o}
                      </button>
                    ))}
                  </div>
                  {occasion !== "None" && (
                    <p className="text-xs mt-2" style={{ fontFamily: C.sans, fontWeight: 300, color: "rgba(243,239,234,0.45)" }}>
                      Przygotujemy wyjątkowy akcent na Twoje {occasion}.
                    </p>
                  )}
                </Field>

                <Field label="Wymagania dietetyczne" icon={Utensils}>
                  <input
                    type="text"
                    value={dietary}
                    onChange={(e) => setDietary(e.target.value)}
                    placeholder="np. Wegetarianin, Bez glutenu, Alergia na orzechy"
                    className="w-full px-4 py-3 rounded-lg text-sm outline-none transition-all duration-200 focus:border-[rgba(182,138,58,0.5)]"
                    style={inputStyle}
                  />
                </Field>

                <Field label="Specjalne życzenia" icon={MessageSquare}>
                  <textarea
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    placeholder="Co jeszcze powinniśmy wiedzieć? Np. preferowane wino, pozycja przy stoliku, niespodzianki…"
                    rows={3}
                    className="w-full px-4 py-3 rounded-lg text-sm outline-none transition-all duration-200 resize-none focus:border-[rgba(182,138,58,0.5)]"
                    style={inputStyle}
                  />
                </Field>
              </div>
            </div>

            {/* Tasting Menu Upsell */}
            <div
              className="rounded-2xl p-6 flex items-start gap-4 cursor-pointer transition-all duration-200"
              style={{
                backgroundColor: tastingMenu ? "rgba(182,138,58,0.1)" : "rgba(182,138,58,0.04)",
                border: tastingMenu ? "1px solid rgba(182,138,58,0.35)" : "1px solid rgba(182,138,58,0.1)",
              }}
              onClick={() => setTastingMenu(!tastingMenu)}
            >
              <div
                className="w-6 h-6 rounded flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{
                  backgroundColor: tastingMenu ? C.gold : "transparent",
                  border: tastingMenu ? "none" : "2px solid rgba(243,239,234,0.2)",
                }}
              >
                {tastingMenu && <span style={{ color: "#1E1A16", fontSize: "12px", fontWeight: 700 }}>✓</span>}
              </div>
              <div>
                <p className="text-sm" style={{ fontFamily: C.sans, fontWeight: 500, color: C.cream }}>
                  Zamów wcześniej menu degustacyjne Wiosna 2026
                </p>
                <p className="text-xs mt-1" style={{ fontFamily: C.sans, fontWeight: 300, color: "rgba(243,239,234,0.5)" }}>
                  7-daniowa sezonowa podróż — 498 zł/osoba · Dobór win dostępny (+268 zł).
                  Nasz szef kuchni przygotuje dania z wyprzedzeniem dla płynnego doświadczenia.
                </p>
              </div>
            </div>

            {/* ── Deposit / Card Section ── */}
            <div
              className="rounded-2xl p-8"
              style={{
                backgroundColor: C.card,
                border: "1px solid rgba(243,239,234,0.05)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
              }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2
                  className="text-2xl flex items-center gap-3"
                  style={{ fontFamily: C.serif, fontWeight: 400, color: C.cream }}
                >
                  <CreditCard size={22} style={{ color: C.gold }} />
                  Gwarancja rezerwacji
                </h2>
                <div className="flex items-center gap-1.5">
                  <Lock size={12} style={{ color: "rgba(243,239,234,0.35)" }} />
                  <span className="text-[10px] uppercase tracking-wider" style={{ fontFamily: C.sans, fontWeight: 500, color: "rgba(243,239,234,0.35)", letterSpacing: "0.1em" }}>
                    Szyfrowane SSL
                  </span>
                </div>
              </div>

              {/* Deposit explanation */}
              <div
                className="rounded-xl p-5 mb-6"
                style={{
                  backgroundColor: "rgba(182,138,58,0.06)",
                  border: "1px solid rgba(182,138,58,0.15)",
                }}
              >
                <div className="flex items-start gap-3">
                  <Shield size={18} className="flex-shrink-0 mt-0.5" style={{ color: C.gold }} />
                  <div>
                    <p className="text-sm mb-1" style={{ fontFamily: C.sans, fontWeight: 500, color: C.cream }}>
                      Depozyt: {depositTotal} zł ({depositPerPerson} zł × {partySize || 1} {(partySize || 1) === 1 ? "osoba" : (partySize || 1) < 5 ? "osoby" : "osób"})
                    </p>
                    <p className="text-xs leading-relaxed" style={{ fontFamily: C.sans, fontWeight: 300, color: "rgba(243,239,234,0.55)" }}>
                      Depozyt zostanie odliczony od rachunku końcowego. Bezpłatne anulowanie do 24h przed rezerwacją — depozyt zwracany w całości. W przypadku niestawienia się (no-show) depozyt nie podlega zwrotowi.
                    </p>
                  </div>
                </div>
              </div>

              {/* Payment method tabs */}
              <div className="flex gap-2 mb-6">
                {([
                  { id: "blik" as const, label: "BLIK", icon: Smartphone },
                  { id: "card" as const, label: "Karta", icon: CreditCard },
                  { id: "transfer" as const, label: "Przelewy24", icon: Landmark },
                ]).map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setPaymentMethod(id)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs transition-all duration-200 flex-1 justify-center"
                    style={{
                      fontFamily: C.sans,
                      fontWeight: paymentMethod === id ? 500 : 400,
                      backgroundColor: paymentMethod === id ? "rgba(182,138,58,0.15)" : "rgba(243,239,234,0.04)",
                      color: paymentMethod === id ? C.gold : "rgba(243,239,234,0.5)",
                      border: paymentMethod === id ? `1px solid ${C.gold}` : "1px solid rgba(243,239,234,0.1)",
                    }}
                  >
                    <Icon size={15} />
                    {label}
                  </button>
                ))}
              </div>

              {/* BLIK */}
              {paymentMethod === "blik" && (
                <div className="space-y-4">
                  <div
                    className="rounded-lg p-4 flex items-start gap-3"
                    style={{ backgroundColor: "rgba(227,78,106,0.06)", border: "1px solid rgba(227,78,106,0.15)" }}
                  >
                    <Smartphone size={20} className="flex-shrink-0 mt-0.5" style={{ color: "#E34E6A" }} />
                    <p className="text-xs leading-relaxed" style={{ fontFamily: C.sans, fontWeight: 300, color: "rgba(243,239,234,0.6)" }}>
                      Otwórz aplikację bankową na telefonie, wygeneruj kod BLIK i wpisz go poniżej. Kod jest ważny 2 minuty.
                    </p>
                  </div>
                  <Field label="Kod BLIK" required icon={Smartphone}>
                    <input
                      type="text"
                      value={blikCode}
                      onChange={(e) => setBlikCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                      placeholder="000 000"
                      maxLength={6}
                      className="w-full px-4 py-3 rounded-lg text-sm outline-none transition-all duration-200 text-center tracking-[0.3em] text-lg focus:border-[rgba(182,138,58,0.5)]"
                      style={{ ...inputStyle, fontWeight: 500 }}
                    />
                  </Field>
                </div>
              )}

              {/* Card */}
              {paymentMethod === "card" && (
                <div className="space-y-5">
                  <Field label="Numer karty" required icon={CreditCard}>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                      placeholder="4242 4242 4242 4242"
                      maxLength={19}
                      className="w-full px-4 py-3 rounded-lg text-sm outline-none transition-all duration-200 focus:border-[rgba(182,138,58,0.5)]"
                      style={inputStyle}
                    />
                  </Field>

                  <div className="grid grid-cols-2 gap-5">
                    <Field label="Data ważności" required>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                        placeholder="MM/RR"
                        maxLength={5}
                        className="w-full px-4 py-3 rounded-lg text-sm outline-none transition-all duration-200 focus:border-[rgba(182,138,58,0.5)]"
                        style={inputStyle}
                      />
                    </Field>

                    <Field label="CVC" required icon={Lock}>
                      <input
                        type="text"
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, "").slice(0, 3))}
                        placeholder="123"
                        maxLength={3}
                        className="w-full px-4 py-3 rounded-lg text-sm outline-none transition-all duration-200 focus:border-[rgba(182,138,58,0.5)]"
                        style={inputStyle}
                      />
                    </Field>
                  </div>

                  <Field label="Imię i nazwisko posiadacza karty" required icon={User}>
                    <input
                      type="text"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      placeholder="Jan Kowalski"
                      className="w-full px-4 py-3 rounded-lg text-sm outline-none transition-all duration-200 focus:border-[rgba(182,138,58,0.5)]"
                      style={inputStyle}
                    />
                  </Field>

                  {/* Card brands */}
                  <div className="flex items-center gap-3 pt-3" style={{ borderTop: "1px solid rgba(243,239,234,0.06)" }}>
                    <span className="text-[10px] uppercase tracking-wider" style={{ fontFamily: C.sans, fontWeight: 400, color: "rgba(243,239,234,0.3)", letterSpacing: "0.1em" }}>
                      Akceptujemy
                    </span>
                    {["Visa", "Mastercard", "Amex"].map((brand) => (
                      <span
                        key={brand}
                        className="text-[10px] px-2.5 py-1 rounded"
                        style={{
                          fontFamily: C.sans,
                          fontWeight: 500,
                          backgroundColor: "rgba(243,239,234,0.06)",
                          color: "rgba(243,239,234,0.45)",
                          border: "1px solid rgba(243,239,234,0.08)",
                        }}
                      >
                        {brand}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Bank transfer (Przelewy24) */}
              {paymentMethod === "transfer" && (
                <div
                  className="rounded-lg p-5 flex items-start gap-3"
                  style={{ backgroundColor: "rgba(243,239,234,0.03)", border: "1px solid rgba(243,239,234,0.08)" }}
                >
                  <Landmark size={20} className="flex-shrink-0 mt-0.5" style={{ color: C.gold }} />
                  <div>
                    <p className="text-sm mb-1" style={{ fontFamily: C.sans, fontWeight: 500, color: C.cream }}>
                      Przelewy24
                    </p>
                    <p className="text-xs leading-relaxed" style={{ fontFamily: C.sans, fontWeight: 300, color: "rgba(243,239,234,0.55)" }}>
                      Po kliknięciu „Potwierdź rezerwację" zostaniesz przekierowany do bezpiecznej strony Przelewy24, gdzie wybierzesz swój bank i autoryzujesz płatność {depositTotal} zł.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* GDPR + Error + Submit */}
            <div className="space-y-5">
              {/* GDPR */}
              <label className="flex items-start gap-3 cursor-pointer">
                <div
                  className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{
                    backgroundColor: gdpr ? C.gold : "transparent",
                    border: gdpr ? "none" : "2px solid rgba(243,239,234,0.2)",
                  }}
                  onClick={() => setGdpr(!gdpr)}
                >
                  {gdpr && <span style={{ color: "#1E1A16", fontSize: "11px", fontWeight: 700 }}>✓</span>}
                </div>
                <span
                  className="text-xs leading-relaxed"
                  style={{ fontFamily: C.sans, fontWeight: 300, color: "rgba(243,239,234,0.5)" }}
                  onClick={() => setGdpr(!gdpr)}
                >
                  Wyrażam zgodę na{" "}
                  <a href="#" className="underline" style={{ color: C.gold }}>Politykę Prywatności</a>{" "}
                  i przetwarzanie moich danych przez La Maison Dorée w celu zarządzania tą rezerwacją.
                  <span className="text-red-400 ml-0.5">*</span>
                </span>
              </label>

              {/* Error */}
              {formError && (
                <div className="rounded-lg p-4" style={{ backgroundColor: "rgba(200,80,80,0.1)", border: "1px solid rgba(200,80,80,0.25)" }}>
                  <p className="text-sm" style={{ fontFamily: C.sans, fontWeight: 400, color: "rgba(220,100,100,0.9)" }}>
                    {formError}
                  </p>
                </div>
              )}

              {/* Submit */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                <p className="text-xs order-2 sm:order-1" style={{ fontFamily: C.sans, fontWeight: 300, color: "rgba(243,239,234,0.35)" }}>
                  Potwierdzenie zostanie wysłane na Twój e-mail natychmiast.
                </p>
                <button
                  onClick={handleSubmit}
                  className="order-1 sm:order-2 flex items-center gap-2 px-10 py-4 rounded-lg transition-all duration-300"
                  style={{
                    fontWeight: 500,
                    fontFamily: C.sans,
                    letterSpacing: "0.05em",
                    backgroundColor: C.gold,
                    color: "#1E1A16",
                    boxShadow: "0 8px 32px rgba(182,138,58,0.3)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = "0 12px 40px rgba(182,138,58,0.4)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 8px 32px rgba(182,138,58,0.3)";
                  }}
                >
                  POTWIERDŹ REZERWACJĘ
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* ── Right: Reservation Summary Sidebar ── */}
          <div className="lg:col-span-1">
            <div
              className="rounded-2xl p-7 sticky top-8"
              style={{
                backgroundColor: C.card,
                boxShadow: "0 12px 48px rgba(0,0,0,0.4)",
                border: "1px solid rgba(243,239,234,0.05)",
              }}
            >
              <h3
                className="text-xl mb-5"
                style={{ fontFamily: C.serif, fontWeight: 400, color: C.cream }}
              >
                Podsumowanie rezerwacji
              </h3>
              <div className="h-px w-full mb-5" style={{ backgroundColor: "rgba(182,138,58,0.2)" }} />

              <div className="space-y-5">
                <div className="flex items-start gap-3">
                  <MapPin size={16} style={{ color: C.gold }} className="mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs uppercase tracking-wider mb-1" style={{ fontFamily: C.sans, fontWeight: 500, color: C.gold, letterSpacing: "0.1em" }}>
                      Restauracja
                    </p>
                    <p className="text-sm" style={{ fontFamily: C.serif, fontWeight: 400, color: C.cream }}>
                      La Maison Dorée
                    </p>
                    <p className="text-xs mt-0.5" style={{ fontFamily: C.sans, fontWeight: 300, color: "rgba(243,239,234,0.45)" }}>
                      ul. Nowy Świat 42, Warszawa
                    </p>
                  </div>
                </div>

                {date && (
                  <div className="flex items-start gap-3">
                    <Calendar size={16} style={{ color: C.gold }} className="mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs uppercase tracking-wider mb-1" style={{ fontFamily: C.sans, fontWeight: 500, color: C.gold, letterSpacing: "0.1em" }}>
                        Data
                      </p>
                      <p className="text-sm" style={{ fontFamily: C.sans, fontWeight: 400, color: C.cream }}>
                        {formatDate(date)}
                      </p>
                    </div>
                  </div>
                )}

                {time && (
                  <div className="flex items-start gap-3">
                    <Clock size={16} style={{ color: C.gold }} className="mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs uppercase tracking-wider mb-1" style={{ fontFamily: C.sans, fontWeight: 500, color: C.gold, letterSpacing: "0.1em" }}>
                        Godzina
                      </p>
                      <p className="text-sm" style={{ fontFamily: C.sans, fontWeight: 400, color: C.cream }}>
                        {time}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-3">
                  <Users size={16} style={{ color: C.gold }} className="mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs uppercase tracking-wider mb-1" style={{ fontFamily: C.sans, fontWeight: 500, color: C.gold, letterSpacing: "0.1em" }}>
                      Stolik i liczba gości
                    </p>
                    <p className="text-sm" style={{ fontFamily: C.sans, fontWeight: 400, color: C.cream }}>
                      {partySize} {partySize === 1 ? "Gość" : "Gości"} · Stolik {table?.number || "TBD"}
                    </p>
                    {table?.tags && table.tags.length > 0 && (
                      <div className="flex gap-2 mt-1.5">
                        {table.tags.map((tag: string) => (
                          <span
                            key={tag}
                            className="text-[10px] px-2 py-0.5 rounded-full capitalize"
                            style={{
                              fontFamily: C.sans,
                              backgroundColor: "rgba(182,138,58,0.12)",
                              color: C.gold,
                              border: "1px solid rgba(182,138,58,0.2)",
                            }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="h-px w-full my-5" style={{ backgroundColor: "rgba(182,138,58,0.15)" }} />

              {/* Policies reminder */}
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <CreditCard size={13} className="mt-0.5 flex-shrink-0" style={{ color: C.gold }} />
                  <p className="text-[11px] leading-relaxed" style={{ fontFamily: C.sans, fontWeight: 300, color: "rgba(243,239,234,0.5)" }}>
                    <strong style={{ fontWeight: 500, color: C.cream }}>Depozyt {depositTotal} zł</strong> — odliczany od rachunku końcowego.
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <ShieldCheck size={13} className="mt-0.5 flex-shrink-0" style={{ color: "rgba(243,239,234,0.35)" }} />
                  <p className="text-[11px] leading-relaxed" style={{ fontFamily: C.sans, fontWeight: 300, color: "rgba(243,239,234,0.4)" }}>
                    Bezpłatne anulowanie do 24h przed wizytą. Niestawienie się — depozyt przepada.
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <Info size={13} className="mt-0.5 flex-shrink-0" style={{ color: "rgba(243,239,234,0.35)" }} />
                  <p className="text-[11px] leading-relaxed" style={{ fontFamily: C.sans, fontWeight: 300, color: "rgba(243,239,234,0.4)" }}>
                    Prosimy o przybycie w ciągu 15 minut od godziny rezerwacji. Obowiązuje strój smart casual.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
