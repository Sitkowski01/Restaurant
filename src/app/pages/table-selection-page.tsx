import { useState } from "react";
import { useNavigate, useLocation } from "react-router";
import {
  ChevronLeft,
  Square,
  Users,
  Eye,
  Volume2,
  ArrowRight,
  Filter,
  CalendarX,
} from "lucide-react";
import restauracjaSvg from "@/assets/restauracja.svg?url";

const C = {
  gold: "#B68A3A",
  cream: "#F3EFEA",
  card: "#182522",
  serif: "Cormorant Garamond, serif",
  sans: "Inter, sans-serif",
};

function StepIndicator({ current }: { current: number }) {
  const steps = ["Data i godzina", "Wybierz stolik", "Twoje dane", "Potwierdzone"];
  return (
    <div className="flex items-center gap-1 mb-8 overflow-x-auto pb-2">
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

interface Table {
  id: string;
  number: string;
  x: number;
  y: number;
  width: number;
  height: number;
  shape: "circle" | "rectangle";
  capacity: string;
  tags: string[];
  status: "available" | "reserved";
}

/*
 * 13 stolików – współrzędne z restauracja.svg (viewBox 0 0 1000 800).
 * Koła: cx/cy/r z <circle>, bounding-box = (cx-r, cy-r, 2r, 2r).
 * Prostokąty: x/y/width/height bezpośrednio z <rect>.
 */
const TR = 27.38;
const MOCK_TABLES: Table[] = [
  // OKNO – O1–O4 (4-osobowe)
  { id: "1",  number: "O1", x: 404.58 - TR, y: 159.58 - TR, width: TR * 2, height: TR * 2, shape: "circle",    capacity: "4", tags: ["popular"], status: "available" },
  { id: "2",  number: "O2", x: 557.58 - TR, y: 159.58 - TR, width: TR * 2, height: TR * 2, shape: "circle",    capacity: "4", tags: [],          status: "available" },
  { id: "3",  number: "O3", x: 712.58 - TR, y: 159.58 - TR, width: TR * 2, height: TR * 2, shape: "circle",    capacity: "4", tags: [],          status: "reserved" },
  { id: "4",  number: "O4", x: 867.58 - TR, y: 159.58 - TR, width: TR * 2, height: TR * 2, shape: "circle",    capacity: "4", tags: ["popular"], status: "available" },
  // SALA – S1–S4 okrągłe (4-osobowe)
  { id: "5",  number: "S1", x: 154.58 - TR, y: 321.58 - TR, width: TR * 2, height: TR * 2, shape: "circle",    capacity: "4", tags: ["quiet"],   status: "available" },
  { id: "6",  number: "S2", x: 154.58 - TR, y: 478.74 - TR, width: TR * 2, height: TR * 2, shape: "circle",    capacity: "4", tags: ["popular"], status: "available" },
  { id: "7",  number: "S3", x: 664.58 - TR, y: 321.58 - TR, width: TR * 2, height: TR * 2, shape: "circle",    capacity: "4", tags: ["quiet"],   status: "available" },
  { id: "8",  number: "S4", x: 666.58 - TR, y: 478.74 - TR, width: TR * 2, height: TR * 2, shape: "circle",    capacity: "4", tags: ["popular"], status: "available" },
  // SALA – S5–S6 prostokątne duże (8-osobowe)
  { id: "9",  number: "S5", x: 355.25,       y: 300.25,       width: 110.5,  height: 43.5,  shape: "rectangle", capacity: "8", tags: ["popular"], status: "available" },
  { id: "10", number: "S6", x: 355.25,       y: 457.25,       width: 110.5,  height: 43.5,  shape: "rectangle", capacity: "8", tags: [],          status: "available" },
  // BOKSY – B1–B3 (6-osobowe)
  { id: "11", number: "B1", x: 830.20,       y: 309.20,       width: 76.87,  height: 43.71, shape: "rectangle", capacity: "6", tags: ["quiet"],   status: "available" },
  { id: "12", number: "B2", x: 830.20,       y: 475.30,       width: 76.87,  height: 43.71, shape: "rectangle", capacity: "6", tags: ["popular"], status: "available" },
  { id: "13", number: "B3", x: 830.20,       y: 641.41,       width: 76.87,  height: 43.71, shape: "rectangle", capacity: "6", tags: ["quiet"],   status: "available" },
];

export function TableSelectionPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { date, time, partySize } = location.state || {};
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [hoveredTable, setHoveredTable] = useState<string | null>(null);
  const [tables] = useState<Table[]>(MOCK_TABLES);
  const [tableFilter, setTableFilter] = useState<"all" | "popular" | "quiet">("all");

  const isTableAvailable = (table: Table) => {
    const capacityMatch = !partySize || (parseInt(table.capacity) >= partySize && parseInt(table.capacity) <= partySize + 2);
    const tagMatch = tableFilter === "all" || table.tags.includes(tableFilter);
    return capacityMatch && tagMatch;
  };

  const availableTables = tables.filter(isTableAvailable);

  const formatDate = (d: Date) =>
    new Date(d).toLocaleDateString("pl-PL", { weekday: "long", month: "long", day: "numeric", year: "numeric" });

  const handleReserve = () => {
    if (selectedTable) {
      navigate("/guest-details", { state: { date, time, partySize, table: selectedTable } });
    }
  };

  return (
    <div
      className="min-h-screen px-4 md:px-12 py-6 md:py-8"
      style={{ background: "radial-gradient(ellipse at center, #1a2820 0%, #0E1714 100%)", backgroundAttachment: "fixed" }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <button
            onClick={() => navigate("/reserve")}
            className="mb-4 flex items-center gap-2 transition-all duration-200"
            style={{ color: "rgba(243,239,234,0.6)", fontFamily: C.sans }}
            onMouseEnter={(e) => { e.currentTarget.style.color = C.gold; e.currentTarget.style.transform = "translateX(-2px)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(243,239,234,0.6)"; e.currentTarget.style.transform = "translateX(0)"; }}
          >
            <ChevronLeft size={20} />
            <span className="text-sm tracking-wide">Wróć</span>
          </button>
          <h1 className="text-2xl md:text-4xl mb-2" style={{ fontFamily: C.serif, fontWeight: 300, letterSpacing: "0.02em", color: C.cream }}>
            Wybierz swój stolik
          </h1>
          {date && time && (
            <p className="text-sm md:text-base" style={{ fontWeight: 300, fontFamily: C.sans, color: "rgba(243,239,234,0.6)" }}>
              {formatDate(date)} o godz. {time} • Liczba gości: {partySize}
            </p>
          )}
        </div>

        <StepIndicator current={1} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Floor Map */}
          <div className="lg:col-span-2">
            <div className="rounded-3xl p-4 md:p-6" style={{ backgroundColor: C.card, boxShadow: "0 20px 60px rgba(0,0,0,0.5), 0 8px 24px rgba(0,0,0,0.3)" }}>
              {/* Filter chips */}
              <div className="mb-4 flex flex-wrap gap-2">
                <div className="flex items-center gap-1 mr-2">
                  <Filter size={13} style={{ color: "rgba(243,239,234,0.4)" }} />
                  <span className="text-xs" style={{ fontFamily: C.sans, color: "rgba(243,239,234,0.4)" }}>Filtruj:</span>
                </div>
                {(["all", "popular", "quiet"] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => { setTableFilter(f); setSelectedTable(null); }}
                    className="px-4 py-1.5 rounded-full text-xs transition-all duration-200"
                    style={{
                      fontFamily: C.sans,
                      backgroundColor: tableFilter === f ? "rgba(182,138,58,0.2)" : "rgba(243,239,234,0.04)",
                      color: tableFilter === f ? C.gold : "rgba(243,239,234,0.6)",
                      border: tableFilter === f ? `1px solid ${C.gold}` : "1px solid rgba(243,239,234,0.1)",
                    }}
                  >
                    {f === "all" ? "Wszystkie stoliki" : f === "popular" ? "Popularne" : "Spokojne"}
                  </button>
                ))}
              </div>

              {/* Legend */}
              <div className="mb-4 flex flex-wrap gap-3">
                {[
                  { label: "Dostępny", color: "#F3EFEA", bg: "rgba(243,239,234,0.08)", border: "rgba(243,239,234,0.12)", dot: true },
                  { label: "Niedostępny", color: "rgba(243,239,234,0.35)", bg: "rgba(243,239,234,0.04)", border: "rgba(243,239,234,0.08)", dot: true },
                  { label: "Zajęty", color: "rgba(220,80,80,1)", bg: "rgba(220,80,80,0.08)", border: "rgba(220,80,80,0.3)", dot: true },
                  { label: "Wybrany", color: "#B68A3A", bg: "rgba(182,138,58,0.12)", border: "rgba(182,138,58,0.3)", dot: true },
                ].map((item) => (
                  <div key={item.label} className="px-4 py-2 rounded-full flex items-center gap-2" style={{ backgroundColor: item.bg, border: `1px solid ${item.border}`, fontFamily: C.sans, fontSize: "13px" }}>
                    {item.dot && <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />}
                    <span style={{ color: item.color }}>{item.label}</span>
                </div>
                ))}
                </div>

              {/* Floor Plan – restauracja.svg + nakładka */}
              <div
                className="rounded-2xl relative overflow-hidden min-h-[300px]"
                style={{ backgroundColor: "#FFFDFB", border: "3px solid #ECE4DA", boxShadow: "inset 0 2px 12px rgba(30,26,22,0.08), 0 4px 16px rgba(0,0,0,0.1)", aspectRatio: "1000 / 800" }}
              >
                <svg viewBox="0 0 1000 800" className="w-full h-full block" preserveAspectRatio="xMidYMid meet">
                  <defs>
                    <pattern id="reserved-hatch" width="4" height="4" patternUnits="userSpaceOnUse">
                      <path d="M-1,1 l2,-2 M0,4 l4,-4 M3,5 l2,-2" style={{ stroke: "rgba(220,80,80,0.35)", strokeWidth: 0.5 }} />
                    </pattern>
                    <style>{`
                      @keyframes tablePulse { 0%,100% { opacity:0.15 } 50% { opacity:0.4 } }
                      .table-pulse-ring { animation: tablePulse 1.8s ease-in-out infinite }
                      .table-select-ring { animation: selectRingAppear 280ms ease-out forwards }
                      @keyframes selectRingAppear { 0% { opacity:0 } 100% { opacity:1 } }
                    `}</style>
                  </defs>

                  {/* Tło – cały plan restauracji z SVG */}
                  <image href={restauracjaSvg} x={0} y={0} width={1000} height={800} preserveAspectRatio="xMidYMid meet" style={{ pointerEvents: "none" }} />

                  {/* Brak stolików fallback */}
                  {availableTables.length === 0 && (
                    <foreignObject x="300" y="300" width="400" height="160">
                      <div className="flex flex-col items-center justify-center text-center p-4">
                        <CalendarX size={36} style={{ color: "rgba(30,26,22,0.3)", marginBottom: 8 }} />
                        <p style={{ fontFamily: C.serif, fontSize: "18px", color: "rgba(30,26,22,0.5)" }}>Brak dostępnych stolików</p>
                        <p style={{ fontFamily: C.sans, fontSize: "12px", color: "rgba(30,26,22,0.4)" }}>Zmień filtr lub wybierz inną datę.</p>
                      </div>
                    </foreignObject>
                  )}

                  {/* Nakładka – WSZYSTKIE stoliki z numerami, niepassujące przyciemnione */}
                  {[...tables]
                    .sort((a, b) => {
                      if (selectedTable?.id === a.id && selectedTable?.id !== b.id) return 1;
                      if (selectedTable?.id !== a.id && selectedTable?.id === b.id) return -1;
                      if (hoveredTable === a.id && hoveredTable !== b.id) return 1;
                      if (hoveredTable !== a.id && hoveredTable === b.id) return -1;
                      return 0;
                    })
                    .map((table) => {
                      const isSelected = selectedTable?.id === table.id;
                      const isHovered = hoveredTable === table.id;
                      const isReserved = table.status === "reserved";
                      const isFiltered = !isTableAvailable(table);
                      const isDisabled = isReserved || isFiltered;
                      const cx = table.x + table.width / 2;
                      const cy = table.y + table.height / 2;
                      const r = table.width / 2;

                      const showDimmed = isFiltered || (isReserved && tableFilter !== "all");

                      return (
                        <g key={table.id} style={showDimmed ? { opacity: 0.18 } : undefined}>
                          {/* Zaznaczenie – pulsujący pierścień */}
                          {isSelected && table.shape === "circle" && (
                            <>
                              <circle cx={cx} cy={cy} r={r + 8} className="table-pulse-ring" style={{ fill: "none", stroke: C.gold, strokeWidth: 2 }} />
                              <circle cx={cx} cy={cy} r={r + 4} className="table-select-ring" style={{ fill: "none", stroke: C.gold, strokeWidth: 2.5, filter: "drop-shadow(0 0 6px rgba(182,138,58,0.4))" }} />
                              </>
                            )}
                          {isSelected && table.shape === "rectangle" && (
                            <>
                              <rect x={table.x - 8} y={table.y - 8} width={table.width + 16} height={table.height + 16} rx={14} className="table-pulse-ring" style={{ fill: "none", stroke: C.gold, strokeWidth: 2 }} />
                              <rect x={table.x - 4} y={table.y - 4} width={table.width + 8} height={table.height + 8} rx={12} className="table-select-ring" style={{ fill: "none", stroke: C.gold, strokeWidth: 2.5, filter: "drop-shadow(0 0 6px rgba(182,138,58,0.4))" }} />
                              </>
                            )}

                          {/* Hover – subtelna obwódka */}
                          {isHovered && !isDisabled && !isSelected && (
                            table.shape === "circle"
                              ? <circle cx={cx} cy={cy} r={r + 3} style={{ fill: "none", stroke: "rgba(182,138,58,0.5)", strokeWidth: 1.5, pointerEvents: "none" }} />
                              : <rect x={table.x - 3} y={table.y - 3} width={table.width + 6} height={table.height + 6} rx={12} style={{ fill: "none", stroke: "rgba(182,138,58,0.5)", strokeWidth: 1.5, pointerEvents: "none" }} />
                          )}

                          {/* Zajęte – czerwone tło + szrafura */}
                          {isReserved && !showDimmed && (
                            table.shape === "circle"
                              ? <>
                                  <circle cx={cx} cy={cy} r={r} style={{ fill: "rgba(220,80,80,0.1)", pointerEvents: "none" }} />
                                  <circle cx={cx} cy={cy} r={r} style={{ fill: "url(#reserved-hatch)", pointerEvents: "none" }} />
                                  <circle cx={cx} cy={cy} r={r} style={{ fill: "none", stroke: "rgba(220,80,80,0.45)", strokeWidth: 2, pointerEvents: "none" }} />
                                </>
                              : <>
                                  <rect x={table.x} y={table.y} width={table.width} height={table.height} rx={10} style={{ fill: "rgba(220,80,80,0.1)", pointerEvents: "none" }} />
                                  <rect x={table.x} y={table.y} width={table.width} height={table.height} rx={10} style={{ fill: "url(#reserved-hatch)", pointerEvents: "none" }} />
                                  <rect x={table.x} y={table.y} width={table.width} height={table.height} rx={10} style={{ fill: "none", stroke: "rgba(220,80,80,0.45)", strokeWidth: 2, pointerEvents: "none" }} />
                              </>
                            )}

                          {/* Hit-area */}
                                {table.shape === "circle" ? (
                                  <circle
                              cx={cx} cy={cy} r={r}
                              fill="transparent"
                              style={{ cursor: isDisabled ? "not-allowed" : "pointer" }}
                              onMouseEnter={() => !isDisabled && setHoveredTable(table.id)}
                              onMouseLeave={() => setHoveredTable(null)}
                              onClick={() => !isDisabled && setSelectedTable(table)}
                                  />
                                ) : (
                                  <rect
                              x={table.x} y={table.y} width={table.width} height={table.height}
                              rx={10} fill="transparent"
                              style={{ cursor: isDisabled ? "not-allowed" : "pointer" }}
                              onMouseEnter={() => !isDisabled && setHoveredTable(table.id)}
                              onMouseLeave={() => setHoveredTable(null)}
                              onClick={() => !isDisabled && setSelectedTable(table)}
                            />
                          )}

                          {/* Numer stolika */}
                            <text
                            x={cx} y={cy + 5}
                              textAnchor="middle"
                              style={{
                                fontSize: "13px",
                              fontWeight: 600,
                              fill: (isReserved && !showDimmed) ? "rgba(220,80,80,0.7)" : isSelected ? C.gold : "#1E1A16",
                              fontFamily: C.sans,
                                pointerEvents: "none",
                                userSelect: "none",
                              }}
                            >
                              {table.number}
                            </text>

                          {/* Ptaszek przy zaznaczeniu */}
                          {isSelected && (
                            <g className="table-select-ring" transform={`translate(${cx + r - 4}, ${cy - (table.shape === "circle" ? r : table.height / 2) + 4})`}>
                              <circle r="8" style={{ fill: C.gold, filter: "drop-shadow(0 1px 3px rgba(0,0,0,0.2))" }} />
                              <path d="M-3.5 0 L-1 2.5 L3.5 -2.5" fill="none" stroke={C.cream} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                            </g>
                          )}
                        </g>
                      );
                    })}
                </svg>
              </div>
            </div>
          </div>

          {/* Table Details Panel */}
          <div className="lg:col-span-1">
            <div
              className="rounded-3xl p-8 sticky top-8"
              style={{
                backgroundColor: C.card,
                boxShadow: "0 20px 60px rgba(0,0,0,0.5), 0 8px 24px rgba(0,0,0,0.3)",
                animation: selectedTable ? "panelSlide 320ms ease-out" : "none",
              }}
            >
              <style>{`@keyframes panelSlide { from { opacity:0.7; transform:translateY(8px) } to { opacity:1; transform:translateY(0) } }`}</style>

              {selectedTable ? (
                <div className="space-y-8">
                  <div>
                    <h2 className="text-4xl mb-3" style={{ fontFamily: C.serif, fontWeight: 300, color: C.cream, letterSpacing: "0.02em" }}>
                      Stolik {selectedTable.number}
                    </h2>
                    <div className="h-px w-16" style={{ backgroundColor: C.gold, opacity: 0.6 }} />
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Users size={18} style={{ color: C.gold }} />
                      <span className="text-xs uppercase tracking-wider" style={{ fontWeight: 500, letterSpacing: "0.12em", fontFamily: C.sans, color: C.gold }}>Pojemność</span>
                    </div>
                    <p className="text-2xl" style={{ fontFamily: C.serif, fontWeight: 300, color: C.cream }}>
                      {selectedTable.capacity} {parseInt(selectedTable.capacity) === 1 ? "Gość" : "Gości"}
                    </p>
                  </div>

                  {selectedTable.tags.length > 0 && (
                    <div>
                      <span className="text-xs uppercase tracking-wider mb-3 block" style={{ fontWeight: 500, letterSpacing: "0.12em", fontFamily: C.sans, color: C.gold }}>Cechy</span>
                      <div className="flex flex-wrap gap-2">
                        {selectedTable.tags.map((tag) => (
                          <div key={tag} className="px-3 py-2 rounded-lg flex items-center gap-2" style={{ backgroundColor: "rgba(182,138,58,0.1)", border: "1px solid rgba(182,138,58,0.25)" }}>
                            {tag === "popular" && <Eye size={14} style={{ color: C.gold }} />}
                            {tag === "quiet" && <Volume2 size={14} style={{ color: C.gold }} />}
                            <span className="text-sm" style={{ fontWeight: 400, fontFamily: C.sans, color: C.cream }}>
                              {tag === "popular" ? "Popularne" : tag === "quiet" ? "Spokojne" : tag}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <button
                    onClick={handleReserve}
                    className="w-full py-4 rounded-lg mt-8 flex items-center justify-center gap-2"
                    style={{ fontWeight: 500, fontFamily: C.sans, letterSpacing: "0.08em", backgroundColor: C.gold, color: "#1E1A16", boxShadow: "0 8px 24px rgba(182,138,58,0.3)", transition: "all 200ms ease-out" }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px) scale(1.02)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(182,138,58,0.4)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0) scale(1)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(182,138,58,0.3)"; }}
                  >
                    KONTYNUUJ
                    <ArrowRight size={16} />
                  </button>
                  <p className="text-center text-xs mt-3" style={{ fontFamily: C.sans, fontWeight: 300, color: "rgba(243,239,234,0.35)" }}>
                    Dalej: Wprowadź swoje dane
                  </p>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: "rgba(182,138,58,0.08)", border: "1px solid rgba(182,138,58,0.15)" }}>
                    <Square size={24} style={{ color: C.gold, opacity: 0.6 }} />
                  </div>
                  <p className="text-base" style={{ fontWeight: 300, fontFamily: C.sans, color: "rgba(243,239,234,0.5)", lineHeight: 1.6 }}>
                    Wybierz stolik z planu sali, aby zobaczyć szczegóły
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
