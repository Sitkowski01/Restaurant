import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import { Lock, User, Eye, EyeOff, AlertCircle } from "lucide-react";

const C = {
  gold: "#B68A3A",
  cream: "#F3EFEA",
  dark: "#0A100D",
  card: "#131C18",
  border: "rgba(243,239,234,0.07)",
  sans: "Inter, sans-serif",
  serif: "Cormorant Garamond, serif",
};

const MOCK_USERS = [
  { name: "Jan Kowalski", pin: "111111", role: "waiter" as const },
  { name: "Anna Nowak", pin: "222222", role: "waiter" as const },
  { name: "Marek Wiśniewski", pin: "333333", role: "waiter" as const },
  { name: "Ewa Kamińska", pin: "444444", role: "waiter" as const },
  { name: "Tomasz Zieliński", pin: "555555", role: "waiter" as const },
  { name: "Magdalena Dąbrowska", pin: "666666", role: "manager" as const },
  { name: "Mikołaj Sitek", pin: "000000", role: "admin" as const },
];

export function StaffLoginPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [pin, setPin] = useState(["", "", "", "", "", ""]);
  const [showPin, setShowPin] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const pinRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const stored = sessionStorage.getItem("lmd_auth");
    if (stored) {
      try {
        const auth = JSON.parse(stored);
        if (auth.role === "admin") navigate("/admin", { replace: true });
        else if (auth.role === "manager") navigate("/manager", { replace: true });
        else if (auth.role) navigate("/staff-dashboard", { replace: true });
      } catch { /* ignore */ }
    }
  }, [navigate]);

  useEffect(() => {
    pinRefs.current = pinRefs.current.slice(0, 6);
  }, []);

  const handlePinChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const digit = value.slice(-1);
    const newPin = [...pin];
    newPin[index] = digit;
    setPin(newPin);
    setError("");

    if (digit && index < 5) {
      pinRefs.current[index + 1]?.focus();
    }
  };

  const handlePinKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !pin[index] && index > 0) {
      pinRefs.current[index - 1]?.focus();
    }
  };

  const handlePinPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;
    const newPin = [...pin];
    for (let i = 0; i < 6; i++) {
      newPin[i] = pasted[i] || "";
    }
    setPin(newPin);
    const nextEmpty = newPin.findIndex((d) => !d);
    pinRefs.current[nextEmpty === -1 ? 5 : nextEmpty]?.focus();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const trimmedName = name.trim();
    const fullPin = pin.join("");

    if (!trimmedName) {
      setError("Wpisz swoje imię i nazwisko.");
      return;
    }
    if (fullPin.length < 6) {
      setError("Wpisz pełny 6-cyfrowy PIN.");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const user = MOCK_USERS.find(
        (u) => u.name.toLowerCase() === trimmedName.toLowerCase() && u.pin === fullPin
      );

      if (!user) {
        setError("Nieprawidłowe dane logowania.");
        setIsLoading(false);
        return;
      }

      sessionStorage.setItem("lmd_auth", JSON.stringify({ name: user.name, role: user.role }));

      if (user.role === "admin") {
        navigate("/admin");
      } else if (user.role === "manager") {
        navigate("/manager");
      } else {
        navigate("/staff-dashboard");
      }
    }, 600);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "radial-gradient(ellipse at center, #1a2820 0%, #0A100D 100%)" }}
    >
      <div className="w-full max-w-md">
        {/* Logo / brand */}
        <div className="text-center mb-12">
          <h1
            className="text-4xl md:text-5xl tracking-wide"
            style={{ fontFamily: C.serif, fontWeight: 300, letterSpacing: "0.05em", color: C.cream }}
          >
            La Maison Dorée
          </h1>
          <div className="h-px w-16 mx-auto mt-6 mb-4" style={{ backgroundColor: C.gold, opacity: 0.5 }} />
          <p
            className="text-sm uppercase tracking-[0.25em]"
            style={{ fontFamily: C.sans, fontWeight: 500, color: "rgba(182,138,58,0.7)" }}
          >
            Panel pracowniczy
          </p>
        </div>

        {/* Login card */}
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl p-8 md:p-10"
          style={{
            backgroundColor: C.card,
            border: `1px solid ${C.border}`,
            boxShadow: "0 24px 64px rgba(0,0,0,0.4)",
          }}
        >
          {/* Name field */}
          <div className="mb-6">
            <label
              className="block text-xs uppercase tracking-[0.15em] mb-2"
              style={{ fontFamily: C.sans, fontWeight: 500, color: "rgba(243,239,234,0.5)" }}
            >
              Imię i nazwisko
            </label>
            <div className="relative">
              <User
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2"
                style={{ color: "rgba(243,239,234,0.3)" }}
              />
              <input
                type="text"
                value={name}
                onChange={(e) => { setName(e.target.value); setError(""); }}
                placeholder="np. Jan Kowalski"
                className="w-full pl-11 pr-4 py-3 rounded-xl text-sm outline-none transition-all duration-200"
                style={{
                  fontFamily: C.sans,
                  backgroundColor: "rgba(243,239,234,0.04)",
                  border: "1px solid rgba(243,239,234,0.1)",
                  color: C.cream,
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(182,138,58,0.4)"; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(243,239,234,0.1)"; }}
              />
            </div>
          </div>

          {/* PIN field */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <label
                className="text-xs uppercase tracking-[0.15em]"
                style={{ fontFamily: C.sans, fontWeight: 500, color: "rgba(243,239,234,0.5)" }}
              >
                PIN (6 cyfr)
              </label>
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="flex items-center gap-1 text-xs transition-colors duration-200"
                style={{ fontFamily: C.sans, color: "rgba(243,239,234,0.35)" }}
                onMouseEnter={(e) => { e.currentTarget.style.color = C.gold; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(243,239,234,0.35)"; }}
              >
                {showPin ? <EyeOff size={13} /> : <Eye size={13} />}
                {showPin ? "Ukryj" : "Pokaż"}
              </button>
            </div>
            <div className="flex gap-3 justify-center" onPaste={handlePinPaste}>
              {pin.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => { pinRefs.current[i] = el; }}
                  type={showPin ? "text" : "password"}
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handlePinChange(i, e.target.value)}
                  onKeyDown={(e) => handlePinKeyDown(i, e)}
                  className="w-12 h-14 text-center text-xl rounded-xl outline-none transition-all duration-200"
                  style={{
                    fontFamily: C.sans,
                    fontWeight: 600,
                    backgroundColor: "rgba(243,239,234,0.04)",
                    border: digit ? "1px solid rgba(182,138,58,0.4)" : "1px solid rgba(243,239,234,0.1)",
                    color: C.cream,
                    caretColor: C.gold,
                  }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(182,138,58,0.5)"; e.currentTarget.style.backgroundColor = "rgba(182,138,58,0.06)"; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = digit ? "rgba(182,138,58,0.4)" : "rgba(243,239,234,0.1)"; e.currentTarget.style.backgroundColor = "rgba(243,239,234,0.04)"; }}
                />
              ))}
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div
              className="flex items-center gap-2 mb-6 px-4 py-3 rounded-xl text-sm"
              style={{
                fontFamily: C.sans,
                backgroundColor: "rgba(220,80,80,0.08)",
                border: "1px solid rgba(220,80,80,0.2)",
                color: "rgba(220,80,80,0.9)",
              }}
            >
              <AlertCircle size={15} />
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 rounded-xl text-sm uppercase tracking-[0.12em] transition-all duration-200 flex items-center justify-center gap-2"
            style={{
              fontFamily: C.sans,
              fontWeight: 600,
              backgroundColor: isLoading ? "rgba(182,138,58,0.5)" : C.gold,
              color: "#1E1A16",
              boxShadow: "0 8px 28px rgba(182,138,58,0.25)",
            }}
            onMouseEnter={(e) => { if (!isLoading) { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 12px 34px rgba(182,138,58,0.35)"; } }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 8px 28px rgba(182,138,58,0.25)"; }}
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Lock size={15} />
                Zaloguj się
              </>
            )}
          </button>
        </form>

        <p
          className="text-center mt-8 text-xs"
          style={{ fontFamily: C.sans, color: "rgba(243,239,234,0.25)" }}
        >
          Dostęp wyłącznie dla pracowników La Maison Dorée
        </p>
      </div>
    </div>
  );
}
