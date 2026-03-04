import { useNavigate } from "react-router";
import { Home, ArrowLeft, Utensils } from "lucide-react";

const C = {
  gold: "#B68A3A",
  cream: "#F3EFEA",
  dark: "#0E1714",
  card: "#182522",
  serif: "Cormorant Garamond, serif",
  sans: "Inter, sans-serif",
};

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 py-12 text-center"
      style={{ background: "radial-gradient(ellipse at center, #1a2820 0%, #0E1714 100%)" }}
    >
      {/* Icon */}
      <div
        className="w-24 h-24 rounded-full flex items-center justify-center mb-8"
        style={{ backgroundColor: "rgba(182,138,58,0.1)", border: `2px solid ${C.gold}` }}
      >
        <Utensils size={40} style={{ color: C.gold }} />
      </div>

      {/* 404 */}
      <h1
        className="text-8xl md:text-9xl mb-4"
        style={{ fontFamily: C.serif, fontWeight: 300, color: C.gold, letterSpacing: "0.05em" }}
      >
        404
      </h1>

      {/* Title */}
      <h2
        className="text-3xl md:text-4xl mb-4"
        style={{ fontFamily: C.serif, fontWeight: 300, color: C.cream, letterSpacing: "0.02em" }}
      >
        Strona nie znaleziona
      </h2>

      {/* Description */}
      <p
        className="text-base max-w-md mb-10 leading-relaxed"
        style={{ fontFamily: C.sans, fontWeight: 300, color: "rgba(243,239,234,0.6)", lineHeight: 1.7 }}
      >
        Przepraszamy — ta strona nie istnieje lub została przeniesiona.
        Zapraszamy z powrotem do naszej restauracji.
      </p>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 px-8 py-3.5 rounded-lg transition-all duration-200"
          style={{
            fontFamily: C.sans,
            fontWeight: 500,
            letterSpacing: "0.05em",
            fontSize: "14px",
            backgroundColor: C.gold,
            color: "#1E1A16",
            boxShadow: "0 4px 16px rgba(182,138,58,0.3)",
          }}
        >
          <Home size={16} />
          STRONA GŁÓWNA
        </button>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-8 py-3.5 rounded-lg transition-all duration-200"
          style={{
            fontFamily: C.sans,
            fontWeight: 500,
            letterSpacing: "0.05em",
            fontSize: "14px",
            backgroundColor: "rgba(182,138,58,0.1)",
            color: C.gold,
            border: "1px solid rgba(182,138,58,0.3)",
          }}
        >
          <ArrowLeft size={16} />
          WRÓĆ
        </button>
      </div>

      {/* Restaurant name */}
      <p
        className="mt-16 text-2xl"
        style={{ fontFamily: C.serif, fontWeight: 300, color: "rgba(243,239,234,0.15)", letterSpacing: "0.08em" }}
      >
        La Maison Dorée
      </p>
    </div>
  );
}
