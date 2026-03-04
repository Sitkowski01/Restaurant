import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Navigation } from "../components/navigation";
import { Popover, PopoverContent, PopoverTrigger } from "../components/ui/popover";
import { cn } from "../components/ui/utils";
import {
  Leaf, Wine, Flame, Award, Coffee, GlassWater, ChevronDown, ArrowLeft, Phone,
  MapPin, Clock, SlidersHorizontal,
} from "lucide-react";

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
   ALLERGENS & DIET
   ═══════════════════════════════════════════════════════ */
const ALLERGENS = ["Gluten", "Laktoza", "Jaja", "Ryby", "Skorupiaki", "Orzechy", "Soja", "Seler", "Gorczyca", "Sezam", "Mięczaki", "Łubin"] as const;
type Allergen = typeof ALLERGENS[number];
type DietType = "vegetarian" | "vegan";

const ALLERGEN_COLORS: Record<string, string> = {
  Gluten: "#E8843A", Laktoza: "#7AAFE8", Jaja: "#F6BF60", Ryby: "#60C275",
  Skorupiaki: "#F28B82", Orzechy: "#D4A843", Soja: "#A3D977", Seler: "#8BC9A3",
  Gorczyca: "#E8D843", Sezam: "#C9A86C", Mięczaki: "#7A8FE8", Łubin: "#C77AD4",
};

/* ═══════════════════════════════════════════════════════
   MENU DATA
   ═══════════════════════════════════════════════════════ */
interface Ingredient {
  name: string;
  allergen?: Allergen;
  alcohol?: boolean;
}

interface MenuItem {
  id: string;
  name: string;
  price: number;
  description: string;
  ingredients: Ingredient[];
  category: MenuCategory;
  diet?: DietType;
}

type MenuCategory = "Przystawki" | "Zupy" | "Dania główne" | "Desery" | "Napoje" | "Koktajle";
const MENU_CATEGORIES: MenuCategory[] = ["Przystawki", "Zupy", "Dania główne", "Desery", "Napoje", "Koktajle"];

const CATEGORY_ICONS: Record<MenuCategory, typeof Leaf> = {
  "Przystawki": Leaf,
  "Zupy": Flame,
  "Dania główne": Award,
  "Desery": Coffee,
  "Napoje": GlassWater,
  "Koktajle": Wine,
};

