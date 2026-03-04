import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import {
  Building2,
  Briefcase,
  Sparkles,
  Utensils,
  Wine,
  CalendarDays,
  Mail,
  Phone,
  Check,
  ChevronDown,
  MapPin,
  Car,
  Accessibility,
  Monitor,
  Clock,
  CreditCard,
  Send,
  FileDown,
  ArrowRight,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Navigation } from "../components/navigation";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../components/ui/accordion";
import { CoverflowGallery } from "../components/coverflow-gallery";

/* ═══════════════════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════════════════ */

const EVENT_TYPES = [
  { id: "private-dining", title: "Prywatna kolacja", description: "Kameralne menu degustacyjne dla do 20 gości, tworzone przez naszego szefa kuchni.", icon: Utensils },
  { id: "business", title: "Eventy biznesowe", description: "Lunche dla kadry zarządzającej, spotkania zarządu i przyjęcia dla klientów.", icon: Briefcase },
  { id: "celebration", title: "Uroczystości", description: "Rocznice, kolacje zareczynowe i przełomowe chwile.", icon: Sparkles },
  { id: "buyout", title: "Wynajem całości", description: "Wyłączny dostęp do całej restauracji i tarasu.", icon: Building2 },
];

const SPACES = [
  {
    name: "Salon Prywatny",
    seated: "Do 20",
    standing: "Do 30",
    minSpend: "8 000 PLN",
    av: "Ekran 55″, HDMI, Wi‑Fi",
    layout: "Sala obrad, bankiet",
    access: "Parter, dostępny dla wózków inwalidzkich",
  },
  {
    name: "Główna Sala",
    seated: "10–40",
    standing: "Do 50",
    minSpend: "15 000 PLN",
    av: "Projektor, nagłośnienie, 2× mikrofon",
    layout: "Układ U, bankiet, koktajl",
    access: "Parter, dostępny dla wózków inwalidzkich",
  },
  {
    name: "Wynajem całości",
    seated: "Do 60",
    standing: "Do 80",
    minSpend: "30 000 PLN",
    av: "Pełne wyposażenie AV w cenie",
    layout: "Dowolna konfiguracja",
    access: "Cały lokal, wszystkie strefy",
  },
];

const CLIENT_LOGOS = [
  "Deloitte", "BCG", "McKinsey", "Goldman Sachs", "Google",
];

