import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router";
import {
  MapPin,
  Clock,
  Star,
  Phone,
  ExternalLink,
  Leaf,
  Wine,
  Users,
  Sparkles,
  Utensils,
  Award,
  Quote,
  ArrowRight,
  X,
  ChevronLeft,
  ChevronRight,
  Mail,
  CalendarDays,
  Heart,
  Send,
  GlassWater,
  Flame,
  Mouse,
  ChevronDown,
} from "lucide-react";
import { Navigation } from "../components/navigation";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { CoverflowGallery } from "../components/coverflow-gallery";

/* ═══════════════════════════════════════════════════════
   DESIGN TOKENS
   ═══════════════════════════════════════════════════════ */
const C = {
  gold: "#B68A3A",
  cream: "#F3EFEA",
  dark: "#0E1714",
  card: "#182522",
  serif: "Cormorant Garamond, serif",
  sans: "Inter, sans-serif",
};

/* ═══════════════════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════════════════ */

const MENU_HIGHLIGHTS = [
  { id: 1, name: "Risotto truflowe", description: "Ryż carnaroli, wiórki czarnej trufli, dojrzały parmezan, redukcja białego wina", price: "158 zł", tag: "Wybór szefa kuchni" },
  { id: 2, name: "Sola meunière", description: "Sola smażona na brązowym maśle, kapary, warzywa sezonowe", price: "218 zł", tag: null },
  { id: 3, name: "Polędwica wołowa wagyu", description: "Japonskie wagyu A5, purée ziemniaczane, leśne grzyby, jus z czerwonego wina", price: "328 zł", tag: "Sezonowe" },
  { id: 4, name: "Homar Thermidor", description: "Homar z Maine, krem konjakowy, gruyère gratinée, masło ziołowe", price: "268 zł", tag: null },
  { id: 5, name: "Kaczka confit", description: "Wolno pieczona kacza noga, gastrique wiśniowe, pieczone warzywa korzeniowe", price: "178 zł", tag: null },
  { id: 6, name: "Suflet czekoladowy", description: "Ciemna czekolada Valrhona, crème anglaise, złoty listek", price: "78 zł", tag: "Wybór szefa kuchni" },
];

const TASTING_MENU = {
  title: "Wiosenne menu degustacyjne 2026",
  subtitle: "Siedmiodaniowa podróż przez Prowansję",
  price: "498 zł na osobę",
  pairing: "Dobór win +268 zł",
  courses: [
    "Amuse-bouche · Chłodne velouté z groszku, crème fraîche, mikrozioła",
    "Przystawka · Smażone foie gras, konfitura figowa, grzanka brioche",
    "Ryba · Dzikowiec złowiony na wędkę, beurre blanc szafranowe, koper włoski",
    "Sorbet · Intermezzo szampanowo-bzowe",
    "Danie główne · Comber jagnięcy, skórka pistacjowa, ratatouille, jus",
    "Sery · Wybór trzech dojrzałych serów francuskich, plaster miodu",
    "Deser · Fondant czekoladowy Valrhona, solony karmel, złoty listek",
  ],
};

const EXPERIENCE_CARDS = [
  { icon: Leaf, title: "Sezonowe składniki", text: "Nasze menu zmienia się wraz z porami roku. Każdy składnik pochodzi z zaufanych farm w całej Francji — zbierany w szczytowej dojrzałości, nigdy nie transportowany drogą lotniczą." },
  { icon: Wine, title: "Dobór win przez sommeliera", text: "Nasz sommelier tworzy unikalną podróż winną dla każdego menu degustacyjnego — od Burgundii po Rodan — lub wybierz spośród ponad 400 etykiet." },
  { icon: Users, title: "Spokojne tempo obsługi", text: "Dostosowujemy tempo każdego dania do rytmu Twojego wieczoru. Nasz zespół wyczuwa potrzeby bez narzucania się — niewidoczny, a zawsze obecny." },
  { icon: Sparkles, title: "Kameralna atmosfera", text: "Miękkie kandlebarów, akcenty Art Deco i nie więcej niż 40 gości każdego wieczoru. Każdy stolik czuje się, jakby był zaprojektowany specjalnie dla Ciebie." },
];

const REVIEWS = [
  { id: 1, name: "Sophie Laurent", role: "Google Review", rating: 5, text: "Niezwykłe doświadczenie kulinarne. Każde danie było arcydziełem, a atmosfera po prostu magiczna. Risotto truflowe jest absolutnie boskie." },
  { id: 2, name: "James Richardson", role: "TripAdvisor", rating: 5, text: "Nienaganna obsługa, wyśmienita kuchnia i kameralna atmosfera. To fine dining w najczystszej postaci. Na pewno wrócimy." },
  { id: 3, name: "Marie Dubois", role: "Le Figaro Reader", rating: 5, text: "Ukryty klejnot Warszawy. Dbałość o szczegóły jest niezwykła — od doboru win po prezentację każdego dania. Gorąco polecam." },
];

const PRESS = [
  { name: "Michelin Guide", quote: "Wschodzące słońce warszawskiej sceny gastronomicznej." },
  { name: "Le Figaro", quote: "Elegancja, kameralność, niezapomniany wieczór." },
  { name: "Gault & Millau", quote: "Jeden z najbardziej ekscytujących stołów w 6. dzielnicy." },
  { name: "Condé Nast Traveler", quote: "Obowiązkowy punkt dla każdego miłośnika dobrego jedzenia w Warszawie." },
];