const MENU_ITEMS: MenuItem[] = [
  {
    id: "m1", name: "Tatar z polędwicy wołowej", price: 58, category: "Przystawki",
    description: "Klasyczny tatar z marynowanym żółtkiem, kaparami i grzanką brioche.",
    ingredients: [
      { name: "polędwica wołowa" }, { name: "żółtko jaja", allergen: "Jaja" },
      { name: "kapary" }, { name: "szalotka" }, { name: "oliwa truflowa" },
      { name: "brioche", allergen: "Gluten" }, { name: "masło", allergen: "Laktoza" },
    ],
  },
  {
    id: "m2", name: "Carpaccio z buraka z chèvre", price: 42, category: "Przystawki", diet: "vegetarian",
    description: "Cienkie plastry buraka z kremowym kozim serem, orzechami włoskimi i vinaigrette miodowym.",
    ingredients: [
      { name: "burak" }, { name: "kozi ser", allergen: "Laktoza" },
      { name: "orzechy włoskie", allergen: "Orzechy" }, { name: "miód" },
      { name: "rukola" }, { name: "oliwa z oliwek" },
    ],
  },
  {
    id: "m3", name: "Foie gras z konfiturą figową", price: 72, category: "Przystawki",
    description: "Delikatny foie gras z domową konfiturą z fig i chrupiącą brioche.",
    ingredients: [
      { name: "wątroba kacza" }, { name: "figi" }, { name: "cukier" },
      { name: "brioche", allergen: "Gluten" }, { name: "masło", allergen: "Laktoza" },
    ],
  },
  {
    id: "m19", name: "Bruschetta z awokado", price: 36, category: "Przystawki", diet: "vegetarian",
    description: "Chrupiąca ciabatta z kremem z awokado, pomidorami cherry i bazylią.",
    ingredients: [
      { name: "ciabatta", allergen: "Gluten" }, { name: "awokado" },
      { name: "pomidory cherry" }, { name: "bazylia" }, { name: "oliwa z oliwek" },
    ],
  },
  {
    id: "m4", name: "Bisque z homara", price: 48, category: "Zupy",
    description: "Aksamitna zupa z homara z kroplą koniaku i kremem śmietanowym.",
    ingredients: [
      { name: "homar", allergen: "Skorupiaki" }, { name: "śmietana", allergen: "Laktoza" },
      { name: "koniak", alcohol: true }, { name: "marchewka" }, { name: "seler naciowy", allergen: "Seler" },
    ],
  },
  {
    id: "m5", name: "Consommé z grzybami leśnymi", price: 38, category: "Zupy",
    description: "Klarowny bulion wołowy z sezonowymi grzybami leśnymi i kluseczkami.",
    ingredients: [
      { name: "bulion wołowy" }, { name: "borowiki" }, { name: "kurki" },
      { name: "kluseczki", allergen: "Gluten" }, { name: "jaja", allergen: "Jaja" },
    ],
  },
  {
    id: "m6", name: "Risotto truflowe", price: 78, category: "Dania główne", diet: "vegetarian",
    description: "Kremowe risotto z czarną truflą, parmezanem i masłem truflowym.",
    ingredients: [
      { name: "ryż arborio" }, { name: "trufla czarna" },
      { name: "parmezan", allergen: "Laktoza" }, { name: "masło", allergen: "Laktoza" },
      { name: "wino białe", alcohol: true }, { name: "bulion warzywny" },
    ],
  },
  {
    id: "m7", name: "Polędwica wołowa Wellington", price: 128, category: "Dania główne",
    description: "Polędwica w cieście francuskim z duxelles grzybowym i foie gras.",
    ingredients: [
      { name: "polędwica wołowa" }, { name: "ciasto francuskie", allergen: "Gluten" },
      { name: "pieczarki" }, { name: "wątroba kacza" }, { name: "musztarda", allergen: "Gorczyca" },
    ],
  },
  {
    id: "m8", name: "Dorsz konfitowany w oliwie", price: 88, category: "Dania główne",
    description: "Dorsz wolno gotowany w oliwie z puree z selera i sosem beurre blanc.",
    ingredients: [
      { name: "dorsz", allergen: "Ryby" }, { name: "oliwa z oliwek" },
      { name: "seler korzeniowy", allergen: "Seler" }, { name: "masło", allergen: "Laktoza" },
      { name: "wino białe", alcohol: true },
    ],
  },
  {
    id: "m9", name: "Kaczka confit z purée", price: 96, category: "Dania główne",
    description: "Udko kacze confit z purée ziemniaczanym, konfiturą wiśniową i jus.",
    ingredients: [
      { name: "udko kacze" }, { name: "tłuszcz kaczy" },
      { name: "ziemniaki" }, { name: "masło", allergen: "Laktoza" }, { name: "wiśnie" },
    ],
  },
  {
    id: "m10", name: "Rack of Lamb", price: 118, category: "Dania główne",
    description: "Karczek jagnięcy z ziołową panierką, ratatouille i sosem demi-glace.",
    ingredients: [
      { name: "jagnięcina" }, { name: "bułka tarta", allergen: "Gluten" },
      { name: "zioła prowansalskie" }, { name: "cukinia" }, { name: "musztarda", allergen: "Gorczyca" },
    ],
  },
  {
    id: "m20", name: "Bowl z pieczonymi warzywami", price: 52, category: "Dania główne", diet: "vegan",
    description: "Komosa ryżowa z pieczonymi warzywami sezonowymi, hummusem i tahini.",
    ingredients: [
      { name: "komosa ryżowa" }, { name: "bataty" }, { name: "cukinia" },
      { name: "ciecierzyca" }, { name: "tahini", allergen: "Sezam" },
    ],
  },
  {
    id: "m21", name: "Ravioli szpinakowe z ricottą", price: 62, category: "Dania główne", diet: "vegetarian",
    description: "Domowy makaron z nadzieniem szpinakowym i ricottą w sosie maślanym z szałwią.",
    ingredients: [
      { name: "mąka", allergen: "Gluten" }, { name: "jaja", allergen: "Jaja" },
      { name: "szpinak" }, { name: "ricotta", allergen: "Laktoza" }, { name: "masło", allergen: "Laktoza" },
    ],
  },
  {
    id: "m11", name: "Crème brûlée waniliowe", price: 36, category: "Desery",
    description: "Klasyczne crème brûlée z laską wanilii tahitańskiej i chrupiącą karmelową skorupką.",
    ingredients: [
      { name: "śmietana", allergen: "Laktoza" }, { name: "żółtka jaj", allergen: "Jaja" },
      { name: "wanilia tahitańska" }, { name: "cukier" },
    ],
  },
  {
    id: "m12", name: "Fondant czekoladowy", price: 42, category: "Desery",
    description: "Ciepły fondant z gorzkiej czekolady 70% z lodami waniliowymi.",
    ingredients: [
      { name: "czekolada 70%" }, { name: "masło", allergen: "Laktoza" },
      { name: "jaja", allergen: "Jaja" }, { name: "mąka", allergen: "Gluten" },
    ],
  },
  {
    id: "m13", name: "Tarte Tatin", price: 38, category: "Desery",
    description: "Odwrócona tarta jabłkowa z karmelizowanymi jabłkami i lodami śmietankowymi.",
    ingredients: [
      { name: "jabłka" }, { name: "ciasto kruche", allergen: "Gluten" },
      { name: "masło", allergen: "Laktoza" }, { name: "cukier" },
    ],
  },
  {
    id: "m22", name: "Sorbet z mango i marakui", price: 28, category: "Desery", diet: "vegan",
    description: "Orzeźwiający sorbet z mango i marakui z miętą i chipsem kokosowym.",
    ingredients: [
      { name: "mango" }, { name: "marakuja" }, { name: "cukier" }, { name: "mięta" },
    ],
  },
  {
    id: "m14", name: "Espresso / Doppio", price: 14, category: "Napoje",
    description: "Kawa specialty z palarni lokalnej. Espresso lub podwójne.",
    ingredients: [{ name: "kawa arabica" }],
  },
  {
    id: "m15", name: "Herbata premium", price: 18, category: "Napoje",
    description: "Wybór herbat liściastych: Earl Grey, Jasmine, Sencha, Rooibos.",
    ingredients: [{ name: "herbata liściasta" }],
  },
  {
    id: "m23", name: "Woda mineralna", price: 12, category: "Napoje",
    description: "San Pellegrino lub Acqua Panna (750ml).",
    ingredients: [{ name: "woda mineralna" }],
  },
  {
    id: "m16", name: "Negroni Classico", price: 38, category: "Koktajle",
    description: "Gin, Campari, słodki wermut — klasyczna proporcja 1:1:1.",
    ingredients: [{ name: "gin", alcohol: true }, { name: "Campari", alcohol: true }, { name: "wermut słodki", alcohol: true }],
  },
  {
    id: "m17", name: "Old Fashioned", price: 42, category: "Koktajle",
    description: "Bourbon, angostura, cukier trzcinowy, skórka pomarańczy.",
    ingredients: [{ name: "bourbon", alcohol: true }, { name: "angostura" }, { name: "cukier trzcinowy" }],
  },
  {
    id: "m18", name: "Champagne Coupe", price: 48, category: "Koktajle",
    description: "Kieliszek szampana z domową konfiturą malinową.",
    ingredients: [{ name: "szampan", alcohol: true }, { name: "konfitury malinowe" }],
  },
  {
    id: "m24", name: "Aperol Spritz", price: 34, category: "Koktajle",
    description: "Aperol, Prosecco, woda gazowana, plasterek pomarańczy.",
    ingredients: [{ name: "Aperol", alcohol: true }, { name: "Prosecco", alcohol: true }, { name: "woda gazowana" }],
  },
];

