import { useNavigate, useLocation } from "react-router";
import {
  Check,
  Calendar,
  Clock,
  Users,
  MapPin,
  Mail,
  Phone,
  Heart,
  Utensils,
  CalendarPlus,
  ExternalLink,
  ArrowRight,
  CreditCard,
  Shield,
  Bell,
  Smartphone,
} from "lucide-react";

/* ── Design tokens ── */
const C = {
  gold: "#B68A3A",
  cream: "#F3EFEA",
  card: "#182522",
  serif: "Cormorant Garamond, serif",
  sans: "Inter, sans-serif",
};

/* ── Step indicator ── */
function StepIndicator({ current }: { current: number }) {
  const steps = ["Data i godzina", "Wybierz stolik", "Twoje dane", "Potwierdzone"];
  return (
    <div className="flex items-center justify-center gap-1 mb-10 overflow-x-auto pb-2">
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

export function ConfirmationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { date, time, partySize, table, guest, deposit } = location.state || {};

  const formatDate = (d: Date) =>
    new Date(d).toLocaleDateString("pl-PL", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });

  const formatDateISO = (d: Date) => {
    const dt = new Date(d);
    const y = dt.getFullYear();
    const m = String(dt.getMonth() + 1).padStart(2, "0");
    const day = String(dt.getDate()).padStart(2, "0");
    return `${y}${m}${day}`;
  };

  /* Build Google Calendar link */
  const buildGoogleCalLink = () => {
    if (!date || !time) return "#";
    const dateStr = formatDateISO(date);
    const [h, m] = time.split(":").map(Number);
    const startH = String(h).padStart(2, "0");
    const startM = String(m || 0).padStart(2, "0");
    const endH = String(h + 2).padStart(2, "0");
    const dates = `${dateStr}T${startH}${startM}00/${dateStr}T${endH}${startM}00`;
    const title = encodeURIComponent("Kolacja w La Maison Dorée");
    const details = encodeURIComponent(
      `Stolik ${table?.number || "TBD"} · ${partySize} gości\nul. Nowy Świat 42, 00-363 Warszawa\nStrój smart casual. Proszę przybyć 15 min wcześniej.`
    );
    const loc = encodeURIComponent("La Maison Dorée, ul. Nowy Świat 42, 00-363 Warszawa");
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${loc}`;
  };

  /* Confirmation number (mock) */
  const confNumber = `LMD-${Date.now().toString(36).toUpperCase().slice(-6)}`;

  return (
    <div
      className="min-h-screen px-6 py-8 md:py-12"
      style={{
        background: "radial-gradient(ellipse at center, #1a2820 0%, #0E1714 100%)",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="max-w-3xl mx-auto">
        <StepIndicator current={3} />

        {/* Success card */}
        <div
          className="rounded-2xl p-8 md:p-12"
          style={{
            backgroundColor: C.card,
            boxShadow: "0 20px 64px rgba(0,0,0,0.4)",
            border: "1px solid rgba(243,239,234,0.05)",
          }}
        >
          {/* Success Icon */}
          <div
            className="w-20 h-20 rounded-full mx-auto mb-8 flex items-center justify-center"
            style={{
              backgroundColor: "rgba(182,138,58,0.15)",
              border: `2px solid ${C.gold}`,
            }}
          >
            <Check size={40} style={{ color: C.gold }} />
          </div>

          {/* Heading */}
          <div className="text-center mb-10">
            <h1
              className="text-4xl md:text-5xl mb-3"
              style={{ fontFamily: C.serif, fontWeight: 300, letterSpacing: "0.02em", color: C.cream }}
            >
              Rezerwacja potwierdzona
            </h1>
            <p className="text-base mb-2" style={{ fontFamily: C.sans, fontWeight: 300, color: "rgba(243,239,234,0.55)" }}>
              Z niecierpliwością czekamy na Ciebie, {guest?.firstName || "nasz gość"}.
            </p>
            <p className="text-xs" style={{ fontFamily: C.sans, fontWeight: 400, color: C.gold, letterSpacing: "0.1em" }}>
              Potwierdzenie #{confNumber}
            </p>
          </div>

          <div className="h-px w-full mb-10" style={{ backgroundColor: "rgba(182,138,58,0.2)" }} />

          {/* Details grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
            {/* Restaurant */}
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-lg" style={{ backgroundColor: "rgba(182,138,58,0.1)" }}>
                <MapPin size={18} style={{ color: C.gold }} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider mb-1" style={{ fontFamily: C.sans, fontWeight: 500, letterSpacing: "0.1em", color: C.gold }}>
                  Restauracja
                </p>
                <p className="text-base" style={{ fontFamily: C.serif, fontWeight: 400, color: C.cream }}>
                  La Maison Dorée
                </p>
                <p className="text-xs mt-0.5" style={{ fontFamily: C.sans, fontWeight: 300, color: "rgba(243,239,234,0.45)" }}>
                  ul. Nowy Świat 42, 00-363 Warszawa
                </p>
              </div>
            </div>

            {/* Date */}
            {date && (
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-lg" style={{ backgroundColor: "rgba(182,138,58,0.1)" }}>
                  <Calendar size={18} style={{ color: C.gold }} />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider mb-1" style={{ fontFamily: C.sans, fontWeight: 500, letterSpacing: "0.1em", color: C.gold }}>
                    Data
                  </p>
                  <p className="text-base" style={{ fontFamily: C.serif, fontWeight: 400, color: C.cream }}>
                    {formatDate(date)}
                  </p>
                </div>
              </div>
            )}

            {/* Time */}
            {time && (
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-lg" style={{ backgroundColor: "rgba(182,138,58,0.1)" }}>
                  <Clock size={18} style={{ color: C.gold }} />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider mb-1" style={{ fontFamily: C.sans, fontWeight: 500, letterSpacing: "0.1em", color: C.gold }}>
                    Godzina
                  </p>
                  <p className="text-base" style={{ fontFamily: C.serif, fontWeight: 400, color: C.cream }}>
                    {time}
                  </p>
                </div>
              </div>
            )}

            {/* Party & Table */}
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-lg" style={{ backgroundColor: "rgba(182,138,58,0.1)" }}>
                <Users size={18} style={{ color: C.gold }} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider mb-1" style={{ fontFamily: C.sans, fontWeight: 500, letterSpacing: "0.1em", color: C.gold }}>
                  Stolik i liczba gości
                </p>
                <p className="text-base" style={{ fontFamily: C.serif, fontWeight: 400, color: C.cream }}>
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

          {/* Guest details (if available) */}
          {guest && (
            <>
              <div className="h-px w-full mb-8" style={{ backgroundColor: "rgba(243,239,234,0.06)" }} />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-10">
                <div className="flex items-center gap-3">
                  <Mail size={15} style={{ color: "rgba(243,239,234,0.4)" }} />
                  <span className="text-sm" style={{ fontFamily: C.sans, fontWeight: 300, color: "rgba(243,239,234,0.6)" }}>
                    {guest.email}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone size={15} style={{ color: "rgba(243,239,234,0.4)" }} />
                  <span className="text-sm" style={{ fontFamily: C.sans, fontWeight: 300, color: "rgba(243,239,234,0.6)" }}>
                    {guest.phone}
                  </span>
                </div>
                {guest.occasion && (
                  <div className="flex items-center gap-3">
                    <Heart size={15} style={{ color: "rgba(243,239,234,0.4)" }} />
                    <span className="text-sm" style={{ fontFamily: C.sans, fontWeight: 300, color: "rgba(243,239,234,0.6)" }}>
                      {guest.occasion}
                    </span>
                  </div>
                )}
                {guest.tastingMenu && (
                  <div className="flex items-center gap-3">
                    <Utensils size={15} style={{ color: C.gold }} />
                    <span className="text-sm" style={{ fontFamily: C.sans, fontWeight: 400, color: C.gold }}>
                      Menu degustacyjne zamówione wcześniej
                    </span>
                  </div>
                )}
                {guest.dietary && (
                  <div className="flex items-center gap-3 sm:col-span-2">
                    <Utensils size={15} style={{ color: "rgba(243,239,234,0.4)" }} />
                    <span className="text-sm" style={{ fontFamily: C.sans, fontWeight: 300, color: "rgba(243,239,234,0.6)" }}>
                      Dieta: {guest.dietary}
                    </span>
                  </div>
                )}
              </div>
            </>
          )}

          <div className="h-px w-full mb-8" style={{ backgroundColor: "rgba(182,138,58,0.2)" }} />

          {/* Confirmation callout */}
          <div
            className="rounded-xl p-6 mb-8"
            style={{
              backgroundColor: "rgba(182,138,58,0.06)",
              border: "1px solid rgba(182,138,58,0.15)",
            }}
          >
            <p className="text-sm leading-relaxed" style={{ fontFamily: C.sans, fontWeight: 300, color: C.cream }}>
              Potwierdzenie zostało wysłane na adres <strong style={{ fontWeight: 500 }}>{guest?.email || "Twój e-mail"}</strong>.
              Prosimy przybyć w ciągu 15 minut od godziny rezerwacji. Uprzejmie prosimy o strój smart casual.
            </p>
          </div>

          {/* Deposit info */}
          {deposit && (
            <div
              className="rounded-xl p-6 mb-8"
              style={{
                backgroundColor: "rgba(182,138,58,0.04)",
                border: "1px solid rgba(182,138,58,0.12)",
              }}
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg flex-shrink-0" style={{ backgroundColor: "rgba(182,138,58,0.12)" }}>
                  <CreditCard size={18} style={{ color: C.gold }} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
                    <p className="text-sm" style={{ fontFamily: C.sans, fontWeight: 500, color: C.cream }}>
                      Depozyt pobrany: {deposit.amount} zł
                    </p>
                    <span
                      className="text-[10px] px-2.5 py-1 rounded-full"
                      style={{
                        fontFamily: C.sans,
                        fontWeight: 500,
                        backgroundColor: "rgba(80,180,100,0.12)",
                        color: "rgba(80,200,120,0.9)",
                        border: "1px solid rgba(80,180,100,0.2)",
                      }}
                    >
                      ✓ Opłacony
                    </span>
                  </div>
                  <p className="text-xs mb-2" style={{ fontFamily: C.sans, fontWeight: 300, color: "rgba(243,239,234,0.5)" }}>
                    {deposit.method === "blik" ? "BLIK" : deposit.method === "transfer" ? "Przelewy24" : `Karta •••• ${deposit.cardLast4}`} · {deposit.perPerson} zł × {partySize} {partySize === 1 ? "osoba" : partySize < 5 ? "osoby" : "osób"}
                  </p>
                  <div className="flex items-start gap-2">
                    <Shield size={12} className="mt-0.5 flex-shrink-0" style={{ color: "rgba(243,239,234,0.35)" }} />
                    <p className="text-[11px] leading-relaxed" style={{ fontFamily: C.sans, fontWeight: 300, color: "rgba(243,239,234,0.4)" }}>
                      Kwota zostanie odliczona od rachunku końcowego. Bezpłatne anulowanie do 24h przed wizytą — zwrot depozytu w całości. W przypadku niestawienia się (no-show) depozyt nie podlega zwrotowi.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Reminder notification callout */}
          <div
            className="rounded-xl p-6 mb-8"
            style={{
              backgroundColor: "rgba(122,175,232,0.04)",
              border: "1px solid rgba(122,175,232,0.15)",
            }}
          >
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg flex-shrink-0" style={{ backgroundColor: "rgba(122,175,232,0.12)" }}>
                <Bell size={18} style={{ color: "#7AAFE8" }} />
              </div>
              <div className="flex-1">
                <p className="text-sm mb-2" style={{ fontFamily: C.sans, fontWeight: 500, color: C.cream }}>
                  Automatyczne przypomnienie
                </p>
                <p className="text-xs leading-relaxed mb-3" style={{ fontFamily: C.sans, fontWeight: 300, color: "rgba(243,239,234,0.6)" }}>
                  3 godziny przed wizytą wyślemy przypomnienie na podany numer telefonu (SMS) oraz adres e-mail z podsumowaniem rezerwacji.
                </p>
                <div className="flex flex-wrap gap-3">
                  <span className="inline-flex items-center gap-1.5 text-[11px] px-3 py-1.5 rounded-full" style={{ backgroundColor: "rgba(96,194,117,0.08)", color: "rgba(96,194,117,0.9)", border: "1px solid rgba(96,194,117,0.15)" }}>
                    <Smartphone size={12} /> SMS — aktywne
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-[11px] px-3 py-1.5 rounded-full" style={{ backgroundColor: "rgba(96,194,117,0.08)", color: "rgba(96,194,117,0.9)", border: "1px solid rgba(96,194,117,0.15)" }}>
                    <Mail size={12} /> E-mail — aktywne
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Add to Calendar */}
          <div className="flex flex-wrap gap-3 mb-10">
            <a
              href={buildGoogleCalLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-3 rounded-lg text-sm transition-all duration-200"
              style={{
                fontFamily: C.sans,
                fontWeight: 400,
                backgroundColor: "rgba(243,239,234,0.04)",
                color: C.cream,
                border: "1px solid rgba(243,239,234,0.1)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "rgba(182,138,58,0.3)";
                e.currentTarget.style.backgroundColor = "rgba(182,138,58,0.06)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(243,239,234,0.1)";
                e.currentTarget.style.backgroundColor = "rgba(243,239,234,0.04)";
              }}
            >
              <CalendarPlus size={16} style={{ color: C.gold }} />
              Dodaj do Kalendarza Google
              <ExternalLink size={12} style={{ color: "rgba(243,239,234,0.3)" }} />
            </a>
          </div>

          {/* Modify/Cancel */}
          <p className="text-center text-xs mb-10" style={{ fontFamily: C.sans, fontWeight: 300, color: "rgba(243,239,234,0.4)" }}>
            Chcesz coś zmienić?{" "}
            <button
              onClick={() => navigate("/reserve")}
              className="underline transition-colors duration-200"
              style={{ color: C.gold }}
            >
              Zmodyfikuj lub anuluj rezerwację
            </button>
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => { navigate("/"); window.scrollTo(0, 0); }}
              className="flex-1 py-4 rounded-lg transition-all duration-300"
              style={{
                fontWeight: 500,
                fontFamily: C.sans,
                letterSpacing: "0.05em",
                backgroundColor: "rgba(182,138,58,0.08)",
                color: C.gold,
                border: "1px solid rgba(182,138,58,0.25)",
              }}
            >
              WRÓĆ DO STRONY GŁÓWNEJ
            </button>
            <button
              onClick={() => navigate("/reserve")}
              className="flex-1 py-4 rounded-lg flex items-center justify-center gap-2 transition-all duration-300"
              style={{
                fontWeight: 500,
                fontFamily: C.sans,
                letterSpacing: "0.05em",
                backgroundColor: C.gold,
                color: "#1E1A16",
                boxShadow: "0 8px 32px rgba(182,138,58,0.25)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 12px 40px rgba(182,138,58,0.35)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 8px 32px rgba(182,138,58,0.25)";
              }}
            >
              STWORZ KOLEJNĄ REZERWACJĘ
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}