const GALLERY = [
  { id: 1, label: "Kolacja biznesowa — 18 gości", img: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80" },
  { id: 2, label: "Doświadczenie Chef’s Table",    img: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80" },
  { id: 3, label: "Salon Prywatny — bankiet",       img: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80" },
  { id: 4, label: "Wieczór uroczysty",              img: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&q=80" },
  { id: 5, label: "Kolacja z doborem win",           img: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&q=80" },
  { id: 6, label: "Przyjęcie koktajlowe",           img: "https://images.unsplash.com/photo-1555244162-803834f70033?w=800&q=80" },
  { id: 7, label: "Główna sala — układ U",          img: "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=800&q=80" },
  { id: 8, label: "Aperitivo na tarasie",            img: "https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=800&q=80" },
];

const FAQS = [
  { q: "Jaki jest minimalny wydatek na prywatne wydarzenie?", a: "Minimalne wydatki zależą od przestrzeni: od 8 000 PLN za Salon Prywatny do 30 000 PLN za wynajem całości. Jedzenie i napoje wliczają się w minimum. Twój menadżer wydarzeń potwierdzi dokładne wymagania na podstawie wybranej daty i konfiguracji." },
  { q: "Z jakim wyprzedzeniem powinienem zarezerwować?", a: "Zalecamy rezerwację co najmniej 4–6 tygodni wcześniej dla mniejszych wydarzeń oraz 8–12 tygodni dla wynajmu całości lub dat w sezonie świątecznym. Zapytania last-minute są mile widziane — w zależności od dostępności." },
  { q: "Jaka jest polityka anulowania i zaliczki?", a: "30% bezzwrotna zaliczka zabezpiecza Twoją datę. Anulacje dokonane na 14+ dni przed wydarzeniem otrzymują kredyt w wysokości 50% zaliczki na przyszłą rezerwację. Pełna płatność jest wymagana 5 dni roboczych przed wydarzeniem." },
  { q: "Czy mogę przyprowadzić własnego DJ-a, zespół lub dekoracje?", a: "Tak. Zewnętrzni dostawcy (kwiaciarze, muzycy, DJ-e) są mile widziani po uprzedniej koordynacji. Udostępniamy listę preferowanych partnerów i możemy zarządzać logistyką dostawców w Twoim imieniu. System nagłośnienia i mikrofon są dostępne na miejscu." },
  { q: "Czy sprzęt AV jest dostępny dla prezentacji?", a: "Wszystkie przestrzenie mają Wi-Fi. Salon Prywatny posiada ekran 55″ z HDMI. Główna Sala wyposażona jest w projektor, system nagłośnienia i dwa mikrofony bezprzewodowe. Wynajem całości obejmuje kompletny zestaw AV." },
  { q: "Czy uwzględniacie ograniczenia dietetyczne?", a: "Oczywiście. Nasz szef kuchni projektuje menu uwzględniające wymagania wegetariańskie, wegańskie, bezglutenowe, koszerne, halal i alergenowe. Prosimy o podanie wszelkich potrzeb w zapytaniu i podczas konsultacji menu." },
  { q: "Jakie są godziny obsługi i polityka nadgodzin?", a: "Standardowe okna wydarzeń wynoszą 4 godziny. Przedłużenia są dostępne za 2 500 PLN za każdą dodatkową godzinę, w zależności od dostępności. Wydarzenia do późna (po 23:00) mogą wymagać wcześniejszych ustaleń." },
  { q: "Czy lokal jest dostępny dla osób na wózkach inwalidzkich?", a: "Tak. Parter — w tym Salon Prywatny, Główna Sala, toalety i wejście — jest w pełni dostępny dla wózków inwalidzkich. Chętnie uwzględniamy wszelkie dodatkowe potrzeby w zakresie dostępności." },
];

const GUEST_OPTIONS = ["10–20", "20–30", "30–40", "40–50", "50–60", "60+"];

const BOOKING_STEPS = [
  { step: 1, title: "Wyślij zapytanie", description: "Wypełnij formularz ze szczegółami wydarzenia. Odpowiadamy w ciągu 4 godzin roboczych." },
  { step: 2, title: "Poznaj swojego menadżera wydarzeń", description: "Bezpłatna konsultacja — osobiście lub online — w celu zaplanowania menu, aranacji sali i logistyki." },
  { step: 3, title: "Potwierdź i świętuj", description: "Zabezpiecz datę zapłatą 30% zaliczki. Resztą zajmiemy się my." },
];

/* ═══════════════════════════════════════════════════════
   STYLES
   ═══════════════════════════════════════════════════════ */

const inputStyle: React.CSSProperties = {
  backgroundColor: "rgba(243, 239, 234, 0.05)",
  border: "1px solid rgba(243, 239, 234, 0.12)",
  color: "#F3EFEA",
  colorScheme: "dark",
};

const cardBg: React.CSSProperties = {
  backgroundColor: "#182522",
  border: "1px solid rgba(243, 239, 234, 0.06)",
  boxShadow: "0 10px 26px rgba(0, 0, 0, 0.28)",
};

const scrollToInquiry = () =>
  document.getElementById("inquiry")?.scrollIntoView({ behavior: "smooth" });

/* ═══════════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════════ */

export function PrivateEventsPage() {
  const navigate = useNavigate();

  /* form state */
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [guests, setGuests] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [altDate, setAltDate] = useState("");
  const [gdpr, setGdpr] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState("");

  /* sticky bar */
  const [showSticky, setShowSticky] = useState(false);
  useEffect(() => {
    const handleScroll = () => setShowSticky(window.scrollY > 600);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* lightbox */
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const closeLightbox = () => setLightboxIdx(null);
  const prevImage = useCallback(() => setLightboxIdx((i) => (i !== null ? (i - 1 + GALLERY.length) % GALLERY.length : null)), []);
  const nextImage = useCallback(() => setLightboxIdx((i) => (i !== null ? (i + 1) % GALLERY.length : null)), []);

  useEffect(() => {
    if (lightboxIdx === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") prevImage();
      if (e.key === "ArrowRight") nextImage();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightboxIdx, prevImage, nextImage]);

  const toggleType = (id: string) =>
    setSelectedTypes((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );

  const handleSubmit = () => {
    setFormError("");
    if (selectedTypes.length === 0) {
      setFormError("Wybierz co najmniej jeden rodzaj wydarzenia.");
      return;
    }
    if (!gdpr) {
      setFormError("Zaakceptuj politykę prywatności, aby kontynuować.");
      return;
    }
    setSubmitted(true);
  };

  return (
    <div
      className="min-h-screen"
      style={{
        background: "radial-gradient(ellipse at center, #1a2820 0%, #0E1714 100%)",
        backgroundAttachment: "fixed",
      }}
    >
      <Navigation />

      {/* ══════════════════════════════════════════════
          STICKY INQUIRY BAR
          ══════════════════════════════════════════════ */}
      <div
        className="fixed bottom-0 left-0 right-0 z-40 transition-all duration-300 flex items-center justify-center px-6 py-3"
        style={{
          transform: showSticky ? "translateY(0)" : "translateY(100%)",
          backgroundColor: "rgba(24, 37, 34, 0.95)",
          backdropFilter: "blur(12px)",
          borderTop: "1px solid rgba(182, 138, 58, 0.2)",
        }}
      >
        <div className="max-w-4xl w-full flex items-center justify-between gap-4">
          <p className="text-sm hidden sm:block" style={{ color: "rgba(243, 239, 234, 0.7)" }}>
            Planujesz prywatne wydarzenie? Pomóżemy Ci stworzyć coś niezapomnianego.
          </p>
          <div className="flex items-center gap-3 shrink-0">
            <a
              href="tel:+48220000000"
              className="px-4 py-2 rounded-lg text-xs transition-all duration-200"
              style={{ border: "1px solid rgba(243, 239, 234, 0.2)", color: "#F3EFEA" }}
            >
              <Phone size={14} className="inline mr-1.5 -mt-0.5" /> ZADZWOŃ
            </a>
            <button
              onClick={scrollToInquiry}
              className="px-5 py-2 rounded-lg text-xs transition-all duration-200"
              style={{ backgroundColor: "#B68A3A", color: "#1E1A16", fontWeight: 600 }}
            >
              ZAPYTAJ TERAZ
            </button>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════
          LIGHTBOX
          ══════════════════════════════════════════════ */}
      {lightboxIdx !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
          onClick={closeLightbox}
        >
          <button className="absolute top-6 right-6 text-white/70 hover:text-white" onClick={closeLightbox}><X size={28} /></button>
          <button className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white" onClick={(e) => { e.stopPropagation(); prevImage(); }}><ChevronLeft size={36} /></button>
          <button className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white" onClick={(e) => { e.stopPropagation(); nextImage(); }}><ChevronRight size={36} /></button>
          <div className="max-w-5xl max-h-[85vh] px-12" onClick={(e) => e.stopPropagation()}>
            <img src={GALLERY[lightboxIdx].img.replace("w=800", "w=1400")} alt={GALLERY[lightboxIdx].label} className="max-h-[80vh] w-auto rounded-xl object-contain" />
            <p className="text-center mt-3 text-sm" style={{ color: "rgba(243,239,234,0.7)" }}>{GALLERY[lightboxIdx].label}</p>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════
          1. HERO — with background image, brochure CTA, phone
          ══════════════════════════════════════════════ */}
      <div className="min-h-screen flex flex-col">
      <section className="relative flex-1 px-6 md:px-12 pt-36 pb-24 md:pt-44 md:pb-32 overflow-hidden flex items-center">
        {/* hero bg */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1600&q=80"
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(14,23,20,0.88) 0%, rgba(14,23,20,0.95) 100%)" }} />
        </div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="h-px w-24 mx-auto mb-10" style={{ backgroundColor: "#B68A3A", opacity: 0.6 }} />
          <h1
            className="text-4xl md:text-6xl lg:text-7xl tracking-wide"
            style={{ fontFamily: "Cormorant Garamond, serif", fontWeight: 300, letterSpacing: "0.05em", color: "#F3EFEA" }}
          >
            Prywatne wydarzenia w<br />La Maison Dorée
          </h1>
          <p
            className="mt-6 text-base md:text-lg leading-relaxed max-w-3xl mx-auto"
            style={{ fontFamily: "Inter, sans-serif", fontWeight: 300, color: "rgba(243, 239, 234, 0.7)" }}
          >
            Elegancka przestrzeń na prywatne kolacje, spotkania biznesowe i wyjątkowe uroczystości.
          </p>

          {/* hero CTAs */}
          <div className="mt-10 flex flex-col md:flex-row items-center justify-center gap-4">
            <button
              className="px-8 py-3 rounded-lg transition-all duration-200"
              style={{
                fontFamily: "Inter, sans-serif", fontWeight: 500, letterSpacing: "0.08em", fontSize: "14px",
                backgroundColor: "#B68A3A", color: "#1E1A16", boxShadow: "0 8px 28px rgba(182, 138, 58, 0.3)",
              }}
              onClick={scrollToInquiry}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 34px rgba(182, 138, 58, 0.4)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 8px 28px rgba(182, 138, 58, 0.3)"; }}
            >
              ZAPYTAJ O DOSTĘPNOŚĆ
            </button>
            <button
              className="px-8 py-3 rounded-lg transition-all duration-200 flex items-center gap-2"
              style={{
                fontFamily: "Inter, sans-serif", fontWeight: 500, letterSpacing: "0.08em", fontSize: "14px",
                backgroundColor: "transparent", color: "#F3EFEA", border: "1px solid rgba(243, 239, 234, 0.2)",
              }}
              onClick={() => document.getElementById("spaces")?.scrollIntoView({ behavior: "smooth" })}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(182, 138, 58, 0.6)"; e.currentTarget.style.color = "#B68A3A"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(243, 239, 234, 0.2)"; e.currentTarget.style.color = "#F3EFEA"; }}
            >
              ODKRYJ NASZE PRZESTRZENIE
            </button>
          </div>

          {/* secondary CTA — download brochure */}
          <div className="mt-6 flex items-center justify-center gap-6">
            <a
              href="#"
              className="flex items-center gap-2 text-xs transition-colors duration-200 hover:text-[#B68A3A]"
              style={{ color: "rgba(243, 239, 234, 0.5)", letterSpacing: "0.06em" }}
            >
              <FileDown size={14} /> Pobierz broszurę wydarzeń (PDF)
            </a>
            <span style={{ color: "rgba(243, 239, 234, 0.15)" }}>|</span>
            <a
              href="tel:+48223456789"
              className="flex items-center gap-2 text-xs transition-colors duration-200 hover:text-[#B68A3A]"
              style={{ color: "rgba(243, 239, 234, 0.5)", letterSpacing: "0.06em" }}
            >
              <Phone size={14} /> +48 22 345 67 89
            </a>
          </div>

        </div>
      </section>

      <div className="h-px w-full" style={{ backgroundColor: "rgba(182,138,58,0.15)" }} />

      {/* trust strip */}
      <section className="px-6 md:px-12 py-20 text-center flex flex-col items-center justify-center">
        <p
          className="text-sm uppercase tracking-[0.3em] mb-8"
          style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, color: "rgba(182,138,58,0.8)" }}
        >
          Zaufany przez wiodące organizacje
        </p>
        <div className="flex items-center justify-center flex-wrap gap-8 md:gap-14">
          {CLIENT_LOGOS.map((name) => (
            <span
              key={name}
              className="text-xl"
              style={{ fontFamily: "Cormorant Garamond, serif", fontWeight: 600, color: "rgba(243,239,234,0.35)" }}
            >
              {name}
            </span>
          ))}
        </div>
      </section>
      </div>

      <div className="h-px w-full" style={{ backgroundColor: "rgba(182,138,58,0.15)" }} />

      {/* ══════════════════════════════════════════════
          3. TYPES OF EVENTS — clickable, scroll to form
          ══════════════════════════════════════════════ */}
      <section className="px-6 md:px-12 py-20 md:py-28">
        <div className="max-w-6xl mx-auto">
          <SectionHeader title="Rodzaje wydarzeń" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {EVENT_TYPES.map((item) => {
              const Icon = item.icon;
              const isSelected = selectedTypes.includes(item.id);
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    toggleType(item.id);
                    scrollToInquiry();
                  }}
                  className="rounded-2xl p-6 text-left transition-all duration-200 group"
                  style={{
                    ...cardBg,
                    border: isSelected ? "1px solid rgba(182, 138, 58, 0.5)" : cardBg.border,
                  }}
                >
                  <div className="w-11 h-11 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: "rgba(182, 138, 58, 0.14)" }}>
                    <Icon size={20} color="#B68A3A" />
                  </div>
                  <h3 className="text-xl mb-2" style={{ fontFamily: "Cormorant Garamond, serif", fontWeight: 400, color: "#F3EFEA" }}>
                    {item.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ fontFamily: "Inter, sans-serif", fontWeight: 300, color: "rgba(243, 239, 234, 0.6)" }}>
                    {item.description}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1 text-xs opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: "#B68A3A" }}>
                    Zapytaj <ArrowRight size={12} />
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <div className="h-px w-full" style={{ backgroundColor: "rgba(182,138,58,0.15)" }} />

      {/* ══════════════════════════════════════════════
          4. SPACES COMPARISON TABLE
          ══════════════════════════════════════════════ */}
      <section id="spaces" className="px-6 md:px-12 py-20 md:py-28">
        <div className="max-w-6xl mx-auto">
          <SectionHeader title="Nasze przestrzenie i pojemność" subtitle="Porównaj nasze trzy konfiguracje wydarzeń, aby znaleźć idealną opcję." />

          {/* comparison table — desktop */}
          <div className="hidden md:block rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(243, 239, 234, 0.08)" }}>
            <table className="w-full text-sm" style={{ fontFamily: "Inter, sans-serif" }}>
              <thead>
                <tr style={{ backgroundColor: "rgba(182, 138, 58, 0.1)" }}>
                  <th className="text-left px-6 py-4 font-medium" style={{ color: "#B68A3A" }}>Funkcja</th>
                  {SPACES.map((s) => (
                    <th key={s.name} className="text-left px-6 py-4 font-medium" style={{ color: "#F3EFEA" }}>{s.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { label: "Miejsc siedzących", key: "seated" as const },
                  { label: "Miejsc stojących", key: "standing" as const },
                  { label: "Min. wydatki", key: "minSpend" as const },
                  { label: "Sprzęt AV", key: "av" as const },
                  { label: "Układy miejsc", key: "layout" as const },
                  { label: "Dostępność", key: "access" as const },
                ].map((row, i) => (
                  <tr key={row.key} style={{ backgroundColor: i % 2 === 0 ? "rgba(24, 37, 34, 0.5)" : "rgba(24, 37, 34, 0.3)" }}>
                    <td className="px-6 py-3.5 font-medium" style={{ color: "rgba(243, 239, 234, 0.6)" }}>{row.label}</td>
                    {SPACES.map((s) => (
                      <td key={s.name} className="px-6 py-3.5" style={{ color: "#F3EFEA" }}>{s[row.key]}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* comparison cards — mobile */}
          <div className="md:hidden space-y-6">
            {SPACES.map((s) => (
              <div key={s.name} className="rounded-2xl p-6" style={cardBg}>
                <h3 className="text-xl mb-4" style={{ fontFamily: "Cormorant Garamond, serif", fontWeight: 400, color: "#F3EFEA" }}>{s.name}</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span style={{ color: "rgba(243,239,234,0.6)" }}>Siedzące</span><span style={{ color: "#F3EFEA" }}>{s.seated}</span></div>
                  <div className="flex justify-between"><span style={{ color: "rgba(243,239,234,0.6)" }}>Stojące</span><span style={{ color: "#F3EFEA" }}>{s.standing}</span></div>
                  <div className="flex justify-between"><span style={{ color: "rgba(243,239,234,0.6)" }}>Min. wydatki</span><span style={{ color: "#B68A3A" }}>{s.minSpend}</span></div>
                  <div className="flex justify-between"><span style={{ color: "rgba(243,239,234,0.6)" }}>AV</span><span className="text-right max-w-[60%]" style={{ color: "#F3EFEA" }}>{s.av}</span></div>
                  <div className="flex justify-between"><span style={{ color: "rgba(243,239,234,0.6)" }}>Układy</span><span style={{ color: "#F3EFEA" }}>{s.layout}</span></div>
                </div>
              </div>
            ))}
          </div>

          {/* pricing strip */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
            <div className="rounded-2xl p-8" style={{ backgroundColor: "#17221F", border: "1px solid rgba(243, 239, 234, 0.06)", boxShadow: "0 12px 30px rgba(0, 0, 0, 0.3)" }}>
              <h3 className="text-2xl mb-4" style={{ fontFamily: "Cormorant Garamond, serif", fontWeight: 400, color: "#F3EFEA" }}>Menu degustacyjne</h3>
              <div className="space-y-3">
                <PriceLine label="5 dań" price="od 420 PLN / osobę" />
                <PriceLine label="7 dań" price="od 520 PLN / osobę" />
              </div>
              <p className="mt-4 text-sm leading-relaxed" style={{ fontFamily: "Inter, sans-serif", color: "rgba(243, 239, 234, 0.6)" }}>
                Sezonowe menu tworzone podczas bezpłatnej konsultacji z szefem kuchni. Wlicza się w minimalne wydatki.
              </p>
            </div>

            <div className="rounded-2xl p-8" style={{ backgroundColor: "#17221F", border: "1px solid rgba(243, 239, 234, 0.06)", boxShadow: "0 12px 30px rgba(0, 0, 0, 0.3)" }}>
              <h3 className="text-2xl mb-4" style={{ fontFamily: "Cormorant Garamond, serif", fontWeight: 400, color: "#F3EFEA" }}>Pakiety napojów</h3>
              <div className="space-y-3">
                <PriceLine label="Dobór win (5 dań)" price="od 280 PLN / osobę" />
                <PriceLine label="Dobór win (7 dań)" price="od 380 PLN / osobę" />
                <PriceLine label="Open bar (4h)" price="od 200 PLN / osobę" />
              </div>
              <div className="grid grid-cols-2 gap-3 mt-6 text-sm">
                <div className="flex items-center gap-2 rounded-lg p-3" style={{ backgroundColor: "rgba(182, 138, 58, 0.12)" }}>
                  <Wine size={16} color="#B68A3A" /> Prowadzone przez sommeliera
                </div>
                <div className="flex items-center gap-2 rounded-lg p-3" style={{ backgroundColor: "rgba(182, 138, 58, 0.12)" }}>
                  <Sparkles size={16} color="#B68A3A" /> Autorskie koktajle
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="h-px w-full" style={{ backgroundColor: "rgba(182,138,58,0.15)" }} />

      {/* ══════════════════════════════════════════════
          5. JAK TO DZIAŁA — booking flow
          ══════════════════════════════════════════════ */}
      <section className="px-6 md:px-12 py-20 md:py-28">
        <div className="max-w-4xl mx-auto">
          <SectionHeader title="Jak to działa" subtitle="Od pierwszego zapytania do wydarzenia — trzy proste kroki." />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {BOOKING_STEPS.map((s, i) => (
              <div key={s.step} className="relative text-center">
                {i < BOOKING_STEPS.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-[calc(50%+32px)] w-[calc(100%-64px)] h-px" style={{ backgroundColor: "rgba(182, 138, 58, 0.2)" }} />
                )}
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
                  style={{ backgroundColor: "rgba(182, 138, 58, 0.14)", border: "1px solid rgba(182, 138, 58, 0.3)" }}
                >
                  <span className="text-xl font-light" style={{ fontFamily: "Cormorant Garamond, serif", color: "#B68A3A" }}>{s.step}</span>
                </div>
                <h3 className="text-lg mb-2" style={{ fontFamily: "Cormorant Garamond, serif", fontWeight: 400, color: "#F3EFEA" }}>{s.title}</h3>
                <p className="text-sm leading-relaxed" style={{ fontFamily: "Inter, sans-serif", fontWeight: 300, color: "rgba(243, 239, 234, 0.6)" }}>{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="h-px w-full" style={{ backgroundColor: "rgba(182,138,58,0.15)" }} />

      {/* ══════════════════════════════════════════════
          6. INQUIRY FORM — Zapytaj o swoje wydarzenie
          ══════════════════════════════════════════════ */}
      <section className="px-6 md:px-12 py-20 md:py-28">
        <div className="max-w-6xl mx-auto">
          <div id="inquiry" className="text-center mb-12 scroll-mt-28">
            <h2 className="text-3xl md:text-5xl" style={{ fontFamily: "Cormorant Garamond, serif", fontWeight: 300, letterSpacing: "0.03em", color: "#F3EFEA" }}>
              Zapytaj o swoje wydarzenie
            </h2>
            <div className="h-px w-16 mx-auto mt-4" style={{ backgroundColor: "#B68A3A", opacity: 0.5 }} />
          </div>

          <div className="max-w-3xl mx-auto">
            {submitted ? (
              /* ── success state ── */
              <div className="rounded-2xl p-12 text-center" style={cardBg}>
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: "rgba(182, 138, 58, 0.18)" }}>
                  <Check size={28} color="#B68A3A" />
                </div>
                <h3 className="text-2xl mb-3" style={{ fontFamily: "Cormorant Garamond, serif", fontWeight: 400, color: "#F3EFEA" }}>
                  Zapytanie otrzymane
                </h3>
                <p className="text-sm leading-relaxed mb-2" style={{ color: "rgba(243, 239, 234, 0.7)" }}>
                  Dziękujemy za zainteresowanie organizacją wydarzenia w La Maison Dorée.
                </p>
                <p className="text-sm leading-relaxed mb-6" style={{ color: "rgba(243, 239, 234, 0.7)" }}>
                  Nasz Menadżer Wydarzeń, <strong style={{ color: "#F3EFEA" }}>Marie Kowalska</strong>, skontaktuje się z Tobą w ciągu <strong style={{ color: "#B68A3A" }}>4 godzin roboczych</strong>, aby omówić szczegóły wydarzenia.
                </p>
                <div className="flex items-center justify-center gap-4 text-xs" style={{ color: "rgba(243, 239, 234, 0.5)" }}>
                  <span className="flex items-center gap-1.5"><Mail size={13} color="#B68A3A" /> wydarzenia@lamaisondoree.pl</span>
                  <span className="flex items-center gap-1.5"><Phone size={13} color="#B68A3A" /> +48 22 345 67 89</span>
                </div>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-8 text-xs underline transition-colors hover:text-[#B68A3A]"
                  style={{ color: "rgba(243, 239, 234, 0.4)" }}
                >
                  Wyślij kolejne zapytanie
                </button>
              </div>
            ) : (
              /* ── form ── */
              <div className="rounded-2xl p-8 md:p-10" style={cardBg}>
                <div className="space-y-5">
                  {/* row 1 — name / company */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField label="Pełne imię i nazwisko *">
                      <input placeholder="Jan Kowalski" className="w-full rounded-lg px-4 py-3 text-sm outline-none focus:ring-1 focus:ring-[#B68A3A]" style={inputStyle} />
                    </FormField>
                    <FormField label="Firma">
                      <input placeholder="Opcjonalnie" className="w-full rounded-lg px-4 py-3 text-sm outline-none focus:ring-1 focus:ring-[#B68A3A]" style={inputStyle} />
                    </FormField>
                  </div>

                  {/* row 2 — email / phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField label="E-mail *">
                      <input type="email" placeholder="jan@firma.pl" className="w-full rounded-lg px-4 py-3 text-sm outline-none focus:ring-1 focus:ring-[#B68A3A]" style={inputStyle} />
                    </FormField>
                    <FormField label="Telefon *">
                      <input type="tel" placeholder="+48 …" className="w-full rounded-lg px-4 py-3 text-sm outline-none focus:ring-1 focus:ring-[#B68A3A]" style={inputStyle} />
                    </FormField>
                  </div>

                  {/* event type toggles */}
                  <FormField label="Rodzaj wydarzenia *">
                    <div className="flex flex-wrap gap-2">
                      {EVENT_TYPES.map((t) => {
                        const active = selectedTypes.includes(t.id);
                        return (
                          <button
                            key={t.id}
                            type="button"
                            onClick={() => toggleType(t.id)}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all duration-200"
                            style={{
                              backgroundColor: active ? "rgba(182, 138, 58, 0.22)" : "rgba(243, 239, 234, 0.05)",
                              border: active ? "1px solid rgba(182, 138, 58, 0.5)" : "1px solid rgba(243, 239, 234, 0.12)",
                              color: active ? "#B68A3A" : "rgba(243, 239, 234, 0.7)",
                            }}
                          >
                            <span
                              className="w-4 h-4 rounded flex items-center justify-center shrink-0"
                              style={{
                                border: active ? "none" : "1.5px solid rgba(243, 239, 234, 0.3)",
                                backgroundColor: active ? "#B68A3A" : "transparent",
                              }}
                            >
                              {active && <Check size={12} color="#1E1A16" strokeWidth={3} />}
                            </span>
                            {t.title}
                          </button>
                        );
                      })}
                    </div>
                  </FormField>

                  {/* guests + budget */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField label="Liczba gości">
                      <div className="relative">
                        <select
                          value={guests}
                          onChange={(e) => setGuests(e.target.value)}
                          className="w-full rounded-lg px-4 py-3 text-sm outline-none appearance-none focus:ring-1 focus:ring-[#B68A3A]"
                          style={{ ...inputStyle, cursor: "pointer" }}
                        >
                          <option value="" style={{ backgroundColor: "#182522", color: "#F3EFEA" }}>Wybierz zakres</option>
                          {GUEST_OPTIONS.map((o) => (
                            <option key={o} value={o} style={{ backgroundColor: "#182522", color: "#F3EFEA" }}>{o}</option>
                          ))}
                        </select>
                        <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" color="rgba(243,239,234,0.4)" />
                      </div>
                    </FormField>
                    <FormField label="Szacowany budżet">
                      <div className="relative">
                        <select
                          className="w-full rounded-lg px-4 py-3 text-sm outline-none appearance-none focus:ring-1 focus:ring-[#B68A3A]"
                          style={{ ...inputStyle, cursor: "pointer" }}
                        >
                          <option value="" style={{ backgroundColor: "#182522", color: "#F3EFEA" }}>Wybierz zakres</option>
                          <option style={{ backgroundColor: "#182522", color: "#F3EFEA" }}>8 000 – 15 000 PLN</option>
                          <option style={{ backgroundColor: "#182522", color: "#F3EFEA" }}>15 000 – 30 000 PLN</option>
                          <option style={{ backgroundColor: "#182522", color: "#F3EFEA" }}>30 000 – 50 000 PLN</option>
                          <option style={{ backgroundColor: "#182522", color: "#F3EFEA" }}>50 000+ PLN</option>
                        </select>
                        <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" color="rgba(243,239,234,0.4)" />
                      </div>
                    </FormField>
                  </div>

                  {/* dates + time */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <FormField label="Preferowana data">
                      <input
                        type="date"
                        value={preferredDate}
                        onChange={(e) => setPreferredDate(e.target.value)}
                        className="w-full rounded-lg px-4 py-3 text-sm outline-none focus:ring-1 focus:ring-[#B68A3A]"
                        style={{ ...inputStyle, colorScheme: "dark" }}
                      />
                    </FormField>
                    <FormField label="Alternatywna data">
                      <input
                        type="date"
                        value={altDate}
                        onChange={(e) => setAltDate(e.target.value)}
                        className="w-full rounded-lg px-4 py-3 text-sm outline-none focus:ring-1 focus:ring-[#B68A3A]"
                        style={{ ...inputStyle, colorScheme: "dark" }}
                      />
                    </FormField>
                    <FormField label="Preferowana godzina">
                      <div className="relative">
                        <select
                          className="w-full rounded-lg px-4 py-3 text-sm outline-none appearance-none focus:ring-1 focus:ring-[#B68A3A]"
                          style={{ ...inputStyle, cursor: "pointer" }}
                        >
                          <option value="" style={{ backgroundColor: "#182522", color: "#F3EFEA" }}>Wybierz</option>
                          <option style={{ backgroundColor: "#182522", color: "#F3EFEA" }}>Lunch (12:00–16:00)</option>
                          <option style={{ backgroundColor: "#182522", color: "#F3EFEA" }}>Kolacja (18:00–22:00)</option>
                          <option style={{ backgroundColor: "#182522", color: "#F3EFEA" }}>Wieczór (20:00–00:00)</option>
                          <option style={{ backgroundColor: "#182522", color: "#F3EFEA" }}>Cały dzień</option>
                        </select>
                        <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" color="rgba(243,239,234,0.4)" />
                      </div>
                    </FormField>
                  </div>

                  {/* message */}
                  <FormField label="Wiadomość">
                    <textarea
                      placeholder="Opisz swoje wydarzenie — motyw przewodni, wymagania dietetyczne, specjalne życzenia…"
                      rows={4}
                      className="w-full rounded-lg px-4 py-3 text-sm outline-none focus:ring-1 focus:ring-[#B68A3A]"
                      style={inputStyle}
                    />
                  </FormField>

                  {/* GDPR */}
                  <label className="flex items-start gap-3 cursor-pointer">
                    <button
                      type="button"
                      onClick={() => setGdpr(!gdpr)}
                      className="w-5 h-5 mt-0.5 rounded flex items-center justify-center shrink-0 transition-all"
                      style={{
                        border: gdpr ? "none" : "1.5px solid rgba(243, 239, 234, 0.3)",
                        backgroundColor: gdpr ? "#B68A3A" : "transparent",
                      }}
                    >
                      {gdpr && <Check size={13} color="#1E1A16" strokeWidth={3} />}
                    </button>
                    <span className="text-xs leading-relaxed" style={{ color: "rgba(243, 239, 234, 0.5)" }}>
                      Wyrażam zgodę na przetwarzanie moich danych osobowych zgodnie z{" "}
                      <a href="#" className="underline hover:text-[#B68A3A] transition-colors">Polityką prywatności</a>.
                      Dane są wykorzystywane wyłącznie do odpowiedzi na to zapytanie. *
                    </span>
                  </label>

                  {/* error */}
                  {formError && (
                    <p className="text-xs text-center py-2 rounded-lg" style={{ backgroundColor: "rgba(166, 77, 77, 0.15)", color: "#E88A8A" }}>
                      {formError}
                    </p>
                  )}

                  {/* submit */}
                  <button
                    onClick={handleSubmit}
                    className="w-full px-6 py-3.5 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
                    style={{
                      fontFamily: "Inter, sans-serif", fontWeight: 500, letterSpacing: "0.08em", fontSize: "13px",
                      backgroundColor: "#B68A3A", color: "#1E1A16", boxShadow: "0 8px 24px rgba(182, 138, 58, 0.3)",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 30px rgba(182, 138, 58, 0.4)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(182, 138, 58, 0.3)"; }}
                  >
                    <Send size={14} /> WYŚLIJ ZAPYTANIE
                  </button>

                  <p className="text-xs text-center" style={{ color: "rgba(243, 239, 234, 0.4)" }}>
                    Nasz Menadżer Wydarzeń odpowiada w ciągu 4 godzin roboczych. Brak zobowiązań.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="h-px w-full" style={{ backgroundColor: "rgba(182,138,58,0.15)" }} />

      {/* ══════════════════════════════════════════════
          7. GALERIA WYDARZEŃ
          ══════════════════════════════════════════════ */}
      <section className="px-6 md:px-12 py-20 md:py-28">
        <div className="max-w-6xl mx-auto">
          <SectionHeader title="Galeria wydarzeń" />

          <CoverflowGallery
            images={GALLERY.map((g) => ({ id: g.id, src: g.img, alt: g.label }))}
            onImageClick={(idx) => setLightboxIdx(idx)}
          />
        </div>
      </section>

      <div className="h-px w-full" style={{ backgroundColor: "rgba(182,138,58,0.15)" }} />

      {/* ══════════════════════════════════════════════
          8. FAQ
          ══════════════════════════════════════════════ */}
      <section className="px-6 md:px-12 py-20 md:py-28">
        <div className="max-w-3xl mx-auto">
          <SectionHeader title="Najczęściej zadawane pytania" />
          <Accordion type="single" collapsible className="space-y-3">
            {FAQS.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`faq-${i}`}
                className="rounded-xl px-6 border-none"
                style={{ backgroundColor: "#182522", border: "1px solid rgba(243, 239, 234, 0.06)" }}
              >
                <AccordionTrigger
                  className="text-sm font-medium hover:no-underline py-5"
                  style={{ color: "#F3EFEA" }}
                >
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed" style={{ color: "rgba(243, 239, 234, 0.6)" }}>
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <div className="h-px w-full" style={{ backgroundColor: "rgba(182,138,58,0.15)" }} />

      {/* ══════════════════════════════════════════════
          9. LOGISTICS STRIP — transport, accessibility, parking
          ══════════════════════════════════════════════ */}
      <section className="px-6 md:px-12 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Car, label: "Parking", detail: "Valet dostępny. Publiczny parking 50m (ul. Foksal)." },
              { icon: Accessibility, label: "Dostępność", detail: "Parter w pełni dostępny. Toalety dla osób na wózkach inwalidzkich." },
              { icon: Monitor, label: "AV i technologia", detail: "Projektor, ekrany, mikrofony, szybkie Wi-Fi." },
              { icon: Clock, label: "Czas trwania", detail: "Standardowe okno 4h. Nadgodziny: 2 500 PLN/h." },
            ].map((item) => (
              <div key={item.label} className="text-center">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center mx-auto mb-3" style={{ backgroundColor: "rgba(182, 138, 58, 0.12)" }}>
                  <item.icon size={18} color="#B68A3A" />
                </div>
                <h4 className="text-sm font-medium mb-1" style={{ color: "#F3EFEA" }}>{item.label}</h4>
                <p className="text-xs leading-relaxed" style={{ color: "rgba(243, 239, 234, 0.5)" }}>{item.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          10. FOOTER — address, map, social, legal
          ══════════════════════════════════════════════ */}
      <footer className="px-6 md:px-12 pt-20 pb-10" style={{ borderTop: "1px solid rgba(182, 138, 58, 0.15)" }}>
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            {/* col 1 — brand + map embed */}
            <div>
              <h3
                className="text-2xl mb-4"
                style={{ fontFamily: "Cormorant Garamond, serif", fontWeight: 300, color: "#F3EFEA" }}
              >
                La Maison Dorée
              </h3>
              <div className="flex items-start gap-2 mb-4">
                <MapPin size={16} color="#B68A3A" className="mt-0.5 shrink-0" />
                <p className="text-sm" style={{ color: "rgba(243, 239, 234, 0.7)", lineHeight: 1.6 }}>
                  ul. Nowy Świat 42<br />
                  00-363 Warszawa, Poland
                </p>
              </div>
              {/* map placeholder */}
              <div
                className="w-full h-40 rounded-xl overflow-hidden"
                style={{ border: "1px solid rgba(243, 239, 234, 0.08)" }}
              >
                <iframe
                  title="Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2443.7!2d21.0222!3d52.2297!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNTLCsDEzJzQ3LjAiTiAyMcKwMDEnMjAuMCJF!5e0!3m2!1sen!2spl!4v1"
                  className="w-full h-full border-0 grayscale opacity-70"
                  loading="lazy"
                  allowFullScreen
                />
              </div>
            </div>

            {/* col 2 — navigation */}
            <div>
              <h4 className="text-xs uppercase tracking-wider mb-5" style={{ color: "#B68A3A", letterSpacing: "0.1em" }}>Nawigacja</h4>
              <ul className="space-y-3">
                {[
                  { label: "Strona główna", action: () => navigate("/") },
                  { label: "Menu", action: () => navigate("/") },
                  { label: "Zarezerwuj stolik", action: () => navigate("/reserve") },
                  { label: "Prywatne wydarzenia", action: () => window.scrollTo({ top: 0, behavior: "smooth" }) },
                ].map((l) => (
                  <li key={l.label}>
                    <button onClick={l.action} className="text-sm hover:text-[#B68A3A] transition-colors" style={{ color: "rgba(243, 239, 234, 0.7)" }}>
                      {l.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* col 3 — contact */}
            <div>
              <h4 className="text-xs uppercase tracking-wider mb-5" style={{ color: "#B68A3A", letterSpacing: "0.1em" }}>Kontakt</h4>
              <ul className="space-y-3 text-sm" style={{ color: "rgba(243, 239, 234, 0.7)" }}>
                <li className="flex items-center gap-2"><Phone size={14} color="#B68A3A" /> <a href="tel:+48223456789" className="hover:text-[#B68A3A] transition-colors">+48 22 345 67 89</a></li>
                <li className="flex items-center gap-2"><Mail size={14} color="#B68A3A" /> <a href="mailto:wydarzenia@lamaisondoree.pl" className="hover:text-[#B68A3A] transition-colors">wydarzenia@lamaisondoree.pl</a></li>
                <li className="flex items-center gap-2"><CreditCard size={14} color="#B68A3A" /> 30% zaliczki do potwierdzenia</li>
              </ul>
              <div className="mt-6">
                <h4 className="text-xs uppercase tracking-wider mb-3" style={{ color: "#B68A3A", letterSpacing: "0.1em" }}>Godziny otwarcia</h4>
                <p className="text-sm" style={{ color: "rgba(243, 239, 234, 0.7)", lineHeight: 1.7 }}>
                  Wtorek – Sobota: 12:00 – 23:00<br />
                  Niedziela: 12:00 – 21:00<br />
                  Poniedziałek: Nieczynne
                </p>
              </div>
            </div>
          </div>

          <div className="h-px w-full mb-8" style={{ backgroundColor: "rgba(182, 138, 58, 0.15)" }} />

          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs" style={{ color: "rgba(243, 239, 234, 0.4)" }}>
              © {new Date().getFullYear()} La Maison Dorée. Wszelkie prawa zastrzeżone.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-xs hover:text-[#B68A3A] transition-colors" style={{ color: "rgba(243, 239, 234, 0.4)" }}>Polityka prywatności</a>
              <a href="#" className="text-xs hover:text-[#B68A3A] transition-colors" style={{ color: "rgba(243, 239, 234, 0.4)" }}>Warunki usługi</a>
              <a href="#" className="text-xs hover:text-[#B68A3A] transition-colors" style={{ color: "rgba(243, 239, 234, 0.4)" }}>Dostępność</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   SUB-COMPONENTS
   ═══════════════════════════════════════════════════════ */

function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="text-center mb-12 md:mb-16">
      <h2 className="text-3xl md:text-5xl" style={{ fontFamily: "Cormorant Garamond, serif", fontWeight: 300, letterSpacing: "0.03em", color: "#F3EFEA" }}>
        {title}
      </h2>
      {subtitle && (
        <p className="mt-3 text-sm" style={{ color: "rgba(243, 239, 234, 0.5)" }}>{subtitle}</p>
      )}
      <div className="h-px w-16 mx-auto mt-4" style={{ backgroundColor: "#B68A3A", opacity: 0.5 }} />
    </div>
  );
}

function PriceLine({ label, price }: { label: string; price: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span style={{ color: "rgba(243, 239, 234, 0.7)" }}>{label}</span>
      <span style={{ color: "#B68A3A" }}>{price}</span>
    </div>
  );
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs uppercase tracking-wider mb-2 block" style={{ color: "rgba(243, 239, 234, 0.5)", letterSpacing: "0.1em" }}>
        {label}
      </label>
      {children}
    </div>
  );
}