/* ═══════════════════════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════════════════════ */
function getItemAllergens(item: MenuItem): Allergen[] {
  return [...new Set(item.ingredients.filter((i) => i.allergen).map((i) => i.allergen!))];
}
function itemHasAlcohol(item: MenuItem): boolean {
  return item.ingredients.some((i) => i.alcohol);
}

/* ═══════════════════════════════════════════════════════
   COMPONENTS — neutral chip (subtelne tło + obwódka, kolor jako kropka)
   ═══════════════════════════════════════════════════════ */
const NEUTRAL_CHIP = "rounded-full border text-xs font-medium bg-[rgba(243,239,234,0.06)] border-[rgba(243,239,234,0.1)] text-[rgba(243,239,234,0.75)]";

function MenuCard({ item, expanded, onToggle }: { item: MenuItem; expanded: boolean; onToggle: () => void }) {
  const allergens = getItemAllergens(item);
  const hasAlcohol = itemHasAlcohol(item);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onToggle}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onToggle(); } }}
      className={cn(
        "rounded-2xl cursor-pointer transition-all duration-300 outline-none",
        "focus-visible:ring-2 focus-visible:ring-[rgba(182,138,58,0.4)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0E1714]",
        "hover:-translate-y-0.5"
      )}
      style={{
        backgroundColor: expanded ? "rgba(182,138,58,0.06)" : C.card,
        border: expanded ? "1px solid rgba(182,138,58,0.2)" : "1px solid rgba(243,239,234,0.05)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
      }}
      aria-expanded={expanded}
      aria-label={`${item.name}, ${item.price} zł. Kliknij aby ${expanded ? "zwinąć" : "rozwinąć"} składniki.`}
    >
      <div className="p-6 md:p-8">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <h3 className="text-lg md:text-xl" style={{ fontFamily: C.serif, color: C.cream, fontWeight: 400 }}>
                {item.name}
              </h3>
              {item.diet === "vegan" && (
                <>
                  <span className={cn(NEUTRAL_CHIP, "inline-flex items-center gap-1.5 px-2.5 py-0.5")}>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#4CAF50]" aria-hidden />
                    <span>Wegan</span>
                  </span>
                  <span className={cn(NEUTRAL_CHIP, "inline-flex items-center gap-1.5 px-2.5 py-0.5")}>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#8BC34A]" aria-hidden />
                    <span>Wege</span>
                  </span>
                </>
              )}
              {item.diet === "vegetarian" && (
                <span className={cn(NEUTRAL_CHIP, "inline-flex items-center gap-1.5 px-2.5 py-0.5")}>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#8BC34A]" aria-hidden />
                  <span>Wege</span>
                </span>
              )}
              {hasAlcohol && (
                <span className={cn(NEUTRAL_CHIP, "inline-flex items-center gap-1.5 px-2.5 py-0.5")}>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#A855F7]" aria-hidden />
                  <span>ALKOHOL</span>
                </span>
              )}
            </div>
            <p className="text-sm leading-relaxed" style={{ color: "rgba(243,239,234,0.65)", lineHeight: 1.65 }}>
              {item.description}
            </p>
            {allergens.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {allergens.map((a) => (
                  <span key={a} className={cn(NEUTRAL_CHIP, "inline-flex items-center gap-1 px-2 py-0.5")}>
                    <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: ALLERGEN_COLORS[a] }} aria-hidden />
                    {a}
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className="flex flex-col items-end gap-2 flex-shrink-0">
            <span className="text-xl md:text-2xl font-light tabular-nums" style={{ color: C.gold }}>
              {item.price} <span className="text-sm">zł</span>
            </span>
            <ChevronDown
              size={16}
              className={cn("transition-transform duration-200", expanded && "rotate-180")}
              style={{ color: "rgba(243,239,234,0.35)" }}
              aria-hidden
            />
          </div>
        </div>

        {expanded && (
          <div className="mt-5 pt-5" style={{ borderTop: "1px solid rgba(182,138,58,0.1)" }}>
            <p className="text-xs uppercase tracking-widest mb-3" style={{ color: "rgba(243,239,234,0.4)" }}>
              Składniki
            </p>
            <div className="flex flex-wrap gap-2">
              {item.ingredients.map((ing, idx) => (
                <span
                  key={idx}
                  className={cn(
                    NEUTRAL_CHIP,
                    "inline-flex items-center gap-1.5 px-3 py-1.5",
                    ing.allergen && "border-[rgba(243,239,234,0.12)]"
                  )}
                >
                  {ing.allergen && <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: ALLERGEN_COLORS[ing.allergen] }} />}
                  {ing.alcohol && <span className="w-1.5 h-1.5 rounded-full shrink-0 bg-[#A855F7]" />}
                  {ing.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════════ */
type DietFilter = "vegan" | "vegetarian";

export function MenuPage() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState<MenuCategory | "Wszystkie">("Wszystkie");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [dietFilter, setDietFilter] = useState<DietFilter[]>([]);
  const [alcoholOnly, setAlcoholOnly] = useState(false);
  const [excludeAllergens, setExcludeAllergens] = useState<Allergen[]>([]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const filtered = MENU_ITEMS.filter((item) => {
    if (activeCategory !== "Wszystkie" && item.category !== activeCategory) return false;
    if (dietFilter.length > 0 && (!item.diet || !dietFilter.includes(item.diet))) return false;
    if (alcoholOnly && !itemHasAlcohol(item)) return false;
    const itemAllergens = getItemAllergens(item);
    if (excludeAllergens.some((a) => itemAllergens.includes(a))) return false;
    return true;
  });

  const hasActiveFilters = dietFilter.length > 0 || alcoholOnly || excludeAllergens.length > 0;
  const filterCount = dietFilter.length + (alcoholOnly ? 1 : 0) + excludeAllergens.length;
  const clearFilters = () => {
    setDietFilter([]);
    setAlcoholOnly(false);
    setExcludeAllergens([]);
    setFilterOpen(false);
  };
  const applyFilters = () => setFilterOpen(false);
  const toggleAllergen = (a: Allergen) => {
    setExcludeAllergens((prev) => (prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]));
  };
  const toggleDiet = (d: DietFilter) => {
    setDietFilter((prev) => (prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]));
  };

  const grouped = MENU_CATEGORIES
    .filter((cat) => activeCategory === "Wszystkie" || cat === activeCategory)
    .map((cat) => ({ cat, items: filtered.filter((i) => i.category === cat) }))
    .filter((g) => g.items.length > 0);

  return (
    <div className="min-h-screen" style={{ backgroundColor: C.dark }}>
      <Navigation />

      {/* Header + toolbar */}
      <div className="px-6 md:px-12">
        <div className="max-w-5xl mx-auto">

          {/* Header: back button left, title+subtitle centered — flex row */}
          <header className="relative flex items-end pt-28 md:pt-32 pb-6">
            {/* Powrót — lewy, wyrównany do dołu tytułu */}
            <button
              type="button"
              onClick={() => navigate("/")}
              className={cn(
                "absolute left-0 bottom-6 inline-flex items-center gap-1.5 text-[12px] tracking-wide transition-all duration-200 outline-none rounded px-1",
                "focus-visible:ring-2 focus-visible:ring-[rgba(182,138,58,0.4)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0E1714]",
                "hover:text-[rgba(243,239,234,0.85)]"
              )}
              style={{ color: "rgba(243,239,234,0.42)" }}
              aria-label="Powrót na stronę główną"
            >
              <ArrowLeft size={13} aria-hidden />
              <span className="hidden sm:inline">Powrót</span>
            </button>

            {/* Tytuł — centrum */}
            <div className="flex-1 text-center">
              <p
                className="text-[11px] uppercase tracking-[0.22em] mb-3"
                style={{ color: C.gold, fontFamily: C.sans, opacity: 0.8 }}
              >
                La Maison Dorée
              </p>
              <h1
                className="text-3xl md:text-4xl lg:text-5xl"
                style={{ fontFamily: C.serif, fontWeight: 300, color: C.cream, letterSpacing: "0.04em", lineHeight: 1.1 }}
              >
                Nasze Menu
              </h1>
              <div className="flex items-center justify-center gap-3 mt-3 mb-3" aria-hidden>
                <div className="h-px flex-1 max-w-[60px]" style={{ backgroundColor: C.gold, opacity: 0.25 }} />
                <div className="w-1 h-1 rounded-full" style={{ backgroundColor: C.gold, opacity: 0.5 }} />
                <div className="h-px flex-1 max-w-[60px]" style={{ backgroundColor: C.gold, opacity: 0.25 }} />
              </div>
              <p
                className="text-[13px] italic"
                style={{ color: "rgba(243,239,234,0.52)", fontFamily: C.serif, letterSpacing: "0.01em" }}
              >
                Sezonowe składniki · techniki francuskie · nowoczesna interpretacja
              </p>
            </div>
          </header>

          {/* Toolbar: kategorie + Filtry w jednej linii, ten sam kontener */}
          <section
            className="sticky top-0 z-30 flex flex-wrap items-center gap-2 py-2.5 -mx-1 px-1 rounded-lg"
            style={{
              backgroundColor: "rgba(14,23,20,0.97)",
              backdropFilter: "blur(10px)",
              boxShadow: "0 1px 0 0 rgba(182,138,58,0.06), 0 4px 12px -2px rgba(0,0,0,0.2)",
            }}
            role="toolbar"
            aria-label="Filtry menu"
          >
            <div className="flex gap-1.5 overflow-x-auto scrollbar-hide flex-1 min-w-0">
              {(["Wszystkie", ...MENU_CATEGORIES] as const).map((cat) => {
                const Icon = cat !== "Wszystkie" ? CATEGORY_ICONS[cat] : null;
                return (
                  <button
                    type="button"
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[13px] font-medium flex-shrink-0 transition-all duration-200 outline-none border",
                      "focus-visible:ring-2 focus-visible:ring-[rgba(182,138,58,0.45)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0E1714]",
                      activeCategory === cat
                        ? "border-[rgba(182,138,58,0.25)] bg-[rgba(182,138,58,0.1)] text-[#B68A3A]"
                        : "border-[rgba(243,239,234,0.08)] bg-transparent text-[rgba(243,239,234,0.72)] hover:bg-[rgba(243,239,234,0.06)] hover:border-[rgba(243,239,234,0.12)]"
                    )}
                    aria-pressed={activeCategory === cat}
                    aria-label={cat === "Wszystkie" ? "Wszystkie kategorie" : `Kategoria: ${cat}`}
                  >
                    {Icon && <Icon size={14} aria-hidden />}
                    {cat}
                  </button>
                );
              })}
            </div>

            <Popover open={filterOpen} onOpenChange={setFilterOpen}>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className={cn(
                    "flex items-center gap-2 px-3 py-1.5 rounded-lg text-[13px] font-medium flex-shrink-0 transition-all duration-200 outline-none border",
                    "focus-visible:ring-2 focus-visible:ring-[rgba(182,138,58,0.45)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0E1714]",
                    "border-[rgba(243,239,234,0.12)] bg-transparent text-[rgba(243,239,234,0.75)] hover:bg-[rgba(243,239,234,0.05)] hover:border-[rgba(243,239,234,0.15)]",
                    hasActiveFilters && "text-[#B68A3A] border-[rgba(182,138,58,0.2)]"
                  )}
                  aria-label={filterCount > 0 ? `Filtry (${filterCount} aktywne). Otwórz` : "Otwórz filtry: dieta, alkohol, alergeny"}
                  aria-expanded={filterOpen}
                  aria-haspopup="true"
                >
                  <SlidersHorizontal size={14} aria-hidden />
                  Filtry{filterCount > 0 ? ` (${filterCount})` : ""}
                </button>
              </PopoverTrigger>
            <PopoverContent
              align="end"
              sideOffset={8}
              className="w-[min(320px,calc(100vw-2rem))] p-0 border-[rgba(243,239,234,0.08)] bg-[#182522] text-[#F3EFEA] shadow-xl"
            >
              <div className="p-4 space-y-5">
                <p className="text-xs font-medium uppercase tracking-wider text-[rgba(243,239,234,0.5)]">Dieta</p>
                <div className="flex flex-wrap gap-2">
                  {(["vegan", "vegetarian"] as const).map((d) => (
                    <button
                      type="button"
                      key={d}
                      onClick={() => toggleDiet(d)}
                      className={cn(
                        NEUTRAL_CHIP,
                        "inline-flex items-center gap-1.5 px-3 py-1.5 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[rgba(182,138,58,0.5)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#182522]",
                        dietFilter.includes(d) && "bg-[rgba(182,138,58,0.12)] border-[rgba(182,138,58,0.25)] text-[#F3EFEA]"
                      )}
                      aria-pressed={dietFilter.includes(d)}
                      aria-label={d === "vegan" ? "Pokaż tylko wegańskie" : "Pokaż tylko wegetariańskie"}
                    >
                      <span className={cn("w-1.5 h-1.5 rounded-full", d === "vegan" ? "bg-[#4CAF50]" : "bg-[#8BC34A]")} aria-hidden />
                      {d === "vegan" ? "Wegan" : "Wege"}
                    </button>
                  ))}
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-[rgba(243,239,234,0.5)] mb-2">Zawiera alkohol</p>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={alcoholOnly}
                    onClick={() => setAlcoholOnly((v) => !v)}
                    className={cn(
                      "relative inline-flex h-7 w-12 shrink-0 rounded-full border transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[rgba(182,138,58,0.5)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#182522]",
                      alcoholOnly ? "border-[rgba(182,138,58,0.3)] bg-[rgba(182,138,58,0.2)]" : "border-[rgba(243,239,234,0.1)] bg-[rgba(243,239,234,0.06)]"
                    )}
                    aria-label={alcoholOnly ? "Wyłącz filtr: tylko z alkoholem" : "Pokaż tylko dania z alkoholem"}
                  >
                    <span
                      className={cn(
                        "pointer-events-none inline-block h-5 w-5 rounded-full bg-[#F3EFEA] shadow transition-transform mt-0.5",
                        alcoholOnly ? "translate-x-6" : "translate-x-1"
                      )}
                    />
                  </button>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-[rgba(243,239,234,0.5)] mb-2">Wyklucz alergeny</p>
                  <div className="flex flex-wrap gap-1.5">
                    {ALLERGENS.map((a) => (
                      <button
                        type="button"
                        key={a}
                        onClick={() => toggleAllergen(a)}
                        className={cn(
                          NEUTRAL_CHIP,
                          "inline-flex items-center gap-1 px-2 py-1 text-[11px] transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[rgba(182,138,58,0.5)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#182522]",
                          excludeAllergens.includes(a) && "bg-[rgba(182,138,58,0.1)] border-[rgba(182,138,58,0.2)]"
                        )}
                        aria-pressed={excludeAllergens.includes(a)}
                        aria-label={excludeAllergens.includes(a) ? `Wyklucz ${a}` : `Nie wykluczaj ${a}`}
                      >
                        <span className="w-1 h-1 rounded-full shrink-0" style={{ backgroundColor: ALLERGEN_COLORS[a] }} aria-hidden />
                        {a}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 pt-2 border-t border-[rgba(243,239,234,0.06)]">
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[rgba(182,138,58,0.5)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#182522] border border-[rgba(243,239,234,0.1)] bg-transparent text-[rgba(243,239,234,0.7)] hover:bg-[rgba(243,239,234,0.06)]"
                    aria-label="Wyczyść wszystkie filtry"
                  >
                    Wyczyść
                  </button>
                  <button
                    type="button"
                    onClick={applyFilters}
                    className="flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[rgba(182,138,58,0.5)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#182522] bg-[#B68A3A] text-[#1E1A16] hover:bg-[#C49A4A]"
                    aria-label="Zastosuj filtry"
                  >
                    Zastosuj
                  </button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </section>
        </div>
      </div>

      {/* Lista dań — mniejszy odstęp od toolbaru, nagłówki left-align, liczba jako badge */}
      <section className="px-6 md:px-12 py-8 md:py-10">
        <div className="max-w-5xl mx-auto space-y-12 text-left">
          {grouped.map(({ cat, items }) => (
            <div key={cat}>
              <div className="flex items-center gap-2 mb-5">
                {(() => {
                  const Icon = CATEGORY_ICONS[cat];
                  return <Icon size={18} style={{ color: C.gold, opacity: 0.85 }} aria-hidden />;
                })()}
                <h2 className="text-xl md:text-2xl" style={{ fontFamily: C.serif, fontWeight: 300, color: C.cream, letterSpacing: "0.02em" }}>
                  {cat}
                </h2>
                <span
                  className="inline-flex items-center justify-center min-w-[1.5rem] h-5 px-1.5 rounded-full text-[11px] font-medium tabular-nums"
                  style={{ backgroundColor: "rgba(243,239,234,0.08)", color: "rgba(243,239,234,0.6)", border: "1px solid rgba(243,239,234,0.08)" }}
                  aria-label={`${items.length} pozycji`}
                >
                  {items.length}
                </span>
              </div>
              <div className="space-y-4">
                {items.map((item) => (
                  <MenuCard
                    key={item.id}
                    item={item}
                    expanded={expandedId === item.id}
                    onToggle={() => setExpandedId(expandedId === item.id ? null : item.id)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer info */}
      <footer className="px-6 md:px-12 py-14">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex flex-wrap justify-center gap-8 text-sm" style={{ color: "rgba(243,239,234,0.5)" }}>
            <div className="flex items-center gap-2">
              <MapPin size={14} style={{ color: C.gold, opacity: 0.7 }} />
              <span>ul. Złota 59, Warszawa</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone size={14} style={{ color: C.gold, opacity: 0.7 }} />
              <span>+48 22 123 45 67</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={14} style={{ color: C.gold, opacity: 0.7 }} />
              <span>Wt–Nd 18:00–23:00</span>
            </div>
          </div>
          <p className="text-center text-xs mt-8" style={{ color: "rgba(243,239,234,0.25)" }}>
            Menu może ulec zmianie w zależności od dostępności sezonowych składników
          </p>
        </div>
      </footer>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
