import { useState, useEffect } from "react";
import { X, Cookie } from "lucide-react";

const C = {
  gold: "#B68A3A",
  cream: "#F3EFEA",
  card: "#182522",
  sans: "Inter, sans-serif",
};

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("lmd-cookie-consent");
    if (!consent) {
      // Small delay so it doesn't flash on load
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const accept = () => {
    localStorage.setItem("lmd-cookie-consent", "accepted");
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem("lmd-cookie-consent", "declined");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-[70] px-4 py-0 transition-all duration-500"
      style={{
        transform: visible ? "translateY(0)" : "translateY(100%)",
        opacity: visible ? 1 : 0,
      }}
    >
      <div
        className="max-w-4xl mx-auto mb-4 rounded-2xl px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center gap-4"
        style={{
          backgroundColor: "rgba(24,37,34,0.97)",
          backdropFilter: "blur(16px)",
          border: "1px solid rgba(182,138,58,0.2)",
          boxShadow: "0 -4px 32px rgba(0,0,0,0.4)",
        }}
      >
        {/* Icon + Text */}
        <div className="flex items-start gap-3 flex-1">
          <Cookie size={20} className="flex-shrink-0 mt-0.5" style={{ color: C.gold }} />
          <p
            className="text-sm leading-relaxed"
            style={{ fontFamily: C.sans, fontWeight: 300, color: "rgba(243,239,234,0.7)" }}
          >
            Używamy plików cookie, aby zapewnić najlepsze wrażenia na naszej stronie.
            Kontynuując przeglądanie, wyrażasz zgodę na ich użycie.{" "}
            <button
              onClick={() => {}}
              className="underline transition-colors duration-200 hover:text-[#B68A3A]"
              style={{ color: C.gold, fontWeight: 400 }}
            >
              Polityka prywatności
            </button>
          </p>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <button
            onClick={decline}
            className="px-5 py-2 rounded-lg text-xs uppercase tracking-wider transition-all duration-200"
            style={{
              fontFamily: C.sans,
              fontWeight: 500,
              letterSpacing: "0.06em",
              color: "rgba(243,239,234,0.5)",
              border: "1px solid rgba(243,239,234,0.1)",
              backgroundColor: "transparent",
            }}
          >
            Odrzuć
          </button>
          <button
            onClick={accept}
            className="px-5 py-2 rounded-lg text-xs uppercase tracking-wider transition-all duration-200"
            style={{
              fontFamily: C.sans,
              fontWeight: 500,
              letterSpacing: "0.06em",
              backgroundColor: C.gold,
              color: "#1E1A16",
            }}
          >
            Akceptuję
          </button>
        </div>

        {/* Close */}
        <button
          onClick={decline}
          className="absolute top-3 right-3 sm:hidden p-1 rounded-full"
          style={{ color: "rgba(243,239,234,0.3)" }}
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