const GALLERY_IMAGES = [
  { id: 1, src: "https://images.unsplash.com/photo-1414235077428-338fc7c4d16f?w=800&q=80", alt: "Risotto truflowe" },
  { id: 2, src: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80", alt: "Elegancka sala jadalna" },
  { id: 3, src: "https://images.unsplash.com/photo-1615937657715-bc7b4b7962c1?w=800&q=80", alt: "Wykwintna kuchnia francuska" },
  { id: 4, src: "https://images.unsplash.com/photo-1510812431401-ae7d6f7c2f39?w=800&q=80", alt: "Wybór z piwnicy winnej" },
  { id: 5, src: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80", alt: "Nakrycie stołu" },
  { id: 6, src: "https://images.unsplash.com/photo-1551024601-5c3a469c4b2a?w=800&q=80", alt: "Sztuka deserów" },
  { id: 7, src: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80", alt: "Bar i lounge" },
  { id: 8, src: "https://images.unsplash.com/photo-1600891964092-4316c288032e?w=800&q=80", alt: "Przygotowanie polędwicy wagyu" },
];

const HERO_SLIDES = [
  "https://images.unsplash.com/photo-1414235077428-338fc7c4d16f?w=1600&q=80",
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1600&q=80",
  "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=1600&q=80",
  "https://images.unsplash.com/photo-1600891964092-4316c288032e?w=1600&q=80",
];

const RESERVATION_STEPS = [
  { step: "01", title: "Wybierz datę", text: "Wybierz wieczór, który Ci odpowiada. Przyjmujemy rezerwacje z wyprzedzeniem do 60 dni." },
  { step: "02", title: "Wybierz stolik", text: "Przeglądaj nasz interaktywny plan sali i wybierz dokładny stolik — przy oknie, w rogu lub pośrodku." },
  { step: "03", title: "Przyjedź i ciesz się", text: "Twój stolik będzie gotowy. Nasz zespół wita Cię po imieniu, przedstawia menu wieczoru i podróż się rozpoczyna." },
];

/* ═══════════════════════════════════════════════════════
   HELPER COMPONENTS
   ═══════════════════════════════════════════════════════ */

function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="text-center mb-16 md:mb-20">
      <h2
        className="text-4xl md:text-5xl mb-4"
        style={{ fontFamily: C.serif, fontWeight: 300, letterSpacing: "0.03em", color: C.cream }}
      >
        {title}
      </h2>
      <div className="h-px w-16 mx-auto mb-4" style={{ backgroundColor: C.gold, opacity: 0.5 }} />
      {subtitle && (
        <p
          className="text-base max-w-2xl mx-auto leading-relaxed mt-4"
          style={{ fontFamily: C.sans, fontWeight: 300, color: "rgba(243,239,234,0.6)" }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}

function GoldButton({
  children,
  onClick,
  variant = "solid",
  className = "",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "solid" | "outline";
  className?: string;
}) {
  const isSolid = variant === "solid";
  return (
    <button
      onClick={onClick}
      className={`px-10 py-4 rounded-lg transition-all duration-300 ${className}`}
      style={{
        fontFamily: C.sans,
        fontWeight: 500,
        letterSpacing: "0.05em",
        fontSize: "14px",
        backgroundColor: isSolid ? C.gold : "rgba(182,138,58,0.1)",
        color: isSolid ? "#1E1A16" : C.gold,
        border: isSolid ? "none" : "1px solid rgba(182,138,58,0.3)",
        boxShadow: isSolid ? "0 8px 32px rgba(182,138,58,0.3)" : "none",
      }}
      onMouseEnter={(e) => {
        if (isSolid) {
          e.currentTarget.style.transform = "translateY(-2px) scale(1.02)";
          e.currentTarget.style.boxShadow = "0 12px 40px rgba(182,138,58,0.4)";
        } else {
          e.currentTarget.style.backgroundColor = "rgba(182,138,58,0.15)";
          e.currentTarget.style.borderColor = "rgba(182,138,58,0.4)";
        }
      }}
      onMouseLeave={(e) => {
        if (isSolid) {
          e.currentTarget.style.transform = "translateY(0) scale(1)";
          e.currentTarget.style.boxShadow = "0 8px 32px rgba(182,138,58,0.3)";
        } else {
          e.currentTarget.style.backgroundColor = "rgba(182,138,58,0.1)";
          e.currentTarget.style.borderColor = "rgba(182,138,58,0.3)";
        }
      }}
    >
      {children}
    </button>
  );
}

/* ═══════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════ */

export function LandingPage() {
  const navigate = useNavigate();

  /* ── lightbox ── */
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  const closeLightbox = useCallback(() => setLightboxIdx(null), []);
  const prevImage = useCallback(
    () => setLightboxIdx((i) => (i !== null ? (i - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length : null)),
    [],
  );
  const nextImage = useCallback(
    () => setLightboxIdx((i) => (i !== null ? (i + 1) % GALLERY_IMAGES.length : null)),
    [],
  );

  useEffect(() => {
    if (lightboxIdx === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") prevImage();
      if (e.key === "ArrowRight") nextImage();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightboxIdx, closeLightbox, prevImage, nextImage]);

  /* ── sticky bar ── */
  const [showSticky, setShowSticky] = useState(false);
  useEffect(() => {
    const onScroll = () => setShowSticky(window.scrollY > 600);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ── newsletter ── */
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);

  /* ── hero slideshow ── */
  const [heroSlide, setHeroSlide] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setHeroSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  /* ── hero entrance animation ── */
  const [heroLoaded, setHeroLoaded] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setHeroLoaded(true), 150);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className="min-h-screen"
      style={{
        background: "radial-gradient(ellipse at center, #1a2820 0%, #0E1714 100%)",
        backgroundAttachment: "fixed",
      }}
    >
      <Navigation />

      {/* ═══════════════════════ 1. HERO ═══════════════════════ */}
      <div className="relative min-h-screen flex flex-col items-center justify-center px-6 md:px-12">
        {/* Background slideshow */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          {HERO_SLIDES.map((src, i) => (
            <img
              key={i}
              src={src}
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
              style={{
                filter: "brightness(0.25)",
                opacity: heroSlide === i ? 1 : 0,
                transform: heroSlide === i ? "scale(1.05)" : "scale(1)",
                transition: "opacity 1.5s ease-in-out, transform 6s ease-out",
              }}
            />
          ))}
          <div
            className="absolute inset-0"
            style={{ background: "radial-gradient(ellipse at center, rgba(26,40,32,0.5) 0%, rgba(14,23,20,0.85) 100%)" }}
          />
        </div>

        <div className="relative z-10 max-w-4xl w-full text-center py-32 md:py-40">
          {/* Animated decorative line */}
          <div
            className="h-px mx-auto mb-10"
            style={{
              backgroundColor: C.gold,
              opacity: heroLoaded ? 0.6 : 0,
              width: heroLoaded ? "96px" : "0px",
              transition: "all 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
            }}
          />

          {/* Tagline */}
          <p
            className="text-sm uppercase tracking-[0.25em] mb-8"
            style={{
              fontFamily: C.sans,
              fontWeight: 400,
              color: C.gold,
              opacity: heroLoaded ? 1 : 0,
              transform: heroLoaded ? "translateY(0)" : "translateY(20px)",
              transition: "all 0.8s ease-out 0.3s",
            }}
          >
            Zał. 2018 · Warszawa, Polska
          </p>

          {/* Main title */}
          <h1
            className="text-5xl md:text-7xl lg:text-8xl tracking-wide mb-8"
            style={{
              fontFamily: C.serif,
              fontWeight: 300,
              letterSpacing: "0.05em",
              color: C.cream,
              opacity: heroLoaded ? 1 : 0,
              transform: heroLoaded ? "translateY(0)" : "translateY(30px)",
              transition: "all 1s ease-out 0.5s",
            }}
          >
            La Maison Dorée
          </h1>

          {/* Description */}
          <p
            className="text-base md:text-lg max-w-2xl mx-auto leading-relaxed mb-10"
            style={{
              fontFamily: C.sans,
              fontWeight: 300,
              color: "rgba(243,239,234,0.75)",
              opacity: heroLoaded ? 1 : 0,
              transform: heroLoaded ? "translateY(0)" : "translateY(20px)",
              transition: "all 0.8s ease-out 0.8s",
            }}
          >
            Współczesna kuchnia francuska w kameralnej oprawie. Celebracja
            wyrafinowanych smaków, sezonowych składników i sztuki fine dining.
          </p>

          {/* CTA Buttons */}
          <div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
            style={{
              opacity: heroLoaded ? 1 : 0,
              transform: heroLoaded ? "translateY(0)" : "translateY(20px)",
              transition: "all 0.8s ease-out 1s",
            }}
          >
            <GoldButton onClick={() => navigate("/reserve")}>ZAREZERWUJ STOLIK</GoldButton>
            <GoldButton
              variant="outline"
              onClick={() => document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" })}
            >
              ODKRYJ MENU
            </GoldButton>
          </div>

          {/* Decorative line */}
          <div
            className="h-px mx-auto mb-10"
            style={{
              backgroundColor: C.gold,
              opacity: heroLoaded ? 0.6 : 0,
              width: heroLoaded ? "96px" : "0px",
              transition: "all 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) 1.3s",
            }}
          />

          {/* Press / Featured by */}
          <div
            className="mb-12"
            style={{
              opacity: heroLoaded ? 1 : 0,
              transform: heroLoaded ? "translateY(0)" : "translateY(15px)",
              transition: "all 0.8s ease-out 1.4s",
            }}
          >
            <p
              className="text-sm uppercase tracking-[0.3em] mb-8"
              style={{ fontFamily: C.sans, fontWeight: 600, color: "rgba(182,138,58,0.8)" }}
            >
              Polecany przez
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 w-full max-w-5xl mx-auto">
              {PRESS.map((p, i) => (
                <div key={i} className="text-center px-2">
                  <h4
                    className="text-xl"
                    style={{ fontFamily: C.serif, fontWeight: 600, color: "rgba(243,239,234,0.85)" }}
                  >
                    {p.name}
                  </h4>
                  <p
                    className="text-sm italic mt-2 leading-relaxed"
                    style={{ fontFamily: C.serif, fontWeight: 300, color: "rgba(243,239,234,0.45)" }}
                  >
                    "{p.quote}"
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Scroll indicator */}
          <div
            className="flex flex-col items-center gap-2 cursor-pointer group"
            onClick={() => document.getElementById("story")?.scrollIntoView({ behavior: "smooth" })}
            style={{
              opacity: heroLoaded ? 0.5 : 0,
              transition: "opacity 0.8s ease-out 1.6s",
            }}
          >
            <div
              className="w-6 h-10 rounded-full flex items-start justify-center pt-2"
              style={{ border: "1.5px solid rgba(243,239,234,0.4)" }}
            >
              <div
                className="w-1 h-2 rounded-full"
                style={{
                  backgroundColor: C.cream,
                  animation: "scrollDot 2s ease-in-out infinite",
                }}
              />
            </div>
            <span
              className="text-[10px] uppercase tracking-[0.2em]"
              style={{ fontFamily: C.sans, fontWeight: 400, color: "rgba(243,239,234,0.4)" }}
            >
              Przewiń
            </span>
          </div>
        </div>

        {/* Slide indicators */}
        <div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex gap-2"
          style={{
            opacity: heroLoaded ? 0.6 : 0,
            transition: "opacity 0.8s ease-out 1.8s",
          }}
        >
          {HERO_SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setHeroSlide(i)}
              className="rounded-full transition-all duration-500"
              style={{
                width: heroSlide === i ? "24px" : "6px",
                height: "6px",
                backgroundColor: heroSlide === i ? C.gold : "rgba(243,239,234,0.3)",
              }}
            />
          ))}
        </div>
      </div>

      {/* Keyframe for scroll dot */}
      <style>{`
        @keyframes scrollDot {
          0%, 100% { opacity: 1; transform: translateY(0); }
          50% { opacity: 0.3; transform: translateY(8px); }
        }
      `}</style>

      <div className="h-px w-full" style={{ backgroundColor: "rgba(182,138,58,0.15)" }} />

      {/* ═══════════════════════ 2. BRAND STORY ═══════════════════════ */}
      <section id="story" className="px-6 md:px-12 py-24 md:py-32">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image */}
          <div className="rounded-2xl overflow-hidden" style={{ boxShadow: "0 8px 40px rgba(0,0,0,0.4)" }}>
            <img
              src="https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=800&q=80"
              alt="Inside La Maison Dorée"
              className="w-full h-[480px] object-cover"
              loading="lazy"
              style={{ filter: "brightness(0.85)" }}
            />
          </div>

          {/* Copy */}
          <div className="space-y-6">
            <p
              className="text-sm uppercase tracking-[0.2em]"
              style={{ fontFamily: C.sans, fontWeight: 500, color: C.gold }}
            >
              Nasza historia
            </p>
            <h2
              className="text-4xl md:text-5xl leading-tight"
              style={{ fontFamily: C.serif, fontWeight: 300, color: C.cream }}
            >
              Gdzie tradycja spotyka śmiąłość
            </h2>
            <p
              className="text-base leading-relaxed"
              style={{ fontFamily: C.sans, fontWeight: 300, color: "rgba(243,239,234,0.7)", lineHeight: 1.8 }}
            >
              La Maison Dorée powstała z prostego przekonania: że wielka
              restauracja to nie tylko to, co jest na talerzu, ale także historia,
              którą opowiada. Założona w 2018 roku przez Szefa Kuchni Juliena Moreau
              przy ulicy Nowy Świat w Warszawie, łączy dyscyplinę klasycznej francuskiej
              techniki z wolnością nowoczesnej inwencji.
            </p>
            <p
              className="text-base leading-relaxed"
              style={{ fontFamily: C.sans, fontWeight: 300, color: "rgba(243,239,234,0.7)", lineHeight: 1.8 }}
            >
              Każdego wieczoru przyjmujemy nie więcej niż czterdzieścioro gości
              w przestrzeni inspirowanej paryskimi salonami lat 20. XX wieku —
              kameralnej, spokojnej i zaprojektowanej tak, abyś zapomniał o mieście
              na zewnątrz. Nasza filozofia opiera się na sezonowości, szacunku dla
              składników i przekonaniu, że gościnność jest formą sztuki.
            </p>
            <blockquote
              className="border-l-2 pl-6 py-2 mt-4"
              style={{ borderColor: C.gold }}
            >
              <p
                className="text-lg italic"
                style={{ fontFamily: C.serif, fontWeight: 400, color: "rgba(243,239,234,0.85)" }}
              >
                "Gotowanie to pamięć. Każde danie, które podaję, nosi w sobie
                miejsce, osobę, chwilę, której nigdy nie chcę zapomnieć."
              </p>
              <cite
                className="text-sm not-italic block mt-3"
                style={{ fontFamily: C.sans, fontWeight: 500, color: C.gold }}
              >
                — Chef Julien Moreau
              </cite>
            </blockquote>
          </div>
        </div>
      </section>

      {/* ═══════════════════════ 3. CHEF INTRODUCTION ═══════════════════════ */}
      <section
        className="px-6 md:px-12 py-24 md:py-32"
        style={{ borderTop: "1px solid rgba(182,138,58,0.1)" }}
      >
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Copy (left on desktop) */}
          <div className="space-y-6 order-2 lg:order-1">
            <p
              className="text-sm uppercase tracking-[0.2em]"
              style={{ fontFamily: C.sans, fontWeight: 500, color: C.gold }}
            >
              Szef kuchni
            </p>
            <h2
              className="text-4xl md:text-5xl leading-tight"
              style={{ fontFamily: C.serif, fontWeight: 300, color: C.cream }}
            >
              Julien Moreau
            </h2>
            <p
              className="text-base leading-relaxed"
              style={{ fontFamily: C.sans, fontWeight: 300, color: "rgba(243,239,234,0.7)", lineHeight: 1.8 }}
            >
              Urodzony w Lyonie, szkolony pod okiem Alaina Ducasse'a i Anne-Sophie Pic,
              Julien Moreau spędził dekadę w restauracjach z gwiazdkami Michelin w Paryżu,
              Tokio i Kopenhadze, zanim w wieku 34 lat otworzył La Maison Dorée.
            </p>
            <p
              className="text-base leading-relaxed"
              style={{ fontFamily: C.sans, fontWeight: 300, color: "rgba(243,239,234,0.7)", lineHeight: 1.8 }}
            >
              Jego kuchnia zakorzeniona jest w kanonie francuskim, ale kształtowana
              przez niespokojną ciekawość — japońska precyzja, nordycki minimalizm
              i filozofia farm-to-table odnajdują drogę na talerzu. Julien
              osobiście wybiera produkty od małych hodowców z Prowansji, Bretanii
              i Doliny Loary każdego tygodnia.
            </p>

            {/* Accolades */}
            <div className="flex flex-wrap gap-4 pt-4">
              {[
                "Michelin ★ 2021",
                "Gault & Millau 16/20",
                "Najlepszy nowy szef — Le Figaro 2019",
              ].map((badge) => (
                <span
                  key={badge}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs uppercase tracking-wider"
                  style={{
                    fontFamily: C.sans,
                    fontWeight: 500,
                    color: C.gold,
                    backgroundColor: "rgba(182,138,58,0.1)",
                    border: "1px solid rgba(182,138,58,0.25)",
                  }}
                >
                  <Award size={14} />
                  {badge}
                </span>
              ))}
            </div>
          </div>

          {/* Photo */}
          <div className="order-1 lg:order-2 rounded-2xl overflow-hidden" style={{ boxShadow: "0 8px 40px rgba(0,0,0,0.4)" }}>
            <img
              src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=800&q=80"
              alt="Chef Julien Moreau in the kitchen"
              className="w-full h-[520px] object-cover"
              loading="lazy"
              style={{ filter: "brightness(0.85)" }}
            />
          </div>
        </div>
      </section>

      <div className="h-px w-full" style={{ backgroundColor: "rgba(182,138,58,0.15)" }} />

      {/* ═══════════════════════ 4. DINING EXPERIENCE ═══════════════════════ */}
      <section className="px-6 md:px-12 py-24 md:py-32">
        <div className="max-w-6xl mx-auto">
          <SectionHeader
            title="Doświadczenie"
            subtitle="Fine dining w La Maison Dorée to więcej niż posiłek — to wieczór skomponowany tak, by poruszać wszystkie zmysły."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {EXPERIENCE_CARDS.map((card, i) => {
              const Icon = card.icon;
              return (
                <div
                  key={i}
                  className="rounded-2xl p-8 text-center transition-transform duration-300 hover:-translate-y-1"
                  style={{
                    backgroundColor: C.card,
                    border: "1px solid rgba(243,239,234,0.05)",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
                  }}
                >
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-5"
                    style={{ backgroundColor: "rgba(182,138,58,0.12)", border: "1px solid rgba(182,138,58,0.25)" }}
                  >
                    <Icon size={24} style={{ color: C.gold }} />
                  </div>
                  <h3
                    className="text-xl mb-3"
                    style={{ fontFamily: C.serif, fontWeight: 500, color: C.cream }}
                  >
                    {card.title}
                  </h3>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ fontFamily: C.sans, fontWeight: 300, color: "rgba(243,239,234,0.6)", lineHeight: 1.7 }}
                  >
                    {card.text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════ 5. SEASONAL TASTING MENU ═══════════════════════ */}
      <section
        id="tasting"
        className="px-6 md:px-12 py-24 md:py-32"
        style={{ borderTop: "1px solid rgba(182,138,58,0.1)" }}
      >
        <div className="max-w-5xl mx-auto">
          <SectionHeader title="Sezonowe menu degustacyjne" />

          <div
            className="rounded-2xl p-10 md:p-14"
            style={{
              backgroundColor: C.card,
              border: "1px solid rgba(182,138,58,0.15)",
              boxShadow: "0 12px 48px rgba(0,0,0,0.35)",
            }}
          >
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-10">
              <div>
                <h3
                  className="text-3xl md:text-4xl mb-2"
                  style={{ fontFamily: C.serif, fontWeight: 400, color: C.cream }}
                >
                  {TASTING_MENU.title}
                </h3>
                <p
                  className="text-base italic"
                  style={{ fontFamily: C.serif, fontWeight: 300, color: "rgba(243,239,234,0.6)" }}
                >
                  {TASTING_MENU.subtitle}
                </p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-2xl" style={{ fontFamily: C.sans, fontWeight: 600, color: C.gold }}>
                  {TASTING_MENU.price}
                </p>
                <p className="text-sm mt-1" style={{ fontFamily: C.sans, fontWeight: 300, color: "rgba(243,239,234,0.5)" }}>
                  {TASTING_MENU.pairing}
                </p>
              </div>
            </div>

            <div className="h-px w-full mb-8" style={{ backgroundColor: "rgba(182,138,58,0.15)" }} />

            <ol className="space-y-4">
              {TASTING_MENU.courses.map((course, i) => (
                <li key={i} className="flex items-start gap-4">
                  <span
                    className="text-xs font-semibold mt-1 w-6 h-6 flex items-center justify-center rounded-full flex-shrink-0"
                    style={{ backgroundColor: "rgba(182,138,58,0.12)", color: C.gold, fontFamily: C.sans }}
                  >
                    {i + 1}
                  </span>
                  <p
                    className="text-base leading-relaxed"
                    style={{ fontFamily: C.sans, fontWeight: 300, color: "rgba(243,239,234,0.75)" }}
                  >
                    {course}
                  </p>
                </li>
              ))}
            </ol>

            <div className="flex flex-col sm:flex-row gap-4 mt-10">
              <GoldButton onClick={() => navigate("/reserve")}>ZAREZERWUJ NA MENU DEGUSTACYJNE</GoldButton>
              <GoldButton variant="outline" onClick={() => document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" })}>
                ZOBACZ À LA CARTE
              </GoldButton>
            </div>
          </div>
        </div>
      </section>

      <div className="h-px w-full" style={{ backgroundColor: "rgba(182,138,58,0.15)" }} />

      {/* ═══════════════════════ 6. MENU HIGHLIGHTS ═══════════════════════ */}
      <section id="menu" className="px-6 md:px-12 py-24 md:py-32">
        <div className="max-w-6xl mx-auto">
          <SectionHeader title="Wybór dań à la carte" subtitle="Zespół potraw sygnaturowych z naszego aktualnego menu." />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            {MENU_HIGHLIGHTS.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl p-8 transition-transform duration-300 hover:-translate-y-1"
                style={{
                  backgroundColor: C.card,
                  boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
                  border: "1px solid rgba(243,239,234,0.05)",
                }}
              >
                <div className="flex items-start justify-between mb-3">
                  <h3
                    className="text-2xl flex-1"
                    style={{ fontFamily: C.serif, fontWeight: 400, color: C.cream, letterSpacing: "0.02em" }}
                  >
                    {item.name}
                  </h3>
                  <span className="text-xl ml-4" style={{ fontFamily: C.sans, fontWeight: 500, color: C.gold }}>
                    {item.price}
                  </span>
                </div>

                {item.tag && (
                  <div
                    className="inline-block px-3 py-1 rounded-full mb-3"
                    style={{ backgroundColor: "rgba(182,138,58,0.12)", border: "1px solid rgba(182,138,58,0.25)" }}
                  >
                    <span
                      className="text-xs uppercase tracking-wider"
                      style={{ fontFamily: C.sans, fontWeight: 500, color: C.gold, letterSpacing: "0.1em" }}
                    >
                      {item.tag}
                    </span>
                  </div>
                )}

                <p
                  className="text-sm leading-relaxed"
                  style={{ fontFamily: C.sans, fontWeight: 300, color: "rgba(243,239,234,0.6)", lineHeight: 1.7 }}
                >
                  {item.description}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <GoldButton variant="outline" onClick={() => navigate("/menu")}>PEŁNE MENU</GoldButton>
          </div>
        </div>
      </section>

      <div className="h-px w-full" style={{ backgroundColor: "rgba(182,138,58,0.15)" }} />

      {/* ═══════════════════════ 7. GALLERY — coverflow carousel ═══════════════════════ */}
      <section id="gallery" className="px-6 md:px-12 py-24 md:py-32">
        <div className="max-w-6xl mx-auto">
          <SectionHeader title="Galeria" />

          <CoverflowGallery
            images={GALLERY_IMAGES}
            onImageClick={(idx) => setLightboxIdx(idx)}
          />
        </div>
      </section>



      <div className="h-px w-full" style={{ backgroundColor: "rgba(182,138,58,0.15)" }} />

      {/* ═══════════════════════ 9. TESTIMONIALS ═══════════════════════ */}
      <section className="px-6 md:px-12 py-24 md:py-32">
        <div className="max-w-6xl mx-auto">
          <SectionHeader title="Co mówią nasi goście" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {REVIEWS.map((review) => (
              <div
                key={review.id}
                className="rounded-2xl p-8 transition-transform duration-300 hover:-translate-y-1"
                style={{
                  backgroundColor: C.card,
                  boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
                  border: "1px solid rgba(243,239,234,0.05)",
                }}
              >
                <Quote size={28} style={{ color: C.gold, opacity: 0.4 }} className="mb-4" />
                <div className="flex gap-1 mb-4">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} size={16} style={{ fill: C.gold, color: C.gold }} />
                  ))}
                </div>
                <p
                  className="text-base leading-relaxed mb-6"
                  style={{ fontFamily: C.sans, fontWeight: 300, color: "rgba(243,239,234,0.7)", lineHeight: 1.7 }}
                >
                  "{review.text}"
                </p>
                <p className="text-sm" style={{ fontFamily: C.sans, fontWeight: 500, color: C.gold }}>
                  — {review.name}
                </p>
                <p className="text-xs mt-1" style={{ fontFamily: C.sans, fontWeight: 300, color: "rgba(243,239,234,0.45)" }}>
                  {review.role}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="h-px w-full" style={{ backgroundColor: "rgba(182,138,58,0.15)" }} />

      {/* ═══════════════════════ 10. HOW IT WORKS ═══════════════════════ */}
      <section className="px-6 md:px-12 py-24 md:py-32">
        <div className="max-w-5xl mx-auto">
          <SectionHeader
            title="Twój wieczór — uproszczony"
            subtitle="Rezerwacja w La Maison Dorée jest prosta. Trzy kroki do niezapomnianego wieczoru."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {RESERVATION_STEPS.map((s, i) => (
              <div key={i} className="text-center space-y-4 relative">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto"
                  style={{ backgroundColor: "rgba(182,138,58,0.12)", border: "1px solid rgba(182,138,58,0.25)" }}
                >
                  <span className="text-xl" style={{ fontFamily: C.sans, fontWeight: 600, color: C.gold }}>
                    {s.step}
                  </span>
                </div>
                <h3 className="text-xl" style={{ fontFamily: C.serif, fontWeight: 500, color: C.cream }}>
                  {s.title}
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ fontFamily: C.sans, fontWeight: 300, color: "rgba(243,239,234,0.6)", lineHeight: 1.7 }}
                >
                  {s.text}
                </p>
                {i < RESERVATION_STEPS.length - 1 && (
                  <ArrowRight
                    size={20}
                    className="hidden md:block absolute -right-5 top-1/3 -translate-y-1/2"
                    style={{ color: C.gold, opacity: 0.3 }}
                  />
                )}
              </div>
            ))}
          </div>

          <div className="text-center mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
            <GoldButton onClick={() => navigate("/reserve")}>ZAREZERWUJ STOLIK</GoldButton>
            <GoldButton variant="outline" onClick={() => window.location.href = "tel:+48223456789"}>
              ZADZWOŃ +48 22 345 67 89
            </GoldButton>
          </div>
        </div>
      </section>

      <div className="h-px w-full" style={{ backgroundColor: "rgba(182,138,58,0.15)" }} />

      {/* ═══════════════════════ 11. PRIVATE EVENTS TEASER ═══════════════════════ */}
      <section className="px-6 md:px-12 py-24 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=1400&q=80"
            alt=""
            className="w-full h-full object-cover"
            style={{ filter: "brightness(0.2)" }}
          />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(14,23,20,0.9), rgba(14,23,20,0.7))" }} />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <p
              className="text-sm uppercase tracking-[0.2em]"
              style={{ fontFamily: C.sans, fontWeight: 500, color: C.gold }}
            >
              Prywatne wydarzenia
            </p>
            <h2
              className="text-4xl md:text-5xl leading-tight"
              style={{ fontFamily: C.serif, fontWeight: 300, color: C.cream }}
            >
              Wyłącznie dla Ciebie
            </h2>
            <p
              className="text-base leading-relaxed"
              style={{ fontFamily: C.sans, fontWeight: 300, color: "rgba(243,239,234,0.7)", lineHeight: 1.8 }}
            >
              Od kameralnych kolacji biznesowych po pełne wynajem całego lokalu,
              La Maison Dorée oferuje bespoke private dining z dedykowanym Menadżerem
              Wydarzeń, menu tworzonymi przez szefa kuchni i przestrzeniami dla
              nawet 80 gości.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <GoldButton onClick={() => navigate("/private-events")}>ODKRYJ WYDARZENIA PRYWATNE</GoldButton>
              <GoldButton variant="outline" onClick={() => window.location.href = "tel:+48223456789"}>
                ZADZWOŃ DO NAS
              </GoldButton>
            </div>
          </div>

          <div className="hidden md:grid grid-cols-2 gap-4">
            {[
              { label: "Salon prywatny", cap: "Do 20" },
              { label: "Wynajem całości", cap: "Do 80" },
              { label: "AV i technologia", cap: "W cenie" },
              { label: "Menadżer Wydarzeń", cap: "Dedykowany" },
            ].map((item, i) => (
              <div
                key={i}
                className="rounded-xl p-5 text-center"
                style={{
                  backgroundColor: "rgba(24,37,34,0.7)",
                  border: "1px solid rgba(182,138,58,0.15)",
                  backdropFilter: "blur(8px)",
                }}
              >
                <p className="text-lg" style={{ fontFamily: C.sans, fontWeight: 600, color: C.gold }}>
                  {item.cap}
                </p>
                <p className="text-xs uppercase tracking-wider mt-1" style={{ fontFamily: C.sans, fontWeight: 400, color: "rgba(243,239,234,0.5)" }}>
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════ 12. VISIT US ═══════════════════════ */}
      <div className="h-px w-full" style={{ backgroundColor: "rgba(182,138,58,0.15)" }} />

      <section
        id="contact"
        className="px-6 md:px-12 py-24 md:py-32"
      >
        <div className="max-w-6xl mx-auto">
          <SectionHeader title="Odwiedź nas" />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Left — Contact Info */}
            <div className="space-y-8">
              {/* Address */}
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <MapPin size={20} style={{ color: C.gold }} />
                  <h3
                    className="text-sm uppercase tracking-wider"
                    style={{ fontFamily: C.sans, fontWeight: 500, letterSpacing: "0.1em", color: C.gold }}
                  >
                    Lokalizacja
                  </h3>
                </div>
                <p className="text-lg leading-relaxed pl-8" style={{ fontFamily: C.sans, fontWeight: 300, color: C.cream }}>
                  ul. Nowy Świat 42<br />
                  00-363 Warszawa
                </p>
              </div>

              {/* Hours */}
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <Clock size={20} style={{ color: C.gold }} />
                  <h3
                    className="text-sm uppercase tracking-wider"
                    style={{ fontFamily: C.sans, fontWeight: 500, letterSpacing: "0.1em", color: C.gold }}
                  >
                    Godziny otwarcia
                  </h3>
                </div>
                <p className="text-lg leading-relaxed pl-8" style={{ fontFamily: C.sans, fontWeight: 300, color: C.cream }}>
                  Wtorek – Sobota: 18:00 – 22:30<br />
                  Niedziela i poniedziałek: Nieczynne
                </p>
              </div>

              {/* Contact */}
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <Phone size={20} style={{ color: C.gold }} />
                  <h3
                    className="text-sm uppercase tracking-wider"
                    style={{ fontFamily: C.sans, fontWeight: 500, letterSpacing: "0.1em", color: C.gold }}
                  >
                    Kontakt
                  </h3>
                </div>
                <div className="text-lg leading-relaxed pl-8 space-y-1">
                  <p>
                    <a href="tel:+48223456789" className="hover:underline transition-all duration-200" style={{ fontFamily: C.sans, fontWeight: 300, color: C.gold }}>
                      +48 22 345 67 89
                    </a>
                  </p>
                  <p>
                    <a href="mailto:info@lamaisondoree.pl" className="hover:underline transition-all duration-200" style={{ fontFamily: C.sans, fontWeight: 300, color: C.gold }}>
                      info@lamaisondoree.pl
                    </a>
                  </p>
                </div>
              </div>

              {/* Directions */}
              <div className="pt-4">
                <a
                  href="https://www.google.com/maps/search/?api=1&query=ul.+Nowy+%C5%9Awiat+42+00-363+Warszawa"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-8 py-3 rounded-lg transition-all duration-200"
                  style={{
                    fontFamily: C.sans,
                    fontWeight: 500,
                    letterSpacing: "0.08em",
                    fontSize: "14px",
                    backgroundColor: "rgba(182,138,58,0.1)",
                    color: C.gold,
                    border: "1px solid rgba(182,138,58,0.3)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "rgba(182,138,58,0.15)";
                    e.currentTarget.style.borderColor = "rgba(182,138,58,0.4)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "rgba(182,138,58,0.1)";
                    e.currentTarget.style.borderColor = "rgba(182,138,58,0.3)";
                  }}
                >
                  <ExternalLink size={16} />
                  WYZNACZ TRASĘ
                </a>
              </div>
            </div>

            {/* Right — Map */}
            <div
              className="rounded-2xl overflow-hidden relative"
              style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.3)", minHeight: "400px" }}
            >
              <img
                src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80"
                alt="Eleganckie wnętrze restauracji"
                className="w-full h-full object-cover"
                loading="lazy"
                style={{ filter: "brightness(0.6)" }}
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 lg:p-12">
                <MapPin size={64} style={{ color: C.gold, opacity: 0.9 }} className="mb-6" />
                <h3
                  className="text-3xl mb-3"
                  style={{ fontFamily: C.serif, fontWeight: 300, color: C.cream, letterSpacing: "0.02em" }}
                >
                  W sercu Warszawy
                </h3>
                <p
                  className="text-base max-w-md leading-relaxed"
                  style={{ fontFamily: C.sans, fontWeight: 300, color: "rgba(243,239,234,0.9)", lineHeight: 1.7 }}
                >
                  Położone przy eleganckim Nowym Świecie, kilka kroków od Krakowskiego
                  Przedmieścia i Łazienek Królewskich. Doświadcz fine dining w jednej
                  z najbardziej prestiżowych dzielnic Warszawy.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════ 13. NEWSLETTER ═══════════════════════ */}
      <section
        className="px-6 md:px-12 py-16 md:py-20"
        style={{ borderTop: "1px solid rgba(182,138,58,0.1)" }}
      >
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <Mail size={32} style={{ color: C.gold, opacity: 0.7 }} className="mx-auto" />
          <h3
            className="text-3xl"
            style={{ fontFamily: C.serif, fontWeight: 300, color: C.cream }}
          >
            Pozostań w kontakcie
          </h3>
          <p
            className="text-sm leading-relaxed"
            style={{ fontFamily: C.sans, fontWeight: 300, color: "rgba(243,239,234,0.6)" }}
          >
            Otrzymuj ogłoszenia o sezonowych menu, zaproszenia na ekskluzywne wydarzenia
            i specjalne oferty — wysyłane dyskretnie, nie częściej niż dwa razy w miesiącu.
          </p>

          {emailSent ? (
            <p className="text-sm py-4" style={{ fontFamily: C.sans, fontWeight: 500, color: C.gold }}>
              Dziękujemy — jesteś na liście.
            </p>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (email.includes("@")) setEmailSent(true);
              }}
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            >
              <input
                type="email"
                required
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-5 py-3 rounded-lg text-sm outline-none transition-all duration-200"
                style={{
                  fontFamily: C.sans,
                  fontWeight: 300,
                  backgroundColor: "rgba(243,239,234,0.05)",
                  color: C.cream,
                  border: "1px solid rgba(243,239,234,0.15)",
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(182,138,58,0.5)")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(243,239,234,0.15)")}
              />
              <button
                type="submit"
                className="px-6 py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
                style={{
                  fontFamily: C.sans,
                  fontWeight: 500,
                  fontSize: "14px",
                  backgroundColor: C.gold,
                  color: "#1E1A16",
                }}
              >
                <Send size={14} />
                SUBSKRYBUJ
              </button>
            </form>
          )}

          <p className="text-xs" style={{ fontFamily: C.sans, fontWeight: 300, color: "rgba(243,239,234,0.35)" }}>
            Szanujemy Twoją prywatność. Możesz zrezygnować w każdej chwili.
          </p>
        </div>
      </section>

      {/* ═══════════════════════ 15. FOOTER ═══════════════════════ */}
      <footer
        className="px-6 md:px-12 py-16"
        style={{ borderTop: "1px solid rgba(182,138,58,0.15)", backgroundColor: "rgba(24,37,34,0.5)" }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            {/* Brand */}
            <div className="md:col-span-1">
              <h3
                className="text-3xl mb-4"
                style={{ fontFamily: C.serif, fontWeight: 300, letterSpacing: "0.08em", color: C.cream }}
              >
                La Maison Dorée
              </h3>
              <p
                className="text-sm leading-relaxed mb-4"
                style={{ fontFamily: C.sans, fontWeight: 300, color: "rgba(243,239,234,0.6)", lineHeight: 1.7 }}
              >
                Współczesna kuchnia francuska w sercu Warszawy. Celebracja
                wyrafinowanych smaków i rzemiosła artystycznego od 2018 roku.
              </p>
            </div>

            {/* Navigation */}
            <div>
              <h4
                className="text-sm uppercase tracking-wider mb-4"
                style={{ fontFamily: C.sans, fontWeight: 500, letterSpacing: "0.1em", color: C.gold }}
              >
                Nawigacja
              </h4>
              <ul className="space-y-2">
                {[
                  { label: "Strona główna", action: () => window.scrollTo({ top: 0, behavior: "smooth" }) },
                  { label: "Menu", action: () => document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" }) },
                  { label: "Galeria", action: () => document.getElementById("gallery")?.scrollIntoView({ behavior: "smooth" }) },
                  { label: "Rezerwacje", action: () => { navigate("/reserve"); window.scrollTo(0, 0); } },
                  { label: "Prywatne wydarzenia", action: () => { navigate("/private-events"); window.scrollTo(0, 0); } },
                ].map((link) => (
                  <li key={link.label}>
                    <button
                      onClick={link.action}
                      className="text-sm transition-colors duration-200 hover:text-[#B68A3A]"
                      style={{ fontFamily: C.sans, fontWeight: 300, color: "rgba(243,239,234,0.7)" }}
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Hours */}
            <div>
              <h4
                className="text-sm uppercase tracking-wider mb-4"
                style={{ fontFamily: C.sans, fontWeight: 500, letterSpacing: "0.1em", color: C.gold }}
              >
                Godziny otwarcia
              </h4>
              <p
                className="text-sm leading-relaxed"
                style={{ fontFamily: C.sans, fontWeight: 300, color: "rgba(243,239,234,0.7)", lineHeight: 1.8 }}
              >
                Wtorek – Sobota<br />
                18:00 – 22:30<br /><br />
                Niedziela i poniedziałek<br />
                Nieczynne
              </p>
            </div>

            {/* Contact */}
            <div>
              <h4
                className="text-sm uppercase tracking-wider mb-4"
                style={{ fontFamily: C.sans, fontWeight: 500, letterSpacing: "0.1em", color: C.gold }}
              >
                Kontakt
              </h4>
              <ul className="space-y-2">
                <li>
                  <p className="text-sm" style={{ fontFamily: C.sans, fontWeight: 300, color: "rgba(243,239,234,0.7)", lineHeight: 1.6 }}>
                    ul. Nowy Świat 42<br />00-363 Warszawa
                  </p>
                </li>
                <li>
                  <a href="tel:+48223456789" className="text-sm hover:text-[#B68A3A] transition-colors duration-200" style={{ fontFamily: C.sans, fontWeight: 300, color: "rgba(243,239,234,0.7)" }}>
                    +48 22 345 67 89
                  </a>
                </li>
                <li>
                  <a href="mailto:info@lamaisondoree.pl" className="text-sm hover:text-[#B68A3A] transition-colors duration-200" style={{ fontFamily: C.sans, fontWeight: 300, color: "rgba(243,239,234,0.7)" }}>
                    info@lamaisondoree.pl
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="h-px w-full mb-8 bg-[rgba(182,138,58,0.2)]" />

          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs" style={{ fontFamily: C.sans, fontWeight: 300, color: "rgba(243,239,234,0.5)" }}>
              © {new Date().getFullYear()} La Maison Dorée. Wszelkie prawa zastrzeżone.
            </p>
            <div className="flex gap-6">
              {["Polityka prywatności", "Warunki usługi", "Pliki cookie"].map((link) => (
                <a
                  key={link}
                  href="#"
                  className="text-xs transition-colors duration-200 hover:text-[#B68A3A]"
                  style={{ fontFamily: C.sans, fontWeight: 300, color: "rgba(243,239,234,0.5)" }}
                >
                  {link}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {/* ═══════════════════════ STICKY RESERVATION BAR ═══════════════════════ */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 px-4 py-3 transition-all duration-500 flex items-center justify-center gap-4"
        style={{
          backgroundColor: "rgba(14,23,20,0.95)",
          borderTop: "1px solid rgba(182,138,58,0.25)",
          backdropFilter: "blur(12px)",
          transform: showSticky ? "translateY(0)" : "translateY(100%)",
          opacity: showSticky ? 1 : 0,
        }}
      >
        <p
          className="text-sm hidden sm:block"
          style={{ fontFamily: C.sans, fontWeight: 300, color: "rgba(243,239,234,0.7)" }}
        >
          Gotowy na niezapomniany wieczór?
        </p>
        <button
          onClick={() => navigate("/reserve")}
          className="px-6 py-2 rounded-lg transition-all duration-200 text-sm"
          style={{
            fontFamily: C.sans,
            fontWeight: 500,
            letterSpacing: "0.05em",
            backgroundColor: C.gold,
            color: "#1E1A16",
          }}
        >
          ZAREZERWUJ
        </button>
        <a
          href="tel:+48223456789"
          className="px-6 py-2 rounded-lg transition-all duration-200 text-sm"
          style={{
            fontFamily: C.sans,
            fontWeight: 500,
            letterSpacing: "0.05em",
            backgroundColor: "transparent",
            color: C.gold,
            border: "1px solid rgba(182,138,58,0.4)",
          }}
        >
          ZADZWOŃ
        </a>
      </div>

      {/* ═══════════════════════ LIGHTBOX MODAL ═══════════════════════ */}
      {lightboxIdx !== null && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center"
          style={{ backgroundColor: "rgba(0,0,0,0.92)" }}
          onClick={closeLightbox}
        >
          <button
            onClick={closeLightbox}
            className="absolute top-6 right-6 p-2 rounded-full transition-colors duration-200"
            style={{ color: C.cream, backgroundColor: "rgba(255,255,255,0.1)" }}
            aria-label="Close"
          >
            <X size={24} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); prevImage(); }}
            className="absolute left-4 md:left-8 p-3 rounded-full transition-colors duration-200"
            style={{ color: C.cream, backgroundColor: "rgba(255,255,255,0.1)" }}
            aria-label="Previous"
          >
            <ChevronLeft size={28} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); nextImage(); }}
            className="absolute right-4 md:right-8 p-3 rounded-full transition-colors duration-200"
            style={{ color: C.cream, backgroundColor: "rgba(255,255,255,0.1)" }}
            aria-label="Next"
          >
            <ChevronRight size={28} />
          </button>

          <img
            src={GALLERY_IMAGES[lightboxIdx].src.replace("w=800", "w=1400")}
            alt={GALLERY_IMAGES[lightboxIdx].alt}
            className="max-w-[90vw] max-h-[85vh] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />

          <div
            className="absolute bottom-6 text-center"
            style={{ fontFamily: C.sans, fontWeight: 300, color: "rgba(243,239,234,0.6)", fontSize: "13px" }}
          >
            {lightboxIdx + 1} / {GALLERY_IMAGES.length}
          </div>
        </div>
      )}
    </div>
  );
}