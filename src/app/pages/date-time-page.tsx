import { useState } from "react";
import { useNavigate } from "react-router";
import {
  ChevronLeft, Calendar, Users, Clock, Info, ArrowRight, Sparkles,
  X, Mail, Phone, MessageSquare, Send, Bell, Check,
} from "lucide-react";

/* ── Design tokens ── */
const C = {
  gold: "#B68A3A",
  cream: "#F3EFEA",
  muted: "rgba(243,239,234,0.6)",
  card: "#182522",
  serif: "Cormorant Garamond, serif",
  sans: "Inter, sans-serif",
};

/* ── Time‑slot metadata ── */
interface TimeSlot {
  time: string;
  label?: string;            // "Popular" | "Limited" | "Best Availability" | "Last Seating"
  labelColor?: string;
}

const TIME_SLOTS: TimeSlot[] = [
  { time: "18:00" },
  { time: "18:30" },
  { time: "19:00" },
  { time: "19:30", label: "Popularne", labelColor: "#B68A3A" },
  { time: "20:00", label: "Popularne", labelColor: "#B68A3A" },
  { time: "20:30", label: "Ograniczona dostępność", labelColor: "rgba(200,120,80,0.9)" },
  { time: "21:00" },
  { time: "21:30", label: "Ostatnie posadzenie", labelColor: "rgba(243,239,234,0.45)" },
];

const PARTY_SIZES = [1, 2, 3, 4, 5, 6, 7, 8];

/* ── Progress indicator ── */
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

export function DateTimePage() {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [partySize, setPartySize] = useState<number>(2);

  /* ── Future reservation modal ── */
  const [modalMode, setModalMode] = useState<"closed" | "inquiry" | "notify" | "inquiryDone" | "notifyDone">("closed");

  // Inquiry form fields
  const [futName, setFutName] = useState("");
  const [futEmail, setFutEmail] = useState("");
  const [futPhone, setFutPhone] = useState("");
  const [futDate, setFutDate] = useState("");
  const [futParty, setFutParty] = useState("2");
  const [futNote, setFutNote] = useState("");
  const [futErr, setFutErr] = useState("");

  // Notify form fields
  const [notifyEmail, setNotifyEmail] = useState("");
  const [notifyDate, setNotifyDate] = useState("");
  const [notifyErr, setNotifyErr] = useState("");

  const resetModal = () => {
    setModalMode("closed");
    setFutName(""); setFutEmail(""); setFutPhone(""); setFutDate(""); setFutParty("2"); setFutNote(""); setFutErr("");
    setNotifyEmail(""); setNotifyDate(""); setNotifyErr("");
  };

  const handleInquirySubmit = () => {
    if (!futName.trim()) { setFutErr("Proszę podać swoje imię."); return; }
    if (!futEmail.includes("@")) { setFutErr("Proszę podać prawidłowy adres e-mail."); return; }
    if (!futDate) { setFutErr("Proszę wybrać preferowaną datę."); return; }
    if (!futParty) { setFutErr("Proszę wybrać liczbę gości."); return; }
    setFutErr("");
    setModalMode("inquiryDone");
  };

  const handleNotifySubmit = () => {
    if (!notifyEmail.includes("@")) { setNotifyErr("Proszę podać prawidłowy adres e-mail."); return; }
    if (!notifyDate) { setNotifyErr("Proszę wybrać preferowaną datę."); return; }
    setNotifyErr("");
    setModalMode("notifyDone");
  };

  const generateDates = () => {
    const dates: Date[] = [];
    const today = new Date();
    for (let i = 0; i < 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      if (date.getDay() === 0 || date.getDay() === 1) continue;
      dates.push(date);
    }
    return dates;
  };

  const dates = generateDates();

  const formatDate = (date: Date) => ({
    day: date.toLocaleDateString("pl-PL", { weekday: "short" }),
    date: date.getDate(),
    month: date.toLocaleDateString("pl-PL", { month: "short" }),
  });

  const handleContinue = () => {
    if (selectedDate && selectedTime) {
      navigate("/select-table", {
        state: { date: selectedDate, time: selectedTime, partySize },
      });
    }
  };

  /* ── Min date for future-inquiry date input ── */
  const minFutureDate = (() => {
    const d = new Date();
    d.setDate(d.getDate() + 14);
    return d.toISOString().split("T")[0];
  })();

  const inputStyle: React.CSSProperties = {
    fontFamily: C.sans, fontWeight: 300,
    backgroundColor: "rgba(243,239,234,0.05)",
    color: C.cream,
    border: "1px solid rgba(243,239,234,0.12)",
    outline: "none",
    borderRadius: "0.5rem",
    padding: "0.75rem 1rem",
    width: "100%",
    fontSize: "14px",
  };

  const labelStyle: React.CSSProperties = {
    fontFamily: C.sans, fontWeight: 500,
    fontSize: "11px", letterSpacing: "0.1em",
    textTransform: "uppercase", color: C.gold,
    display: "block", marginBottom: "6px",
  };

  return (
    <>
    <div
      className="min-h-screen px-6 md:px-12 py-8 md:py-12"
      style={{
        background: "radial-gradient(ellipse at center, #1a2820 0%, #0E1714 100%)",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="max-w-5xl mx-auto">
        {/* Back + header */}
        <div className="mb-6">
          <button
            onClick={() => { navigate("/"); window.scrollTo(0, 0); }}
            className="mb-6 flex items-center gap-2 transition-colors duration-200"
            style={{ color: "rgba(243,239,234,0.5)" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = C.gold)}
            onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(243,239,234,0.5)")}
          >
            <ChevronLeft size={20} />
            <span className="text-sm tracking-wide" style={{ fontFamily: C.sans }}>Wróć</span>
          </button>

          <StepIndicator current={0} />

          <h1
            className="text-4xl md:text-5xl lg:text-6xl mb-3"
            style={{ fontFamily: C.serif, fontWeight: 300, letterSpacing: "0.02em", color: C.cream }}
          >
            Zarezerwuj stolik
          </h1>
          <p className="text-base" style={{ fontFamily: C.sans, fontWeight: 300, color: "rgba(243,239,234,0.55)" }}>
            Wybierz preferowaną datę, godzinę i liczbę gości
          </p>
        </div>

        {/* ── Party Size ── */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-5">
            <Users size={20} style={{ color: C.gold }} />
            <h2 className="text-sm uppercase tracking-wider" style={{ fontFamily: C.sans, fontWeight: 500, letterSpacing: "0.1em", color: C.gold }}>
              Liczba gości
            </h2>
          </div>
          <div className="flex flex-wrap gap-3">
            {PARTY_SIZES.map((size) => (
              <button
                key={size}
                onClick={() => setPartySize(size)}
                className={`w-16 h-16 rounded-lg transition-all duration-300 ${
                  partySize === size
                    ? "bg-[#B68A3A] text-[#1E1A16]"
                    : "bg-[rgba(243,239,234,0.04)] text-[#F3EFEA] border border-[rgba(182,138,58,0.15)] hover:bg-[rgba(182,138,58,0.1)] hover:border-[rgba(182,138,58,0.3)]"
                }`}
                style={{
                  fontWeight: 500,
                  fontFamily: C.sans,
                  boxShadow: partySize === size ? "0 4px 16px rgba(182,138,58,0.3)" : "none",
                }}
              >
                {size}
              </button>
            ))}
          </div>

          {/* Large party helper — 7 or 8 */}
          {partySize >= 7 && partySize <= 8 && (
            <div
              className="mt-4 flex items-start gap-2 rounded-lg px-4 py-3"
              style={{ backgroundColor: "rgba(182,138,58,0.07)", border: "1px solid rgba(182,138,58,0.15)" }}
            >
              <Info size={14} className="mt-0.5 flex-shrink-0" style={{ color: C.gold }} />
              <p className="text-xs leading-relaxed" style={{ fontFamily: C.sans, fontWeight: 300, color: "rgba(243,239,234,0.65)" }}>
                W przypadku większych grup lub długoterminowego planowania, nasz{" "}
                <button
                  onClick={() => { navigate("/private-events"); window.scrollTo(0, 0); }}
                  className="underline transition-colors duration-200"
                  style={{ color: C.gold }}
                >
                  zespół ds. wydarzeń prywatnych
                </button>{" "}
                chętnie pomoże.
              </p>
            </div>
          )}

          {/* 9+ redirect */}
          {partySize < 7 && (
            <div className="mt-4 flex items-start gap-2">
              <Info size={14} className="mt-0.5 flex-shrink-0" style={{ color: "rgba(243,239,234,0.35)" }} />
              <p className="text-xs leading-relaxed" style={{ fontFamily: C.sans, fontWeight: 300, color: "rgba(243,239,234,0.4)" }}>
                W przypadku grup 9 lub więcej osób, prosimy{" "}
                <button
                  onClick={() => { navigate("/private-events"); window.scrollTo(0, 0); }}
                  className="underline transition-colors duration-200"
                  style={{ color: C.gold }}
                >
                  o kontakt z naszym zespołem
                </button>{" "}
                lub zadzwoń{" "}
                <a href="tel:+48223456789" className="underline" style={{ color: C.gold }}>
                  +48 22 345 67 89
                </a>.
              </p>
            </div>
          )}
        </div>

        {/* ── Date Selection ── */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-5">
            <Calendar size={20} style={{ color: C.gold }} />
            <h2 className="text-sm uppercase tracking-wider" style={{ fontFamily: C.sans, fontWeight: 500, letterSpacing: "0.1em", color: C.gold }}>
              Wybierz datę
            </h2>
          </div>
          <div className="flex overflow-x-auto gap-3 pb-4 pt-2 px-1 scrollbar-hide">
            {dates.map((date, index) => {
              const formatted = formatDate(date);
              const isSelected = selectedDate?.toDateString() === date.toDateString();

              return (
                <button
                  key={index}
                  onClick={() => setSelectedDate(date)}
                  className={`flex-shrink-0 w-24 p-4 rounded-lg transition-all duration-300 ${
                    isSelected
                      ? "bg-[#B68A3A]"
                      : "bg-[rgba(243,239,234,0.04)] border border-[rgba(182,138,58,0.15)] hover:bg-[rgba(182,138,58,0.1)] hover:border-[rgba(182,138,58,0.3)]"
                  }`}
                  style={{ boxShadow: isSelected ? "0 4px 16px rgba(182,138,58,0.3)" : "none" }}
                >
                  <div className="text-center">
                    <div className={`text-xs mb-2 uppercase tracking-wide ${isSelected ? "text-[#1E1A16]" : "text-[rgba(243,239,234,0.45)]"}`} style={{ fontWeight: 500, fontFamily: C.sans }}>
                      {formatted.day}
                    </div>
                    <div className={`text-2xl mb-1 ${isSelected ? "text-[#1E1A16]" : "text-[#F3EFEA]"}`} style={{ fontFamily: C.serif, fontWeight: 400 }}>
                      {formatted.date}
                    </div>
                    <div className={`text-xs uppercase tracking-wide ${isSelected ? "text-[#1E1A16]" : "text-[rgba(243,239,234,0.45)]"}`} style={{ fontWeight: 500, fontFamily: C.sans }}>
                      {formatted.month}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Availability window note + future CTA */}
          <div
            className="mt-4 rounded-xl px-5 py-4"
            style={{ backgroundColor: "rgba(243,239,234,0.03)", border: "1px solid rgba(243,239,234,0.07)" }}
          >
            <p className="text-xs mb-3" style={{ fontFamily: C.sans, fontWeight: 300, color: "rgba(243,239,234,0.45)" }}>
              Jesteśmy otwarci <strong style={{ fontWeight: 500, color: "rgba(243,239,234,0.65)" }}>od wtorku do soboty</strong>.
              Rezerwacje można składać do <strong style={{ fontWeight: 500, color: "rgba(243,239,234,0.65)" }}>14 dni z góry</strong>.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
              <button
                onClick={() => setModalMode("inquiry")}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm transition-all duration-200"
                style={{
                  fontFamily: C.sans, fontWeight: 500, letterSpacing: "0.04em",
                  backgroundColor: "rgba(182,138,58,0.12)",
                  color: C.gold,
                  border: "1px solid rgba(182,138,58,0.25)",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "rgba(182,138,58,0.2)"; e.currentTarget.style.borderColor = "rgba(182,138,58,0.4)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "rgba(182,138,58,0.12)"; e.currentTarget.style.borderColor = "rgba(182,138,58,0.25)"; }}
              >
                <Calendar size={15} />
                Poproś o przyszłą rezerwację
              </button>
              <button
                onClick={() => setModalMode("notify")}
                className="text-xs transition-colors duration-200"
                style={{ fontFamily: C.sans, fontWeight: 300, color: "rgba(243,239,234,0.4)" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = C.gold)}
                onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(243,239,234,0.4)")}
              >
                <span className="flex items-center gap-1.5">
                  <Bell size={12} />
                  Powiadom mnie, gdy termin stanie się dostępny
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* ── Time Selection ── */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-3">
            <Clock size={20} style={{ color: C.gold }} />
            <h2 className="text-sm uppercase tracking-wider" style={{ fontFamily: C.sans, fontWeight: 500, letterSpacing: "0.1em", color: C.gold }}>
              Wybierz godzinę
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {TIME_SLOTS.map((slot) => {
              const isSelected = selectedTime === slot.time;
              return (
                <button
                  key={slot.time}
                  onClick={() => setSelectedTime(slot.time)}
                  className={`relative py-4 rounded-lg transition-all duration-300 ${
                    isSelected
                      ? "bg-[#B68A3A] text-[#1E1A16]"
                      : "bg-[rgba(243,239,234,0.04)] text-[#F3EFEA] border border-[rgba(182,138,58,0.15)] hover:bg-[rgba(182,138,58,0.1)] hover:border-[rgba(182,138,58,0.3)]"
                  }`}
                  style={{
                    fontWeight: 500,
                    fontFamily: C.sans,
                    boxShadow: isSelected ? "0 4px 16px rgba(182,138,58,0.3)" : "none",
                  }}
                >
                  <span>{slot.time}</span>
                  {slot.label && (
                    <span
                      className="block text-[10px] mt-1 uppercase tracking-wider"
                      style={{
                        fontWeight: 500,
                        color: isSelected ? "rgba(30,26,22,0.7)" : slot.labelColor,
                      }}
                    >
                      {slot.label}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-4 flex items-start gap-2">
            <Sparkles size={14} className="mt-0.5 flex-shrink-0" style={{ color: "rgba(243,239,234,0.3)" }} />
            <p className="text-xs leading-relaxed" style={{ fontFamily: C.sans, fontWeight: 300, color: "rgba(243,239,234,0.4)" }}>
              Prosimy zarezerwować około <strong style={{ color: "rgba(243,239,234,0.6)", fontWeight: 500 }}>2–2,5 godziny</strong> na pełne doświadczenie kulinarne.
              Kuchnia przyjmuje ostatnie zamówienia do godz. 22:00.
            </p>
          </div>
        </div>

        {/* ── Policies strip ── */}
        <div
          className="rounded-xl p-5 mb-10"
          style={{ backgroundColor: "rgba(182,138,58,0.06)", border: "1px solid rgba(182,138,58,0.12)" }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs" style={{ fontFamily: C.sans, fontWeight: 300, color: "rgba(243,239,234,0.55)" }}>
            <div>
              <p className="uppercase tracking-wider mb-1" style={{ fontWeight: 500, color: C.gold, fontSize: "10px" }}>Przybycie</p>
              <p>Prosimy o przybycie w ciągu 15 minut od godziny rezerwacji. Po tym czasie możemy zwolnić stolik.</p>
            </div>
            <div>
              <p className="uppercase tracking-wider mb-1" style={{ fontWeight: 500, color: C.gold, fontSize: "10px" }}>Anulowanie</p>
              <p>Bezpłatne anulowanie do 24 godzin przed wizytą. Późne anulowanie może wiązać się z opłatą 30 zł/osoba.</p>
            </div>
            <div>
              <p className="uppercase tracking-wider mb-1" style={{ fontWeight: 500, color: C.gold, fontSize: "10px" }}>Dress Code</p>
              <p>Smart casual. Prosimy o nieszanowanie strojów sportowych i otwartego obuwia.</p>
            </div>
          </div>
        </div>

        {/* ── Continue ── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs order-2 sm:order-1" style={{ fontFamily: C.sans, fontWeight: 300, color: "rgba(243,239,234,0.35)" }}>
            {selectedDate && selectedTime
              ? "Dalej: wybierz swój preferowany stolik z interaktywnego planu sali."
              : "Wybierz datę i godzinę, aby kontynuować."}
          </p>
          <button
            onClick={handleContinue}
            disabled={!selectedDate || !selectedTime}
            className="order-1 sm:order-2 flex items-center gap-2 px-10 py-4 rounded-lg transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              fontWeight: 500,
              fontFamily: C.sans,
              letterSpacing: "0.05em",
              backgroundColor: C.gold,
              color: "#1E1A16",
              boxShadow: selectedDate && selectedTime ? "0 8px 32px rgba(182,138,58,0.3)" : "none",
            }}
            onMouseEnter={(e) => {
              if (selectedDate && selectedTime) {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 12px 40px rgba(182,138,58,0.4)";
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = selectedDate && selectedTime ? "0 8px 32px rgba(182,138,58,0.3)" : "none";
            }}
          >
            WYBIERZ STOLIK
            <ArrowRight size={16} />
          </button>
        </div>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        .fut-input:focus { border-color: rgba(182,138,58,0.45) !important; }
        .fut-input::placeholder { color: rgba(243,239,234,0.25); }
        input[type="date"]::-webkit-calendar-picker-indicator { filter: invert(0.6) sepia(1) saturate(3) hue-rotate(5deg); opacity: 0.6; }
      `}</style>
    </div>

    {/* ══════════════════════════════════════════════
        FUTURE RESERVATION MODAL
        ══════════════════════════════════════════════ */}
    {modalMode !== "closed" && (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8"
        style={{ backgroundColor: "rgba(10,18,15,0.85)", backdropFilter: "blur(8px)" }}
        onClick={(e) => { if (e.target === e.currentTarget) resetModal(); }}
      >
        <div
          className="relative w-full max-w-lg rounded-2xl p-8 overflow-y-auto"
          style={{
            backgroundColor: "#182522",
            border: "1px solid rgba(182,138,58,0.15)",
            boxShadow: "0 24px 80px rgba(0,0,0,0.6)",
            maxHeight: "90vh",
          }}
        >
          {/* Close */}
          <button
            onClick={resetModal}
            className="absolute top-5 right-5 p-1.5 rounded-full transition-colors duration-200"
            style={{ color: "rgba(243,239,234,0.4)", backgroundColor: "rgba(243,239,234,0.05)" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = C.cream)}
            onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(243,239,234,0.4)")}
          >
            <X size={18} />
          </button>

          {/* ── Inquiry Form ── */}
          {modalMode === "inquiry" && (
            <>
              <h2 className="text-3xl mb-2" style={{ fontFamily: C.serif, fontWeight: 300, color: C.cream }}>
                Poproś o przyszły termin
              </h2>
              <p className="text-sm mb-7" style={{ fontFamily: C.sans, fontWeight: 300, color: "rgba(243,239,234,0.5)", lineHeight: 1.6 }}>
                Nasz zespół przejrzy Twoje zgłoszenie i skontaktuje się osobiście, aby potwierdzić dostępność i zorganizować wizytę.
              </p>

              <div className="space-y-4">
                <div>
                  <label style={labelStyle}>
                    <span className="flex items-center gap-1.5"><Users size={11} /> Imię i nazwisko <span className="text-red-400">*</span></span>
                  </label>
                  <input className="fut-input" style={inputStyle} type="text" value={futName}
                    onChange={(e) => setFutName(e.target.value)} placeholder="Twoje imię i nazwisko" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label style={labelStyle}>
                      <span className="flex items-center gap-1.5"><Mail size={11} /> Email <span className="text-red-400">*</span></span>
                    </label>
                    <input className="fut-input" style={inputStyle} type="email" value={futEmail}
                      onChange={(e) => setFutEmail(e.target.value)} placeholder="you@example.com" />
                  </div>
                  <div>
                    <label style={labelStyle}>
                      <span className="flex items-center gap-1.5"><Phone size={11} /> Telefon</span>
                    </label>
                    <input className="fut-input" style={inputStyle} type="tel" value={futPhone}
                      onChange={(e) => setFutPhone(e.target.value)} placeholder="+48 …" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label style={labelStyle}>
                      <span className="flex items-center gap-1.5"><Calendar size={11} /> Preferowana data <span className="text-red-400">*</span></span>
                    </label>
                    <input className="fut-input" style={inputStyle} type="date" value={futDate}
                      min={minFutureDate}
                      onChange={(e) => setFutDate(e.target.value)} />
                  </div>
                  <div>
                    <label style={labelStyle}>
                      <span className="flex items-center gap-1.5"><Users size={11} /> Liczba gości <span className="text-red-400">*</span></span>
                    </label>
                    <select className="fut-input" style={{ ...inputStyle, appearance: "none" }}
                      value={futParty} onChange={(e) => setFutParty(e.target.value)}>
                      {[1,2,3,4,5,6,7,8,9,10,11,12].map((n) => (
                        <option key={n} value={n} style={{ backgroundColor: "#182522" }}>{n} {n === 1 ? "gość" : "gości"}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>
                    <span className="flex items-center gap-1.5"><MessageSquare size={11} /> Okazja lub specjalne życzenia</span>
                  </label>
                  <textarea className="fut-input" style={{ ...inputStyle, resize: "none" }} rows={3}
                    value={futNote} onChange={(e) => setFutNote(e.target.value)}
                    placeholder="Urodziny, rocznica, wymagania dietetyczne, elastyczność dat…" />
                </div>
              </div>

              {futErr && (
                <p className="text-xs mt-3" style={{ fontFamily: C.sans, color: "rgba(220,100,100,0.9)" }}>{futErr}</p>
              )}

              <button
                onClick={handleInquirySubmit}
                className="mt-6 w-full flex items-center justify-center gap-2 py-4 rounded-lg transition-all duration-200"
                style={{ fontFamily: C.sans, fontWeight: 500, letterSpacing: "0.05em", backgroundColor: C.gold, color: "#1E1A16", boxShadow: "0 8px 24px rgba(182,138,58,0.3)" }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(182,138,58,0.4)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(182,138,58,0.3)"; }}
              >
                <Send size={15} /> WYŚLIJ PROŚBĘ
              </button>

              <button
                onClick={() => setModalMode("notify")}
                className="mt-3 w-full text-xs text-center transition-colors duration-200"
                style={{ fontFamily: C.sans, fontWeight: 300, color: "rgba(243,239,234,0.35)" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = C.gold)}
                onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(243,239,234,0.35)")}
              >
                <span className="flex items-center justify-center gap-1.5">
                  <Bell size={12} /> Powiadom mnie, gdy pojawi się wolny termin
                </span>
              </button>
            </>
          )}

          {/* ── Inquiry Done ── */}
          {modalMode === "inquiryDone" && (
            <div className="text-center py-6">
              <div className="w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center"
                style={{ backgroundColor: "rgba(182,138,58,0.15)", border: `2px solid ${C.gold}` }}>
                <Check size={32} style={{ color: C.gold }} />
              </div>
              <h2 className="text-3xl mb-4" style={{ fontFamily: C.serif, fontWeight: 300, color: C.cream }}>Prośba otrzymana</h2>
              <p className="text-sm leading-relaxed mb-8" style={{ fontFamily: C.sans, fontWeight: 300, color: "rgba(243,239,234,0.55)", lineHeight: 1.7 }}>
                Dziękujemy, <strong style={{ color: C.cream, fontWeight: 400 }}>{futName}</strong>.<br />
                Nasz zespół przejrzy Twoją prośbę i skontaktuje się z Tobą pod adresem <strong style={{ color: C.cream, fontWeight: 400 }}>{futEmail}</strong>.
              </p>
              <button onClick={resetModal}
                className="px-8 py-3 rounded-lg text-sm transition-all duration-200"
                style={{ fontFamily: C.sans, fontWeight: 500, backgroundColor: "rgba(182,138,58,0.1)", color: C.gold, border: "1px solid rgba(182,138,58,0.25)" }}>
                Zamknij
              </button>
            </div>
          )}

          {/* ── Notify Form ── */}
          {modalMode === "notify" && (
            <>
              <h2 className="text-3xl mb-2" style={{ fontFamily: C.serif, fontWeight: 300, color: C.cream }}>
                Bądź na bieżąco
              </h2>
              <p className="text-sm mb-7" style={{ fontFamily: C.sans, fontWeight: 300, color: "rgba(243,239,234,0.5)", lineHeight: 1.6 }}>
                Skontaktujemy się, gdy tylko pojawi się wolny stolik na Twoją preferowaną datę. Bez spamu — tylko osobista wiadomość od naszego zespołu.
              </p>

              <div className="space-y-4">
                <div>
                  <label style={labelStyle}>
                    <span className="flex items-center gap-1.5"><Mail size={11} /> Email <span className="text-red-400">*</span></span>
                  </label>
                  <input className="fut-input" style={inputStyle} type="email" value={notifyEmail}
                    onChange={(e) => setNotifyEmail(e.target.value)} placeholder="you@example.com" />
                </div>
                <div>
                  <label style={labelStyle}>
                    <span className="flex items-center gap-1.5"><Calendar size={11} /> Preferowana data <span className="text-red-400">*</span></span>
                  </label>
                  <input className="fut-input" style={inputStyle} type="date" value={notifyDate}
                    min={minFutureDate}
                    onChange={(e) => setNotifyDate(e.target.value)} />
                </div>
              </div>

              {notifyErr && (
                <p className="text-xs mt-3" style={{ fontFamily: C.sans, color: "rgba(220,100,100,0.9)" }}>{notifyErr}</p>
              )}

              <button
                onClick={handleNotifySubmit}
                className="mt-6 w-full flex items-center justify-center gap-2 py-4 rounded-lg transition-all duration-200"
                style={{ fontFamily: C.sans, fontWeight: 500, letterSpacing: "0.05em", backgroundColor: C.gold, color: "#1E1A16", boxShadow: "0 8px 24px rgba(182,138,58,0.3)" }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(182,138,58,0.4)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(182,138,58,0.3)"; }}
              >
                <Bell size={15} /> POWIADOM MNIE
              </button>

              <button
                onClick={() => setModalMode("inquiry")}
                className="mt-3 w-full text-xs text-center transition-colors duration-200"
                style={{ fontFamily: C.sans, fontWeight: 300, color: "rgba(243,239,234,0.35)" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = C.gold)}
                onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(243,239,234,0.35)")}
              >
                <span className="flex items-center justify-center gap-1.5">
                  <Calendar size={12} /> Wyślij pełną prośbę o rezerwację
                </span>
              </button>
            </>
          )}

          {/* ── Notify Done ── */}
          {modalMode === "notifyDone" && (
            <div className="text-center py-6">
              <div className="w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center"
                style={{ backgroundColor: "rgba(182,138,58,0.15)", border: `2px solid ${C.gold}` }}>
                <Bell size={28} style={{ color: C.gold }} />
              </div>
              <h2 className="text-3xl mb-4" style={{ fontFamily: C.serif, fontWeight: 300, color: C.cream }}>Jesteś na liście</h2>
              <p className="text-sm leading-relaxed mb-8" style={{ fontFamily: C.sans, fontWeight: 300, color: "rgba(243,239,234,0.55)", lineHeight: 1.7 }}>
                Wyślemy osobistą wiadomość na adres <strong style={{ color: C.cream, fontWeight: 400 }}>{notifyEmail}</strong>, gdy tylko pojawi się dostępność na Twoją preferowaną datę.
              </p>
              <button onClick={resetModal}
                className="px-8 py-3 rounded-lg text-sm transition-all duration-200"
                style={{ fontFamily: C.sans, fontWeight: 500, backgroundColor: "rgba(182,138,58,0.1)", color: C.gold, border: "1px solid rgba(182,138,58,0.25)" }}>
                Zamknij
              </button>
            </div>
          )}
        </div>
      </div>
    )}
    </>
  );
}