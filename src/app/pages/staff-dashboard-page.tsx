import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router";
import {
  Users, Clock, Wine, Star, AlertCircle, ChevronRight,
  CheckCircle, Bell, Utensils, X, RefreshCw,
  User, CalendarCheck, Heart, ShieldCheck,
  ArrowRight, Coffee, Phone, Smartphone, Mail,
  LayoutGrid, Map as MapIcon, BookOpen, ClipboardList, Search,
  ChevronDown, Plus, Trash2, Edit3, Send, ToggleLeft, ToggleRight,
  LogOut, Menu,
} from "lucide-react";
import restauracjaSvg from "@/assets/restauracja.svg?url";

/* ══════════════════════════════════════════════════════════
   DESIGN TOKENS
══════════════════════════════════════════════════════════ */
const C = {
  gold: "#B68A3A",
  cream: "#F3EFEA",
  dark: "#0A100D",
  card: "#131C18",
  border: "rgba(243,239,234,0.07)",
  sans: "Inter, sans-serif",
};

/* ══════════════════════════════════════════════════════════
   ALLERGENS
══════════════════════════════════════════════════════════ */
const ALLERGENS = [
  "Gluten", "Laktoza", "Jaja", "Ryby", "Skorupiaki", "Orzechy",
  "Soja", "Seler", "Gorczyca", "Sezam", "Mięczaki", "Łubin",
] as const;
type Allergen = typeof ALLERGENS[number];

const ALLERGEN_COLORS: Record<string, string> = {
  Gluten: "#E8843A", Laktoza: "#7AAFE8", Jaja: "#F6BF60", Ryby: "#60C275",
  Skorupiaki: "#F28B82", Orzechy: "#D4A843", Soja: "#A3D977", Seler: "#8BC9A3",
  Gorczyca: "#E8D843", Sezam: "#C9A86C", Mięczaki: "#7A8FE8", Łubin: "#C77AD4",
};

/* ══════════════════════════════════════════════════════════
   RESTAURANT MENU
══════════════════════════════════════════════════════════ */
interface Ingredient {
  name: string;
  allergen?: Allergen;
  alcohol?: boolean;
}

type DietType = "vegetarian" | "vegan";

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
      { name: "sól maldon" },
    ],
  },
  {
    id: "m4", name: "Bisque z homara", price: 48, category: "Zupy",
    description: "Aksamitna zupa z homara z kroplą koniaku i kremem śmietanowym.",
    ingredients: [
      { name: "homar", allergen: "Skorupiaki" }, { name: "śmietana", allergen: "Laktoza" },
      { name: "koniak", alcohol: true }, { name: "marchewka" }, { name: "seler naciowy", allergen: "Seler" },
      { name: "masło", allergen: "Laktoza" }, { name: "tymianek" },
    ],
  },
  {
    id: "m5", name: "Consommé z grzybami leśnymi", price: 38, category: "Zupy",
    description: "Klarowny bulion wołowy z sezonowymi grzybami leśnymi i kluseczkami.",
    ingredients: [
      { name: "bulion wołowy" }, { name: "borowiki" }, { name: "kurki" },
      { name: "kluseczki", allergen: "Gluten" }, { name: "jaja", allergen: "Jaja" },
      { name: "szczypiorek" },
    ],
  },
  {
    id: "m6", name: "Risotto truflowe", price: 78, category: "Dania główne", diet: "vegetarian",
    description: "Kremowe risotto z czarną truflą, parmezanem i masłem truflowym.",
    ingredients: [
      { name: "ryż arborio" }, { name: "trufla czarna" },
      { name: "parmezan", allergen: "Laktoza" }, { name: "masło", allergen: "Laktoza" },
      { name: "wino białe", alcohol: true }, { name: "bulion warzywny" }, { name: "szalotka" },
    ],
  },
  {
    id: "m7", name: "Polędwica wołowa Wellington", price: 128, category: "Dania główne",
    description: "Polędwica w cieście francuskim z duxelles grzybowym i foie gras.",
    ingredients: [
      { name: "polędwica wołowa" }, { name: "ciasto francuskie", allergen: "Gluten" },
      { name: "pieczarki" }, { name: "wątroba kacza" }, { name: "musztarda", allergen: "Gorczyca" },
      { name: "jaja", allergen: "Jaja" }, { name: "masło", allergen: "Laktoza" },
    ],
  },
  {
    id: "m8", name: "Dorsz konfitowany w oliwie", price: 88, category: "Dania główne",
    description: "Dorsz wolno gotowany w oliwie z puree z selera i sosem beurre blanc.",
    ingredients: [
      { name: "dorsz", allergen: "Ryby" }, { name: "oliwa z oliwek" },
      { name: "seler korzeniowy", allergen: "Seler" }, { name: "masło", allergen: "Laktoza" },
      { name: "śmietana", allergen: "Laktoza" }, { name: "wino białe", alcohol: true }, { name: "cytryna" },
    ],
  },
  {
    id: "m9", name: "Kaczka confit z purée", price: 96, category: "Dania główne",
    description: "Udko kacze confit z purée ziemniaczanym, konfiturą wiśniową i jus.",
    ingredients: [
      { name: "udko kacze" }, { name: "tłuszcz kaczy" },
      { name: "ziemniaki" }, { name: "masło", allergen: "Laktoza" },
      { name: "śmietana", allergen: "Laktoza" }, { name: "wiśnie" }, { name: "tymianek" },
    ],
  },
  {
    id: "m10", name: "Rack of Lamb", price: 118, category: "Dania główne",
    description: "Karczek jagnięcy z ziołową panierką, ratatouille i sosem demi-glace.",
    ingredients: [
      { name: "jagnięcina" }, { name: "bułka tarta", allergen: "Gluten" },
      { name: "zioła prowansalskie" }, { name: "cukinia" }, { name: "bakłażan" },
      { name: "pomidory" }, { name: "musztarda", allergen: "Gorczyca" },
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
      { name: "lody waniliowe", allergen: "Laktoza" },
    ],
  },
  {
    id: "m13", name: "Tarte Tatin", price: 38, category: "Desery",
    description: "Odwrócona tarta jabłkowa z karmelizowanymi jabłkami i lodami śmietankowymi.",
    ingredients: [
      { name: "jabłka" }, { name: "ciasto kruche", allergen: "Gluten" },
      { name: "masło", allergen: "Laktoza" }, { name: "cukier" },
      { name: "lody śmietankowe", allergen: "Laktoza" },
    ],
  },
  {
    id: "m19", name: "Bruschetta z awokado i pomidorami", price: 36, category: "Przystawki", diet: "vegetarian",
    description: "Chrupiąca ciabatta z kremem z awokado, pomidorami cherry i bazylią.",
    ingredients: [
      { name: "ciabatta", allergen: "Gluten" }, { name: "awokado" },
      { name: "pomidory cherry" }, { name: "bazylia" }, { name: "oliwa z oliwek" }, { name: "czosnek" },
    ],
  },
  {
    id: "m20", name: "Bowl z pieczonymi warzywami", price: 52, category: "Dania główne", diet: "vegan",
    description: "Komosa ryżowa z pieczonymi warzywami sezonowymi, hummusem i tahini.",
    ingredients: [
      { name: "komosa ryżowa" }, { name: "bataty" }, { name: "cukinia" },
      { name: "ciecierzyca" }, { name: "tahini", allergen: "Sezam" }, { name: "cytryna" },
    ],
  },
  {
    id: "m21", name: "Ravioli szpinakowe z ricottą", price: 62, category: "Dania główne", diet: "vegetarian",
    description: "Domowy makaron z nadzieniem szpinakowym i ricottą w sosie maślanym z szałwią.",
    ingredients: [
      { name: "mąka", allergen: "Gluten" }, { name: "jaja", allergen: "Jaja" },
      { name: "szpinak" }, { name: "ricotta", allergen: "Laktoza" },
      { name: "masło", allergen: "Laktoza" }, { name: "szałwia" },
    ],
  },
  {
    id: "m22", name: "Sorbet z mango i marakui", price: 28, category: "Desery", diet: "vegan",
    description: "Orzeźwiający sorbet z mango i marakui z miętą i chipsem kokosowym.",
    ingredients: [
      { name: "mango" }, { name: "marakuja" }, { name: "cukier" }, { name: "mięta" }, { name: "wiórki kokosowe" },
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
    id: "m16", name: "Negroni Classico", price: 38, category: "Koktajle",
    description: "Gin, Campari, słodki wermut — klasyczna proporcja 1:1:1.",
    ingredients: [{ name: "gin", alcohol: true }, { name: "Campari", alcohol: true }, { name: "wermut słodki", alcohol: true }],
  },
  {
    id: "m17", name: "Old Fashioned", price: 42, category: "Koktajle",
    description: "Bourbon, angostura, cukier trzcinowy, skórka pomarańczy.",
    ingredients: [{ name: "bourbon", alcohol: true }, { name: "angostura" }, { name: "cukier trzcinowy" }, { name: "pomarańcza" }],
  },
  {
    id: "m18", name: "Champagne Coupe", price: 48, category: "Koktajle",
    description: "Kieliszek szampana z domową konfiturą malinową.",
    ingredients: [{ name: "szampan", alcohol: true }, { name: "konfitury malinowe" }],
  },
];

const MENU_CATEGORIES: MenuCategory[] = ["Przystawki", "Zupy", "Dania główne", "Desery", "Napoje", "Koktajle"];

/* ══════════════════════════════════════════════════════════
   STATUS SYSTEM  —  brighter, scannable colours
══════════════════════════════════════════════════════════ */
type TableStatus =
  | "upcoming"
  | "seated"
  | "ordering"
  | "last-round"
  | "leaving"
  | "available";

interface StatusMeta {
  label: string;
  color: string;
  bg: string;
  stripe: string;
  priority: number; // lower = needs attention sooner
}

const STATUS: Record<TableStatus, StatusMeta> = {
  leaving:      { label: "Kończy wizytę",    color: "#F28B82", bg: "rgba(242,139,130,0.07)", stripe: "#F28B82", priority: 1 },
  "last-round": { label: "Ostatnia kolejka", color: "#E8843A", bg: "rgba(232,132,58,0.07)",  stripe: "#E8843A", priority: 2 },
  upcoming:     { label: "Przybywa wkrótce", color: "#7AAFE8", bg: "rgba(122,175,232,0.07)", stripe: "#7AAFE8", priority: 3 },
  ordering:     { label: "Zamówienie",       color: "#D4A843", bg: "rgba(212,168,67,0.07)",  stripe: "#D4A843", priority: 4 },
  seated:       { label: "Przy stole",       color: "#60C275", bg: "rgba(96,194,117,0.07)",  stripe: "#60C275", priority: 5 },
  available:    { label: "Wolny",            color: "rgba(243,239,234,0.25)", bg: "rgba(243,239,234,0.025)", stripe: "rgba(243,239,234,0.12)", priority: 6 },
};

/* ══════════════════════════════════════════════════════════
   TYPES
══════════════════════════════════════════════════════════ */
interface Refill {
  number: number;
  time: string;
  served: boolean;
}

interface DrinkOrder {
  item: string;
  time: string;
  served?: boolean;
  notes?: string;
  refills?: Refill[];
}

interface FoodOrder {
  item: string;
  time: string;
  served?: boolean;
  notes?: string;
}

interface TableData {
  id: string;
  number: string;
  section: "Okno" | "Sala" | "Boks";
  capacity: number;
  status: TableStatus;
  guestName?: string;
  partySize?: number;
  arrivalTime?: string;
  seatedAt?: string;
  reservationCode?: string;
  notes?: string[];
  vip?: boolean;
  celebration?: string;
  allergies?: string[];
  drinkOrders?: DrinkOrder[];
  foodOrders?: FoodOrder[];
  winePairing?: boolean;
  tastingMenu?: boolean;
  lastDrinkTime?: string;
  turnsIn?: number;
  flagged?: boolean;
}

/* ══════════════════════════════════════════════════════════
   MOCK DATA
══════════════════════════════════════════════════════════ */
const INITIAL_TABLES: TableData[] = [
  // OKNO — O1–O4 (4-osobowe, okrągłe)
  {
    id: "1", number: "O1", section: "Okno", capacity: 4, status: "seated",
    guestName: "Beaumont", partySize: 3, arrivalTime: "19:30", seatedAt: "19:32",
    reservationCode: "LMD-7B2MN",
    drinkOrders: [
      { item: "Chablis 1er Cru", time: "34 min temu", served: true },
      { item: "Woda gazowana", time: "34 min temu", served: true, refills: [{ number: 1, time: "10 min temu", served: true }] },
      { item: "Woda gazowana", time: "34 min temu", served: true },
    ],
    foodOrders: [
      { item: "Tatar z polędwicy wołowej", time: "30 min temu", served: true },
      { item: "Risotto truflowe", time: "30 min temu", served: false },
      { item: "Risotto truflowe", time: "30 min temu", served: false },
      { item: "Stek z polędwicy", time: "30 min temu", served: false },
    ],
    winePairing: true, lastDrinkTime: "34 min temu", turnsIn: 55,
    notes: ["Stały gość — preferuje wodę niegazowaną"],
    vip: true,
  },
  {
    id: "2", number: "O2", section: "Okno", capacity: 4, status: "ordering",
    guestName: "Leclerc", partySize: 4, arrivalTime: "19:30", seatedAt: "19:38",
    reservationCode: "LMD-9D4PQ",
    drinkOrders: [
      { item: "Champagne (btl)", time: "22 min temu", served: true },
      { item: "Woda gazowana", time: "22 min temu", served: true, refills: [{ number: 1, time: "10 min temu", served: true }] },
      { item: "Woda gazowana", time: "22 min temu", served: true, refills: [{ number: 1, time: "3 min temu", served: false }] },
      { item: "Woda gazowana", time: "22 min temu", served: true },
      { item: "Woda gazowana", time: "22 min temu", served: true },
    ],
    foodOrders: [
      { item: "Foie gras z konfiturą figową", time: "18 min temu", served: true },
      { item: "Foie gras z konfiturą figową", time: "18 min temu", served: true },
      { item: "Polędwica wołowa Wellington", time: "18 min temu", served: false },
      { item: "Polędwica wołowa Wellington", time: "18 min temu", served: false },
      { item: "Kaczka confit z purée", time: "18 min temu", served: false },
      { item: "Kaczka confit z purée", time: "18 min temu", served: false },
    ],
    celebration: "Rocznica", lastDrinkTime: "22 min temu", turnsIn: 70,
    notes: ["Rocznica — tort zamówiony przez kuchnię"],
  },
  {
    id: "3", number: "O3", section: "Okno", capacity: 4, status: "upcoming",
    guestName: "Nowak", partySize: 3, arrivalTime: "20:00",
    reservationCode: "LMD-2K8RS",
    allergies: ["Skorupiaki"],
    notes: ["Alergia na skorupiaki — kuchnia powiadomiona"],
  },
  {
    id: "13", number: "O4", section: "Okno", capacity: 4, status: "available",
  },
  // SALA — S1–S4 (4-osobowe, okrągłe) + S5–S6 (8-osobowe, prostokątne)
  {
    id: "6", number: "S1", section: "Sala", capacity: 4, status: "available",
  },
  {
    id: "7", number: "S2", section: "Sala", capacity: 4, status: "upcoming",
    guestName: "Zieliński", partySize: 3, arrivalTime: "20:15",
    reservationCode: "LMD-8G3XY",
    celebration: "Urodziny",
    notes: ["Urodziny — mały deser ze świeczką przygotowany"],
  },
  {
    id: "8", number: "S3", section: "Sala", capacity: 4, status: "ordering",
    guestName: "Kamiński", partySize: 4, arrivalTime: "19:45", seatedAt: "19:55",
    reservationCode: "LMD-4J9ZA",
    drinkOrders: [
      { item: "Burgundy Pinot (btl)", time: "5 min temu", served: true },
      { item: "Woda niegazowana", time: "20 min temu", served: true },
      { item: "Woda niegazowana", time: "20 min temu", served: true },
      { item: "Woda niegazowana", time: "20 min temu", served: true },
      { item: "Woda niegazowana", time: "20 min temu", served: true },
    ],
    foodOrders: [
      { item: "Bisque z homara", time: "15 min temu", served: true },
      { item: "Bisque z homara", time: "15 min temu", served: true },
      { item: "Rack of Lamb", time: "15 min temu", served: false },
      { item: "Rack of Lamb", time: "15 min temu", served: false },
      { item: "Dorsz konfitowany w oliwie", time: "15 min temu", served: false },
      { item: "Dorsz konfitowany w oliwie", time: "15 min temu", served: false },
    ],
    lastDrinkTime: "5 min temu", turnsIn: 80,
  },
  {
    id: "9", number: "S4", section: "Sala", capacity: 4, status: "available",
  },
  {
    id: "10", number: "S5", section: "Sala", capacity: 8, status: "seated",
    guestName: "Kowalski", partySize: 7, arrivalTime: "19:30", seatedAt: "19:35",
    reservationCode: "LMD-1V5CB",
    vip: true, tastingMenu: true, winePairing: true,
    drinkOrders: [
      { item: "Dobór win (×7)", time: "30 min temu" },
      { item: "Wybór aperitifów", time: "45 min temu" },
    ],
    lastDrinkTime: "30 min temu", turnsIn: 75,
    notes: ["VIP — konto korporacyjne", "Preferuje brak przerw między daniami"],
    allergies: ["Orzechy"],
  },
  {
    id: "5", number: "S6", section: "Sala", capacity: 8, status: "seated",
    guestName: "Wiśniewski", partySize: 5, arrivalTime: "19:45", seatedAt: "19:50",
    reservationCode: "LMD-3H6UV",
    tastingMenu: true,
    drinkOrders: [{ item: "Dobór win (×5)", time: "18 min temu" }],
    winePairing: true, lastDrinkTime: "18 min temu", turnsIn: 90,
  },
  // BOKSY — B1–B3 (6-osobowe, prostokątne)
  {
    id: "4", number: "B1", section: "Boks", capacity: 6, status: "last-round",
    guestName: "Krawczyk", partySize: 4, arrivalTime: "18:45", seatedAt: "18:50",
    reservationCode: "LMD-5F1TW",
    drinkOrders: [
      { item: "Digestif", time: "12 min temu" },
      { item: "Digestif", time: "12 min temu" },
      { item: "Digestif", time: "12 min temu" },
      { item: "Digestif", time: "12 min temu" },
    ],
    lastDrinkTime: "12 min temu", turnsIn: 20,
  },
  {
    id: "11", number: "B2", section: "Boks", capacity: 6, status: "seated",
    partySize: 2, seatedAt: "19:50",
    drinkOrders: [
      { item: "Negroni", time: "10 min temu" },
      { item: "Negroni", time: "10 min temu" },
    ],
    lastDrinkTime: "10 min temu",
  },
  {
    id: "12", number: "B3", section: "Boks", capacity: 6, status: "leaving",
    guestName: "Mazur", partySize: 3, arrivalTime: "18:30", seatedAt: "18:35",
    reservationCode: "LMD-6P2DE",
    turnsIn: 5,
    drinkOrders: [
      { item: "Calvados", time: "28 min temu" },
      { item: "Calvados", time: "28 min temu" },
      { item: "Calvados", time: "28 min temu" },
    ],
    lastDrinkTime: "28 min temu",
    notes: ["Prośba o rachunek"],
  },
];

const UPCOMING: { name: string; party: number; time: string; mins: number; table: string; note?: string; celebration?: string; reminderSent?: boolean }[] = [
  { name: "Nowak",      party: 3, time: "20:00", mins: 14, table: "O3", note: "Alergia na skorupiaki", reminderSent: true },
  { name: "Zieliński",  party: 3, time: "20:15", mins: 29, table: "S2", celebration: "Urodziny", reminderSent: true },
  { name: "Kamińska",   party: 4, time: "20:30", mins: 44, table: "S4", reminderSent: true },
  { name: "Wójcik",     party: 5, time: "21:00", mins: 74, table: "B1", reminderSent: false },
];

/* ══════════════════════════════════════════════════════════
   HOOKS
══════════════════════════════════════════════════════════ */
function useClock() {
  const [t, setT] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setT(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return t.toLocaleTimeString("pl-PL", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

/* ══════════════════════════════════════════════════════════
   CARD GRID — measures children and applies uniform row height
══════════════════════════════════════════════════════════ */
function CardGrid({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [rowH, setRowH] = useState<number | undefined>(undefined);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => {
      const cards = Array.from(el.children) as HTMLElement[];
      if (cards.length === 0) return;
      let max = 0;
      cards.forEach((c) => {
        c.style.minHeight = "0px";
      });
      requestAnimationFrame(() => {
        cards.forEach((c) => { if (c.offsetHeight > max) max = c.offsetHeight; });
        setRowH(max);
      });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [children]);

  return (
    <div
      ref={ref}
      className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 pb-4"
      style={rowH ? { gridAutoRows: `${rowH}px` } : undefined}
    >
      {children}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   SMALL UI PIECES
══════════════════════════════════════════════════════════ */
function Badge({ label, color, bg, border }: { label: string; color: string; bg: string; border?: string }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap"
      style={{ backgroundColor: bg, color, border: border ?? `1px solid ${color}25` }}
    >
      {label}
    </span>
  );
}

function Chip({ children, icon: Icon, color = "rgba(243,239,234,0.5)", bg = "rgba(243,239,234,0.04)" }: {
  children: React.ReactNode;
  icon?: React.ComponentType<{ size: number; style?: React.CSSProperties }>;
  color?: string;
  bg?: string;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs" style={{ color, backgroundColor: bg, fontWeight: 400 }}>
      {Icon && <Icon size={12} style={{ color, opacity: 0.8 }} />}
      {children}
    </span>
  );
}

/* ══════════════════════════════════════════════════════════
   STAT CARD
══════════════════════════════════════════════════════════ */
function StatCard({ value, label, accent }: { value: number; label: string; accent: string }) {
  return (
    <div
      className="rounded-xl px-4 py-3 text-center flex-1 min-w-0"
      style={{ backgroundColor: "rgba(243,239,234,0.025)", border: `1px solid ${C.border}` }}
    >
      <div className="text-3xl font-light mb-0.5" style={{ fontFamily: C.sans, color: accent }}>{value}</div>
      <div className="text-[11px] uppercase tracking-widest font-medium" style={{ color: "rgba(243,239,234,0.35)" }}>{label}</div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   ALERT BANNER — urgent items at top
══════════════════════════════════════════════════════════ */
function AlertBanner({ tables }: { tables: TableData[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef(0);
  const scrollLeftStart = useRef(0);

  // Tylko czerwone: kończące wizytę (najbliższy czas na początku); przewijanie: złap i przeciągnij
  const leavingTables = tables
    .filter((t) => t.status === "leaving" || (t.status === "last-round" && (t.turnsIn ?? 99) <= 15))
    .sort((a, b) => (a.turnsIn ?? 99) - (b.turnsIn ?? 99));

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    const rect = scrollRef.current.getBoundingClientRect();
    startX.current = e.clientX - rect.left;
    scrollLeftStart.current = scrollRef.current.scrollLeft;
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!scrollRef.current) return;
    const el = scrollRef.current;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const walk = x - startX.current;
    el.scrollLeft = scrollLeftStart.current - walk;
    e.preventDefault();
  }, []);

  const handleMouseUp = useCallback(() => setIsDragging(false), []);

  useEffect(() => {
    if (!isDragging) return;
    document.addEventListener("mousemove", handleMouseMove, { passive: false });
    document.addEventListener("mouseup", handleMouseUp);
    document.body.style.cursor = "grabbing";
    document.body.style.userSelect = "none";
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  if (leavingTables.length === 0) return null;

        return (
          <div
      ref={scrollRef}
      role="region"
      aria-label="Stoliki kończące wizytę — przeciągnij, aby przewinąć"
      className="flex gap-2 overflow-x-auto overflow-y-hidden py-2 px-1 min-w-0 w-full scrollbar-hide cursor-grab active:cursor-grabbing"
      style={{ scrollBehavior: isDragging ? "auto" : "smooth" }}
      onMouseDown={handleMouseDown}
    >
      {leavingTables.map((t) => (
        <div
          key={t.id}
          className="flex items-center gap-2 px-3 py-2 rounded-lg whitespace-nowrap flex-shrink-0 text-sm pointer-events-none select-none"
          style={{
            backgroundColor: "rgba(242,139,130,0.1)",
            border: "1px solid rgba(242,139,130,0.3)",
            color: "#F28B82",
          }}
        >
          <Clock size={15} style={{ color: "#F28B82", flexShrink: 0 }} />
          {`St. ${t.number} ${t.guestName ? `(${t.guestName})` : ""} — kończy wizytę${t.turnsIn != null ? `, ~${t.turnsIn} min` : ""}`}
          </div>
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   TABLE CARD  —  large, readable, action-ready
══════════════════════════════════════════════════════════ */
function TableCard({
  table,
  selected,
  onSelect,
  onAction,
}: {
  table: TableData;
  selected: boolean;
  onSelect: () => void;
  onAction: (id: string, action: string) => void;
}) {
  const s = STATUS[table.status];
  const isAvailable = table.status === "available";
  const hasAlerts = (table.allergies?.length ?? 0) > 0 || !!table.celebration || !!table.vip;
  const [walkinSize, setWalkinSize] = useState(1);

  const quickAction: { label: string; action: string } | null = (() => {
    switch (table.status) {
      case "available": return { label: "Obsadź stolik", action: `walkin:${walkinSize}` };
      case "upcoming": return { label: "Obsadzono", action: "seated" };
      case "seated": return { label: "Zamówienie przyjęte", action: "ordering" };
      case "ordering": return { label: "Ostatnia kolejka", action: "last-round" };
      case "last-round": return { label: "Kończy wizytę", action: "leaving" };
      case "leaving": return { label: "Zwolnij stolik", action: "available" };
      default: return null;
    }
  })();

  return (
    <div
      onClick={onSelect}
      className="rounded-xl overflow-hidden cursor-pointer transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] flex flex-col h-full"
      style={{
        backgroundColor: selected ? "rgba(182,138,58,0.06)" : C.card,
        border: selected ? "1px solid rgba(182,138,58,0.35)" : `1px solid ${C.border}`,
        boxShadow: selected ? "0 0 0 1px rgba(182,138,58,0.15), 0 4px 20px rgba(0,0,0,0.2)" : "0 2px 12px rgba(0,0,0,0.15)",
      }}
    >
      {/* Top: colored status stripe */}
      <div className="h-1" style={{ backgroundColor: table.flagged ? "#F28B82" : s.stripe, animation: table.flagged ? "flagPulse 1.5s ease-in-out infinite" : "none" }} />

      <div className="p-4 flex-1 flex flex-col">
        {/* Row 1: Table number + Guest + Badges */}
        <div className="flex items-start gap-3 mb-3">
          {/* Table number — big, colored */}
          <div
            className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 text-base font-semibold"
            style={{ backgroundColor: s.bg, color: s.color, border: `1px solid ${s.stripe}40` }}
          >
            {table.number}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-base font-medium truncate" style={{ color: C.cream }}>
                {table.guestName ?? (isAvailable ? "Wolny stolik" : "Bez rezerwacji")}
              </span>
              {table.vip && (
                <span
                  className="text-[10px] px-2 py-0.5 rounded font-bold tracking-wider"
                  style={{ backgroundColor: "rgba(182,138,58,0.18)", color: C.gold, border: "1px solid rgba(182,138,58,0.3)" }}
                >
                  VIP
                </span>
              )}
              {table.flagged && (
                <span
                  className="text-[10px] px-2 py-0.5 rounded font-bold tracking-wider flex items-center gap-1"
                  style={{ backgroundColor: "rgba(242,139,130,0.15)", color: "#F28B82", border: "1px solid rgba(242,139,130,0.3)" }}
                >
                  <AlertCircle size={10} /> PILNE
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 mt-1 text-sm overflow-hidden" style={{ color: "rgba(243,239,234,0.45)", flexWrap: "nowrap", whiteSpace: "nowrap" }}>
              <span className="shrink-0">{table.section}</span>
              {table.partySize && (
                <>
                  <span className="shrink-0" style={{ color: "rgba(243,239,234,0.2)" }}>·</span>
                  <span className="flex items-center gap-1 shrink-0"><Users size={12} /> {table.partySize} os.</span>
                </>
              )}
              {table.capacity && (
                <>
                  <span className="shrink-0" style={{ color: "rgba(243,239,234,0.2)" }}>·</span>
                  <span className="shrink-0">maks. {table.capacity}</span>
                </>
              )}
            </div>
          </div>

          {/* Status badge — right side */}
          <Badge label={s.label} color={s.color} bg={s.bg} />
        </div>

        {/* Row 2: Alert chips */}
        {hasAlerts && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {table.celebration && (
              <Chip icon={Heart} color="#F6BF60" bg="rgba(246,191,96,0.1)">
                {table.celebration}
              </Chip>
            )}
            {(table.allergies?.length ?? 0) > 0 && (
              <Chip icon={AlertCircle} color="#F28B82" bg="rgba(242,139,130,0.1)">
                {table.allergies!.join(", ")}
              </Chip>
            )}
            {table.tastingMenu && (
              <Chip icon={Utensils} color={C.gold} bg="rgba(182,138,58,0.08)">
                Degustacja
              </Chip>
            )}
            {table.winePairing && (
              <Chip icon={Wine} color={C.gold} bg="rgba(182,138,58,0.08)">
                Dobór win
              </Chip>
            )}
          </div>
        )}

        {/* Row 3: Time info + last drink */}
        {!isAvailable && (
          <div className="flex items-center gap-4 text-sm mb-3" style={{ color: "rgba(243,239,234,0.4)" }}>
            {(table.arrivalTime || table.seatedAt) && (
              <span className="flex items-center gap-1.5">
                <Clock size={13} />
                {table.status === "upcoming"
                  ? <span>rez. <strong style={{ color: "rgba(243,239,234,0.7)" }}>{table.arrivalTime}</strong></span>
                  : table.seatedAt
                    ? <span>od <strong style={{ color: "rgba(243,239,234,0.7)" }}>{table.seatedAt}</strong></span>
                    : <span>{table.arrivalTime}</span>
                }
              </span>
            )}
            {table.lastDrinkTime && (
              <span className="flex items-center gap-1.5">
                <Wine size={13} />
                {table.lastDrinkTime}
              </span>
            )}
            {table.turnsIn !== undefined && table.turnsIn <= 30 && (
              <span className="flex items-center gap-1.5" style={{ color: table.turnsIn <= 10 ? "#F28B82" : "#E8843A" }}>
                <ArrowRight size={13} />
                ~{table.turnsIn} min
              </span>
            )}
          </div>
        )}

        {/* Row 4: Pending (unserved) orders inline */}
        {(() => {
          const skipPatterns = /^dobór win|^wybór aperitif/i;
          const pending = [
            ...(table.foodOrders ?? []).filter((o) => !o.served).map((o) => o.item),
            ...(table.drinkOrders ?? []).filter((o) => !o.served && !skipPatterns.test(o.item)).map((o) => o.item),
          ];
          if (pending.length === 0) return null;
          const shown = pending.slice(0, 2);
          const rest = pending.length - shown.length;
          return (
            <div className="flex items-center gap-1.5 mb-3 overflow-hidden">
              {shown.map((name, i) => (
              <span
                key={i}
                  className="text-xs px-2 py-0.5 rounded truncate shrink-0 max-w-[45%]"
                style={{ color: "rgba(243,239,234,0.5)", backgroundColor: "rgba(243,239,234,0.04)", border: `1px solid ${C.border}` }}
              >
                  {name}
              </span>
            ))}
              {rest > 0 && (
                <span className="text-xs px-2 py-0.5 rounded shrink-0" style={{ color: "rgba(243,239,234,0.3)" }}>
                  +{rest}
              </span>
            )}
          </div>
          );
        })()}

        {/* Row 5: Notes preview */}
        {(table.notes?.length ?? 0) > 0 && (
          <p className="text-sm mb-3 line-clamp-1" style={{ color: "rgba(243,239,234,0.4)", fontStyle: "italic" }}>
            📝 {table.notes![0]}
          </p>
        )}

        {/* Walk-in party size picker */}
        {isAvailable && (
          <div className="mb-3" onClick={(e) => e.stopPropagation()}>
            <span className="text-[10px] uppercase tracking-wider font-medium block mb-2" style={{ color: "rgba(243,239,234,0.3)" }}>Liczba osób</span>
            <div className="flex items-center gap-1">
              {Array.from({ length: table.capacity }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  onClick={() => setWalkinSize(n)}
                  className="w-8 h-8 rounded-lg text-xs font-medium transition-all duration-150"
                  style={{
                    backgroundColor: walkinSize === n ? "rgba(167,139,250,0.15)" : "rgba(243,239,234,0.03)",
                    color: walkinSize === n ? "#A78BFA" : "rgba(243,239,234,0.35)",
                    border: walkinSize === n ? "1px solid rgba(167,139,250,0.35)" : `1px solid ${C.border}`,
                  }}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Quick action button */}
        <div className="mt-auto">
        {quickAction && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAction(table.id, quickAction.action);
            }}
            className="w-full py-2.5 rounded-lg text-sm font-medium transition-all duration-150 active:scale-[0.97] flex items-center justify-center gap-2"
            style={{
              backgroundColor: isAvailable ? "rgba(167,139,250,0.1)" : s.stripe + "18",
              color: isAvailable ? "#A78BFA" : s.color,
              border: isAvailable ? "1px solid rgba(167,139,250,0.25)" : `1px solid ${s.stripe}35`,
            }}
          >
            {isAvailable ? <Users size={15} /> : <ChevronRight size={15} />}
            {quickAction.label}
          </button>
        )}
        </div>

        {/* Visit progress bar — fills as status advances */}
        {!isAvailable && (() => {
          const stages: TableStatus[] = ["upcoming", "seated", "ordering", "last-round", "leaving"];
          const idx = stages.indexOf(table.status);
          if (idx === -1) return null;
          const pct = ((idx + 1) / stages.length) * 100;
          const barColor =
            idx === 0 ? "#7AAFE8" :
            idx === 1 ? "#60C275" :
            idx === 2 ? "#D4A843" :
            idx === 3 ? "#E8843A" :
            "#F28B82";
          return (
            <div className="mt-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] uppercase tracking-wider font-medium" style={{ color: "rgba(243,239,234,0.3)" }}>
                  Postęp wizyty
                </span>
                <span className="text-[10px] tabular-nums font-medium" style={{ color: barColor }}>
                  {idx + 1}/{stages.length}
                </span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "rgba(243,239,234,0.06)" }}>
                <div
                  className="h-full rounded-full"
              style={{
                    width: `${pct}%`,
                    backgroundColor: barColor,
                    transition: "width 0.8s ease-in-out, background-color 0.5s ease",
              }}
            />
          </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   ORDER GROUPING HELPERS
══════════════════════════════════════════════════════════ */
interface OrderGroupItem<T> {
  realIndex: number;
  data: T;
}
interface OrderGroup<T> {
  key: string;
  name: string;
  items: OrderGroupItem<T>[];
  times: string[];
}

function groupOrders<T extends { item: string; time: string; served?: boolean }>(
  orders: T[]
): OrderGroup<T>[] {
  const batchMap = new Map<string, OrderGroup<T>>();
  orders.forEach((o, i) => {
    const batchKey = `${o.item}|||${o.time}`;
    if (!batchMap.has(batchKey)) {
      batchMap.set(batchKey, { key: batchKey, name: o.item, items: [], times: [o.time] });
    }
    batchMap.get(batchKey)!.items.push({ realIndex: i, data: o });
  });

  const batches = Array.from(batchMap.values());

  const nameMap = new Map<string, OrderGroup<T>[]>();
  batches.forEach((b) => {
    if (!nameMap.has(b.name)) nameMap.set(b.name, []);
    nameMap.get(b.name)!.push(b);
  });

  const result: OrderGroup<T>[] = [];
  const merged = new Set<string>();

  nameMap.forEach((groups, name) => {
    if (groups.length > 1) {
      const allServed = groups.every((g) => g.items.every((it) => it.data.served));
      if (allServed) {
        const allItems = groups.flatMap((g) => g.items);
        const allTimes = groups.flatMap((g) => g.times);
        const mergedKey = `merged|||${name}`;
        result.push({ key: mergedKey, name, items: allItems, times: [...new Set(allTimes)] });
        groups.forEach((g) => merged.add(g.key));
      }
    }
  });

  batches.forEach((b) => {
    if (!merged.has(b.key)) result.push(b);
  });

  result.sort((a, b) => {
    const aMax = Math.max(...a.items.map((i) => i.realIndex));
    const bMax = Math.max(...b.items.map((i) => i.realIndex));
    return bMax - aMax;
  });

  return result;
}

/* ══════════════════════════════════════════════════════════
   DETAIL DRAWER — slides in from right as overlay
══════════════════════════════════════════════════════════ */
function DetailDrawer({
  table,
  onAction,
  onClose,
  onOrderClick,
  onToggleFoodServed,
  onToggleDrinkServed,
  onToggleRefillServed,
  onAddRefill,
  onBatchToggleFoodServed,
  onBatchToggleDrinkServed,
}: {
  table: TableData;
  onAction: (id: string, action: string) => void;
  onClose: () => void;
  onOrderClick?: (tableId: string, allergens?: string[]) => void;
  onToggleFoodServed?: (tableId: string, foodIndex: number) => void;
  onToggleDrinkServed?: (tableId: string, drinkIndex: number) => void;
  onToggleRefillServed?: (tableId: string, drinkIndex: number, refillIndex: number) => void;
  onAddRefill?: (tableId: string, drinkIndex: number) => void;
  onBatchToggleFoodServed?: (tableId: string, indices: number[]) => void;
  onBatchToggleDrinkServed?: (tableId: string, indices: number[]) => void;
}) {
  const s = STATUS[table.status];
  const [foodExpanded, setFoodExpanded] = useState(false);
  const [drinksExpanded, setDrinksExpanded] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [expandedSubs, setExpandedSubs] = useState<Set<string>>(new Set());
  const toggleGroup = (key: string) => setExpandedGroups((p) => { const s = new Set(p); s.has(key) ? s.delete(key) : s.add(key); return s; });
  const toggleSub = (key: string) => setExpandedSubs((p) => { const s = new Set(p); s.has(key) ? s.delete(key) : s.add(key); return s; });

  const flagLabel = table.flagged ? "Odznacz jako pilny" : "Oznacz jako pilny";
  const ACTIONS: Partial<Record<TableStatus, { label: string; action: string; primary?: boolean }[]>> = {
    upcoming:     [{ label: "Obsadzono", action: "seated", primary: true }],
    seated:       [{ label: "Zamówienie przyjęte", action: "ordering", primary: true }, { label: flagLabel, action: "flag" }],
    ordering:     [{ label: "Ostatnia kolejka", action: "last-round", primary: true }, { label: flagLabel, action: "flag" }],
    "last-round": [{ label: "Kończy wizytę", action: "leaving", primary: true }, { label: flagLabel, action: "flag" }],
    leaving:      [{ label: "Zwolnij stolik", action: "available", primary: true }, { label: flagLabel, action: "flag" }],
    available:    [],
  };

  const actions = ACTIONS[table.status] ?? [];

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 transition-opacity duration-300"
        style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        onClick={onClose}
      />

      {/* Drawer panel */}
      <div
        className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md overflow-y-auto"
        style={{ backgroundColor: "#111A17", borderLeft: `1px solid rgba(182,138,58,0.15)` }}
      >
        {/* Colored header stripe */}
        <div className="h-1.5" style={{ backgroundColor: s.stripe }} />

        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center text-lg font-semibold"
                  style={{ backgroundColor: s.bg, color: s.color, border: `1px solid ${s.stripe}40` }}
                >
                  {table.number}
                </div>
                <div>
                  <h2 className="text-2xl font-light" style={{ color: C.cream }}>
                    Stolik {table.number}
                  </h2>
                  <Badge label={s.label} color={s.color} bg={s.bg} />
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg transition-colors hover:bg-white/5"
              style={{ color: "rgba(243,239,234,0.4)" }}
            >
              <X size={20} />
            </button>
          </div>

          {/* VIP badge */}
          {table.vip && (
            <div
              className="flex items-center gap-2 rounded-lg px-3 py-2 mb-4"
              style={{ backgroundColor: "rgba(182,138,58,0.1)", border: "1px solid rgba(182,138,58,0.25)" }}
            >
              <Star size={16} style={{ color: C.gold }} />
              <span className="text-sm font-medium" style={{ color: C.gold }}>Gość VIP</span>
            </div>
          )}

          {/* Divider */}
          <div className="h-px mb-5" style={{ backgroundColor: C.border }} />

          {/* Guest info */}
          <div className="space-y-3 mb-6">
            {table.guestName && (
              <InfoRow icon={User} label="Gość" value={table.guestName} />
            )}
            {table.partySize && (
              <InfoRow icon={Users} label="Liczba gości" value={`${table.partySize} ${table.partySize === 1 ? "osoba" : "osób"}`} />
            )}
            {table.arrivalTime && (
              <InfoRow icon={Clock} label="Rezerwacja" value={table.arrivalTime} />
            )}
            {table.seatedAt && (
              <InfoRow icon={CheckCircle} label="Usadzono" value={table.seatedAt} />
            )}
            {table.reservationCode && (
              <InfoRow icon={CalendarCheck} label="Kod" value={table.reservationCode} valueStyle={{ opacity: 0.5, fontSize: "13px", letterSpacing: "0.05em" }} />
            )}
          </div>

          {/* Alerts */}
          {(table.celebration || (table.allergies?.length ?? 0) > 0) && (
            <div className="space-y-2 mb-6">
              {table.celebration && (
                <div className="flex items-center gap-3 rounded-lg px-4 py-3" style={{ backgroundColor: "rgba(246,191,96,0.08)", border: "1px solid rgba(246,191,96,0.2)" }}>
                  <Heart size={18} style={{ color: "#F6BF60" }} />
                  <div>
                    <p className="text-sm font-medium" style={{ color: "#F6BF60" }}>Uroczystość</p>
                    <p className="text-sm" style={{ color: "rgba(243,239,234,0.6)" }}>{table.celebration}</p>
                  </div>
                </div>
              )}
              {(table.allergies?.length ?? 0) > 0 && (
                <div className="flex items-center gap-3 rounded-lg px-4 py-3" style={{ backgroundColor: "rgba(242,139,130,0.08)", border: "1px solid rgba(242,139,130,0.2)" }}>
                  <AlertCircle size={18} style={{ color: "#F28B82" }} />
                  <div>
                    <p className="text-sm font-medium" style={{ color: "#F28B82" }}>Alergia</p>
                    <p className="text-sm" style={{ color: "rgba(243,239,234,0.6)" }}>{table.allergies!.join(", ")}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Menu badges */}
          {(table.tastingMenu || table.winePairing) && (
            <div className="flex flex-wrap gap-2 mb-6">
              {table.tastingMenu && (
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ backgroundColor: "rgba(182,138,58,0.08)", border: "1px solid rgba(182,138,58,0.2)" }}>
                  <Utensils size={14} style={{ color: C.gold }} />
                  <span className="text-sm" style={{ color: C.gold }}>Menu degustacyjne</span>
                </div>
              )}
              {table.winePairing && (
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ backgroundColor: "rgba(182,138,58,0.08)", border: "1px solid rgba(182,138,58,0.2)" }}>
                  <Wine size={14} style={{ color: C.gold }} />
                  <span className="text-sm" style={{ color: C.gold }}>Dobór win</span>
                </div>
              )}
            </div>
          )}

          {/* Service notes */}
          {(table.notes?.length ?? 0) > 0 && (
            <div className="mb-6">
              <SectionLabel>Uwagi serwisowe</SectionLabel>
              <div className="space-y-2 mt-2">
                {table.notes!.map((note, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm" style={{ color: "rgba(243,239,234,0.6)" }}>
                    <span style={{ color: C.gold, marginTop: 1 }}>·</span>
                    <span style={{ lineHeight: 1.5 }}>{note}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Food orders */}
          {(table.foodOrders?.length ?? 0) > 0 && (() => {
            const groups = groupOrders(table.foodOrders!);
            const visible = foodExpanded ? groups : groups.slice(0, 4);
            const hiddenCount = groups.length - 4;
            return (
              <div className="mb-6">
                <SectionLabel>Zamówienia dań ({table.foodOrders!.length})</SectionLabel>
                <div className="mt-2 rounded-lg overflow-hidden" style={{ border: `1px solid ${C.border}` }}>
                  {visible.map((g, gi) => {
                    const isMulti = g.items.length > 1;
                    const isGroupOpen = expandedGroups.has(`f-${g.key}`);
                    const servedCount = g.items.filter((it) => it.data.served).length;
                    const allServed = servedCount === g.items.length;
                    const someServed = servedCount > 0 && !allServed;
                    const hasAnyNotes = g.items.some((it) => it.data.notes);
                    const needsBorder = gi < visible.length - 1 || (!foodExpanded && hiddenCount > 0);

                    if (!isMulti) {
                      const it = g.items[0];
                      const d = it.data;
                      const subKey = `f-sub-${it.realIndex}`;
                      const isSubOpen = expandedSubs.has(subKey);
                      const hasNotes = !!d.notes;
                      return (
                        <div key={g.key}>
                          <div className="flex items-center justify-between px-4 py-3 text-sm" style={{ borderBottom: (isSubOpen && hasNotes) || needsBorder ? `1px solid ${C.border}` : "none", backgroundColor: gi % 2 === 0 ? "rgba(243,239,234,0.015)" : "transparent" }}>
                            <span className="flex items-center gap-2" style={{ color: "rgba(243,239,234,0.7)" }}>
                              <button onClick={(e) => { e.stopPropagation(); onToggleFoodServed?.(table.id, it.realIndex); }} className="w-4 h-4 rounded-full flex-shrink-0 cursor-pointer transition-all duration-200 hover:scale-125" style={{ backgroundColor: d.served ? "#60C275" : "transparent", border: d.served ? "2px solid #60C275" : "2px solid rgba(243,239,234,0.25)", boxShadow: d.served ? "0 0 6px rgba(96,194,117,0.4)" : "none" }} title={d.served ? "Podane" : "Oczekuje"} />
                              <Utensils size={13} style={{ color: "rgba(243,239,234,0.3)" }} />
                              {d.item}
                              {hasNotes && !isSubOpen && <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ backgroundColor: "rgba(182,138,58,0.1)", color: "rgba(182,138,58,0.7)" }}>📝</span>}
                            </span>
                            <span className="flex items-center gap-2.5 flex-shrink-0">
                              {hasNotes && <button onClick={() => toggleSub(subKey)} className="p-0.5 transition-all hover:bg-white/5 rounded"><ChevronDown size={12} style={{ color: "rgba(243,239,234,0.3)", transform: isSubOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} /></button>}
                              <span style={{ color: "rgba(243,239,234,0.3)" }}>{d.time}</span>
                            </span>
                          </div>
                          {isSubOpen && d.notes && (
                            <div className="px-4 py-2 text-xs" style={{ paddingLeft: "2.75rem", borderBottom: needsBorder ? `1px solid ${C.border}` : "none", backgroundColor: "rgba(182,138,58,0.03)", color: "rgba(182,138,58,0.7)", fontStyle: "italic" }}>📝 {d.notes}</div>
                          )}
                        </div>
                      );
                    }

                    return (
                      <div key={g.key}>
                        <div className="flex items-center justify-between px-4 py-3 text-sm cursor-pointer hover:bg-white/[0.02]" onClick={() => toggleGroup(`f-${g.key}`)} style={{ borderBottom: isGroupOpen || needsBorder ? `1px solid ${C.border}` : "none", backgroundColor: gi % 2 === 0 ? "rgba(243,239,234,0.015)" : "transparent" }}>
                          <span className="flex items-center gap-2" style={{ color: "rgba(243,239,234,0.7)" }}>
                            <button onClick={(e) => { e.stopPropagation(); onBatchToggleFoodServed?.(table.id, g.items.map((it) => it.realIndex)); }} className="w-4 h-4 rounded-full flex-shrink-0 cursor-pointer transition-all duration-200 hover:scale-125" style={{ background: allServed ? "#60C275" : someServed ? "linear-gradient(90deg, #60C275 50%, transparent 50%)" : "transparent", border: allServed ? "2px solid #60C275" : someServed ? "2px solid #60C275" : "2px solid rgba(243,239,234,0.25)", boxShadow: allServed ? "0 0 6px rgba(96,194,117,0.4)" : someServed ? "0 0 4px rgba(96,194,117,0.2)" : "none" }} title={allServed ? "Wszystkie podane — kliknij aby cofnąć" : "Kliknij aby oznaczyć wszystkie jako podane"} />
                            <Utensils size={13} style={{ color: "rgba(243,239,234,0.3)" }} />
                            {g.name} <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ backgroundColor: "rgba(243,239,234,0.06)", color: "rgba(243,239,234,0.5)" }}>×{g.items.length}</span>
                            {hasAnyNotes && !isGroupOpen && <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ backgroundColor: "rgba(182,138,58,0.1)", color: "rgba(182,138,58,0.7)" }}>📝</span>}
                          </span>
                          <span className="flex items-center gap-2.5 flex-shrink-0">
                            <ChevronDown size={12} style={{ color: "rgba(243,239,234,0.3)", transform: isGroupOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
                            <span style={{ color: "rgba(243,239,234,0.3)" }}>{g.times[g.times.length - 1]}</span>
                          </span>
                        </div>
                        {isGroupOpen && g.items.map((it, si) => {
                          const d = it.data;
                          const subKey = `f-sub-${it.realIndex}`;
                          const isSubOpen = expandedSubs.has(subKey);
                          const hasNotes = !!d.notes;
                          const isLast = si === g.items.length - 1;
                          return (
                            <div key={it.realIndex}>
                              <div className="flex items-center justify-between px-4 py-2.5 text-xs" style={{ paddingLeft: "2.25rem", borderBottom: (isSubOpen && hasNotes) || !isLast || needsBorder ? `1px solid ${C.border}` : "none", backgroundColor: "rgba(243,239,234,0.02)" }}>
                                <span className="flex items-center gap-2" style={{ color: "rgba(243,239,234,0.6)" }}>
                                  <button onClick={(e) => { e.stopPropagation(); onToggleFoodServed?.(table.id, it.realIndex); }} className="w-3.5 h-3.5 rounded-full flex-shrink-0 cursor-pointer transition-all duration-200 hover:scale-125" style={{ backgroundColor: d.served ? "#60C275" : "transparent", border: d.served ? "2px solid #60C275" : "2px solid rgba(243,239,234,0.2)", boxShadow: d.served ? "0 0 4px rgba(96,194,117,0.4)" : "none" }} title={d.served ? "Podane" : "Oczekuje"} />
                                  {g.name} #{si + 1}
                                  {hasNotes && !isSubOpen && <span className="text-[10px] px-1 py-0.5 rounded" style={{ backgroundColor: "rgba(182,138,58,0.1)", color: "rgba(182,138,58,0.7)" }}>📝</span>}
                                </span>
                                <span className="flex items-center gap-2.5 flex-shrink-0">
                                  {hasNotes && <button onClick={(ev) => { ev.stopPropagation(); toggleSub(subKey); }} className="p-0.5 transition-all hover:bg-white/5 rounded"><ChevronDown size={11} style={{ color: "rgba(243,239,234,0.3)", transform: isSubOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} /></button>}
                                  <span style={{ color: "rgba(243,239,234,0.25)" }}>{d.time}</span>
                                </span>
                              </div>
                              {isSubOpen && d.notes && (
                                <div className="px-4 py-1.5 text-[11px]" style={{ paddingLeft: "3.5rem", borderBottom: !isLast || needsBorder ? `1px solid ${C.border}` : "none", backgroundColor: "rgba(182,138,58,0.03)", color: "rgba(182,138,58,0.7)", fontStyle: "italic" }}>📝 {d.notes}</div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                  {hiddenCount > 0 && (
                    <button onClick={() => setFoodExpanded(!foodExpanded)} className="w-full px-4 py-2.5 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors hover:bg-white/5" style={{ color: C.gold }}>
                      <ChevronDown size={13} style={{ transform: foodExpanded ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
                      {foodExpanded ? "Zwiń" : `Pokaż wszystkie (+${hiddenCount})`}
                    </button>
                  )}
                </div>
              </div>
            );
          })()}

          {/* Drink orders */}
          {(table.drinkOrders?.length ?? 0) > 0 && (() => {
            const groups = groupOrders(table.drinkOrders!);
            const visible = drinksExpanded ? groups : groups.slice(0, 4);
            const hiddenCount = groups.length - 4;

            const renderDrinkSub = (it: OrderGroupItem<DrinkOrder>, indent: string, subKey: string, needsBorder: boolean, label?: string) => {
              const d = it.data;
              const isSubOpen = expandedSubs.has(subKey);
              const hasNotes = !!d.notes;
              const hasRefills = (d.refills?.length ?? 0) > 0;
              return (
                <div key={it.realIndex}>
                  <div className="flex items-center justify-between px-4 py-2.5 text-xs" style={{ paddingLeft: indent, borderBottom: isSubOpen || needsBorder ? `1px solid ${C.border}` : "none", backgroundColor: "rgba(243,239,234,0.02)" }}>
                    <span className="flex items-center gap-2" style={{ color: "rgba(243,239,234,0.6)" }}>
                      <button onClick={(e) => { e.stopPropagation(); onToggleDrinkServed?.(table.id, it.realIndex); }} className="w-3.5 h-3.5 rounded-full flex-shrink-0 cursor-pointer transition-all duration-200 hover:scale-125" style={{ backgroundColor: d.served ? "#60C275" : "transparent", border: d.served ? "2px solid #60C275" : "2px solid rgba(243,239,234,0.2)", boxShadow: d.served ? "0 0 4px rgba(96,194,117,0.4)" : "none" }} title={d.served ? "Podane" : "Oczekuje"} />
                      <Wine size={12} style={{ color: "rgba(243,239,234,0.25)" }} />
                      {label ?? d.item}
                      {hasNotes && !isSubOpen && <span className="text-[10px] px-1 py-0.5 rounded" style={{ backgroundColor: "rgba(182,138,58,0.1)", color: "rgba(182,138,58,0.7)" }}>📝</span>}
                      {hasRefills && !isSubOpen && <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ backgroundColor: "rgba(122,175,232,0.1)", color: "#7AAFE8" }}>{d.refills!.length}× dol.</span>}
                    </span>
                    <span className="flex items-center gap-2.5 flex-shrink-0">
                      <button onClick={(ev) => { ev.stopPropagation(); toggleSub(subKey); }} className="p-0.5 transition-all hover:bg-white/5 rounded"><ChevronDown size={11} style={{ color: "rgba(243,239,234,0.3)", transform: isSubOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} /></button>
                      <span style={{ color: "rgba(243,239,234,0.25)" }}>{d.time}</span>
                    </span>
                  </div>
                  {isSubOpen && d.notes && (
                    <div className="px-4 py-1.5 text-[11px]" style={{ paddingLeft: `calc(${indent} + 1.25rem)`, borderBottom: `1px solid ${C.border}`, backgroundColor: "rgba(182,138,58,0.03)", color: "rgba(182,138,58,0.7)", fontStyle: "italic" }}>📝 {d.notes}</div>
                  )}
                  {isSubOpen && d.refills?.map((r) => (
                    <div key={r.number} className="flex items-center justify-between px-4 py-2 text-[11px]" style={{ paddingLeft: `calc(${indent} + 1.25rem)`, borderBottom: `1px solid ${C.border}`, backgroundColor: "rgba(122,175,232,0.03)" }}>
                      <span className="flex items-center gap-2" style={{ color: "rgba(122,175,232,0.8)" }}>
                        <button onClick={(e) => { e.stopPropagation(); onToggleRefillServed?.(table.id, it.realIndex, r.number - 1); }} className="w-3 h-3 rounded-full flex-shrink-0 cursor-pointer transition-all duration-200 hover:scale-125" style={{ backgroundColor: r.served ? "#60C275" : "transparent", border: r.served ? "2px solid #60C275" : "2px solid rgba(243,239,234,0.2)", boxShadow: r.served ? "0 0 4px rgba(96,194,117,0.4)" : "none" }} title={r.served ? "Podane" : "Oczekuje"} />
                        <Coffee size={11} style={{ color: "rgba(122,175,232,0.4)" }} />
                        Dolewka #{r.number}
                      </span>
                      <span style={{ color: "rgba(243,239,234,0.2)" }}>{r.time}</span>
                    </div>
                  ))}
                  {isSubOpen && (
                    <button onClick={(e) => { e.stopPropagation(); onAddRefill?.(table.id, it.realIndex); }} className="flex items-center gap-2 w-full px-4 py-1.5 text-[11px] cursor-pointer transition-colors hover:bg-white/5" style={{ paddingLeft: `calc(${indent} + 1.25rem)`, borderBottom: needsBorder ? `1px solid ${C.border}` : "none", backgroundColor: "rgba(122,175,232,0.02)", color: "rgba(122,175,232,0.6)" }}>
                      <Plus size={12} style={{ color: "rgba(122,175,232,0.5)" }} />
                      Dodaj dolewkę
                    </button>
                  )}
                </div>
              );
            };

            return (
            <div className="mb-6">
                <SectionLabel>Zamówienia napojów ({table.drinkOrders!.length})</SectionLabel>
              <div className="mt-2 rounded-lg overflow-hidden" style={{ border: `1px solid ${C.border}` }}>
                  {visible.map((g, gi) => {
                    const isMulti = g.items.length > 1;
                    const isGroupOpen = expandedGroups.has(`d-${g.key}`);
                    const servedCount = g.items.filter((it) => it.data.served).length;
                    const allServed = servedCount === g.items.length;
                    const someServed = servedCount > 0 && !allServed;
                    const hasAnyNotes = g.items.some((it) => it.data.notes);
                    const totalRefills = g.items.reduce((s, it) => s + (it.data.refills?.length ?? 0), 0);
                    const needsBorder = gi < visible.length - 1 || (!drinksExpanded && hiddenCount > 0);

                    if (!isMulti) {
                      const it = g.items[0];
                      const d = it.data;
                      const subKey = `d-sub-${it.realIndex}`;
                      const isSubOpen = expandedSubs.has(subKey);
                      const hasNotes = !!d.notes;
                      const hasRefills = (d.refills?.length ?? 0) > 0;
                      return (
                        <div key={g.key}>
                          <div className="flex items-center justify-between px-4 py-3 text-sm" style={{ borderBottom: isSubOpen || needsBorder ? `1px solid ${C.border}` : "none", backgroundColor: gi % 2 === 0 ? "rgba(243,239,234,0.015)" : "transparent" }}>
                    <span className="flex items-center gap-2" style={{ color: "rgba(243,239,234,0.7)" }}>
                              <button onClick={(e) => { e.stopPropagation(); onToggleDrinkServed?.(table.id, it.realIndex); }} className="w-4 h-4 rounded-full flex-shrink-0 cursor-pointer transition-all duration-200 hover:scale-125" style={{ backgroundColor: d.served ? "#60C275" : "transparent", border: d.served ? "2px solid #60C275" : "2px solid rgba(243,239,234,0.25)", boxShadow: d.served ? "0 0 6px rgba(96,194,117,0.4)" : "none" }} title={d.served ? "Podane" : "Oczekuje"} />
                      <Wine size={14} style={{ color: "rgba(243,239,234,0.3)" }} />
                      {d.item}
                              {hasNotes && !isSubOpen && <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ backgroundColor: "rgba(182,138,58,0.1)", color: "rgba(182,138,58,0.7)" }}>📝</span>}
                              {hasRefills && !isSubOpen && <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ backgroundColor: "rgba(122,175,232,0.1)", color: "#7AAFE8" }}>{d.refills!.length}× dol.</span>}
                    </span>
                            <span className="flex items-center gap-2.5 flex-shrink-0">
                              <button onClick={() => toggleSub(subKey)} className="p-0.5 transition-all hover:bg-white/5 rounded"><ChevronDown size={12} style={{ color: "rgba(243,239,234,0.3)", transform: isSubOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} /></button>
                    <span style={{ color: "rgba(243,239,234,0.3)" }}>{d.time}</span>
                            </span>
                          </div>
                          {isSubOpen && d.notes && (
                            <div className="px-4 py-1.5 text-[11px]" style={{ paddingLeft: "2.75rem", borderBottom: `1px solid ${C.border}`, backgroundColor: "rgba(182,138,58,0.03)", color: "rgba(182,138,58,0.7)", fontStyle: "italic" }}>📝 {d.notes}</div>
                          )}
                          {isSubOpen && d.refills?.map((r) => (
                            <div key={r.number} className="flex items-center justify-between px-4 py-2.5 text-xs" style={{ borderBottom: `1px solid ${C.border}`, backgroundColor: "rgba(122,175,232,0.03)", paddingLeft: "2.75rem" }}>
                              <span className="flex items-center gap-2" style={{ color: "rgba(122,175,232,0.8)" }}>
                                <button onClick={(e) => { e.stopPropagation(); onToggleRefillServed?.(table.id, it.realIndex, r.number - 1); }} className="w-3 h-3 rounded-full flex-shrink-0 cursor-pointer transition-all duration-200 hover:scale-125" style={{ backgroundColor: r.served ? "#60C275" : "transparent", border: r.served ? "2px solid #60C275" : "2px solid rgba(243,239,234,0.2)", boxShadow: r.served ? "0 0 4px rgba(96,194,117,0.4)" : "none" }} title={r.served ? "Podane" : "Oczekuje"} />
                                <Coffee size={12} style={{ color: "rgba(122,175,232,0.4)" }} />
                                Dolewka #{r.number}
                              </span>
                              <span style={{ color: "rgba(243,239,234,0.25)" }}>{r.time}</span>
                  </div>
                ))}
                          {isSubOpen && (
                            <button onClick={(e) => { e.stopPropagation(); onAddRefill?.(table.id, it.realIndex); }} className="flex items-center gap-2 w-full px-4 py-2 text-xs cursor-pointer transition-colors hover:bg-white/5" style={{ borderBottom: needsBorder ? `1px solid ${C.border}` : "none", backgroundColor: "rgba(122,175,232,0.02)", paddingLeft: "2.75rem", color: "rgba(122,175,232,0.6)" }}>
                              <Plus size={13} style={{ color: "rgba(122,175,232,0.5)" }} />
                              Dodaj dolewkę
                            </button>
                          )}
              </div>
                      );
                    }

                    return (
                      <div key={g.key}>
                        <div className="flex items-center justify-between px-4 py-3 text-sm cursor-pointer hover:bg-white/[0.02]" onClick={() => toggleGroup(`d-${g.key}`)} style={{ borderBottom: isGroupOpen || needsBorder ? `1px solid ${C.border}` : "none", backgroundColor: gi % 2 === 0 ? "rgba(243,239,234,0.015)" : "transparent" }}>
                          <span className="flex items-center gap-2" style={{ color: "rgba(243,239,234,0.7)" }}>
                            <button onClick={(e) => { e.stopPropagation(); onBatchToggleDrinkServed?.(table.id, g.items.map((it) => it.realIndex)); }} className="w-4 h-4 rounded-full flex-shrink-0 cursor-pointer transition-all duration-200 hover:scale-125" style={{ background: allServed ? "#60C275" : someServed ? "linear-gradient(90deg, #60C275 50%, transparent 50%)" : "transparent", border: allServed ? "2px solid #60C275" : someServed ? "2px solid #60C275" : "2px solid rgba(243,239,234,0.25)", boxShadow: allServed ? "0 0 6px rgba(96,194,117,0.4)" : someServed ? "0 0 4px rgba(96,194,117,0.2)" : "none" }} title={allServed ? "Wszystkie podane — kliknij aby cofnąć" : "Kliknij aby oznaczyć wszystkie jako podane"} />
                            <Wine size={14} style={{ color: "rgba(243,239,234,0.3)" }} />
                            {g.name} <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ backgroundColor: "rgba(243,239,234,0.06)", color: "rgba(243,239,234,0.5)" }}>×{g.items.length}</span>
                            {hasAnyNotes && !isGroupOpen && <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ backgroundColor: "rgba(182,138,58,0.1)", color: "rgba(182,138,58,0.7)" }}>📝</span>}
                            {totalRefills > 0 && !isGroupOpen && <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ backgroundColor: "rgba(122,175,232,0.1)", color: "#7AAFE8" }}>{totalRefills}× dol.</span>}
                          </span>
                          <span className="flex items-center gap-2.5 flex-shrink-0">
                            <ChevronDown size={12} style={{ color: "rgba(243,239,234,0.3)", transform: isGroupOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
                            <span style={{ color: "rgba(243,239,234,0.3)" }}>{g.times[g.times.length - 1]}</span>
                          </span>
            </div>
                        {isGroupOpen && g.items.map((it, si) => {
                          const subKey = `d-sub-${it.realIndex}`;
                          const isLast = si === g.items.length - 1;
                          return renderDrinkSub(it, "2.25rem", subKey, !isLast || needsBorder, `${g.name} #${si + 1}`);
                        })}
                      </div>
                    );
                  })}
                  {hiddenCount > 0 && (
                    <button onClick={() => setDrinksExpanded(!drinksExpanded)} className="w-full px-4 py-2.5 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors hover:bg-white/5" style={{ color: C.gold }}>
                      <ChevronDown size={13} style={{ transform: drinksExpanded ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
                      {drinksExpanded ? "Zwiń" : `Pokaż wszystkie (+${hiddenCount})`}
                    </button>
                  )}
                </div>
              </div>
            );
          })()}

          {/* Turn timer */}
          {table.turnsIn !== undefined && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <SectionLabel>Szacowany czas pozostały</SectionLabel>
                <span
                  className="text-sm font-medium"
                  style={{ color: table.turnsIn <= 15 ? "#F28B82" : table.turnsIn <= 30 ? "#E8843A" : "rgba(243,239,234,0.5)" }}
                >
                  ~{table.turnsIn} min
                </span>
              </div>
              <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: "rgba(243,239,234,0.05)" }}>
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.max(4, 100 - (table.turnsIn / 120) * 100)}%`,
                    backgroundColor: table.turnsIn <= 15 ? "#F28B82" : table.turnsIn <= 30 ? "#E8843A" : "rgba(182,138,58,0.5)",
                  }}
                />
              </div>
            </div>
          )}

          {/* Take / Edit order button */}
          {onOrderClick && table.status !== "available" && table.status !== "upcoming" && (() => {
            const hasOrders = (table.foodOrders?.length ?? 0) > 0 || (table.drinkOrders?.length ?? 0) > 0;
            return (
              <>
                <div className="h-px mb-5" style={{ backgroundColor: C.border }} />
                <button
                  onClick={() => onOrderClick(table.id, table.allergies)}
                  className="w-full py-3.5 rounded-xl text-sm font-medium transition-all duration-150 active:scale-[0.97] flex items-center justify-center gap-2"
                  style={{ backgroundColor: "rgba(182,138,58,0.15)", color: C.gold, border: "1px solid rgba(182,138,58,0.3)", letterSpacing: "0.03em" }}
                >
                  {hasOrders ? <Edit3 size={16} /> : <ClipboardList size={16} />}
                  {hasOrders ? "Edytuj zamówienie" : "Przyjmij zamówienie"}
                </button>
              </>
            );
          })()}

          {/* Action buttons */}
          {actions.length > 0 && (
            <>
              <div className="h-px mb-5" style={{ backgroundColor: C.border }} />
              <div className="space-y-2">
                {actions.map((a) => (
                  <button
                    key={a.action}
                    onClick={() => onAction(table.id, a.action)}
                    className="w-full py-3.5 rounded-lg text-sm font-medium transition-all duration-150 active:scale-[0.97]"
                    style={{
                      backgroundColor: a.primary ? s.stripe : "rgba(243,239,234,0.04)",
                      color: a.primary ? "#1E1A16" : "rgba(243,239,234,0.5)",
                      border: a.primary ? "none" : `1px solid rgba(243,239,234,0.1)`,
                      letterSpacing: "0.03em",
                    }}
                  >
                    {a.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

/* ── Detail sub-components ── */
function InfoRow({ icon: Icon, label, value, valueStyle }: {
  icon: React.ComponentType<{ size: number; style?: React.CSSProperties }>;
  label: string;
  value: string;
  valueStyle?: React.CSSProperties;
}) {
  return (
    <div className="flex items-center gap-3">
      <Icon size={16} style={{ color: "rgba(243,239,234,0.3)", flexShrink: 0 }} />
      <span className="text-sm" style={{ color: "rgba(243,239,234,0.4)", minWidth: 90 }}>{label}</span>
      <span className="text-sm font-medium" style={{ color: C.cream, ...valueStyle }}>{value}</span>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] uppercase tracking-wider font-medium" style={{ color: "rgba(243,239,234,0.3)" }}>
      {children}
    </p>
  );
}

/* ══════════════════════════════════════════════════════════
   UPCOMING ARRIVALS — horizontal timeline
══════════════════════════════════════════════════════════ */
function ArrivalsStrip() {
  return (
    <div className="rounded-xl p-4" style={{ backgroundColor: "rgba(243,239,234,0.02)", border: `1px solid ${C.border}` }}>
      <div className="flex items-center justify-between mb-3">
        <SectionLabel>Nadchodzące rezerwacje</SectionLabel>
        <span className="text-xs" style={{ color: "rgba(243,239,234,0.3)" }}>{UPCOMING.length} oczekujących</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
        {UPCOMING.map((a, i) => {
          const soon = a.mins <= 15;
          return (
            <div
              key={i}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5"
              style={{
                backgroundColor: soon ? "rgba(122,175,232,0.08)" : "rgba(243,239,234,0.02)",
                border: soon ? "1px solid rgba(122,175,232,0.2)" : `1px solid ${C.border}`,
              }}
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-semibold"
                style={{
                  backgroundColor: soon ? "rgba(122,175,232,0.12)" : "rgba(243,239,234,0.04)",
                  color: soon ? "#7AAFE8" : "rgba(243,239,234,0.4)",
                }}
              >
                {soon ? `${a.mins}m` : a.time}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-medium truncate" style={{ color: C.cream }}>{a.name}</span>
                  {a.celebration && <Heart size={12} style={{ color: "#F6BF60" }} />}
                </div>
                <span className="text-xs" style={{ color: "rgba(243,239,234,0.4)" }}>
                  {a.party} os. → St. {a.table}
                  {a.note && <span style={{ color: "#F6BF60" }}> · {a.note}</span>}
                </span>
                {a.reminderSent !== undefined && (
                  <div className="flex items-center gap-1 mt-1">
                    {a.reminderSent ? (
                      <span className="inline-flex items-center gap-1 text-[9px] px-1.5 py-0.5 rounded" style={{ backgroundColor: "rgba(96,194,117,0.1)", color: "#60C275" }}>
                        <Smartphone size={9} /><Mail size={9} /> Przypomnienie ✓
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[9px] px-1.5 py-0.5 rounded" style={{ backgroundColor: "rgba(246,191,96,0.1)", color: "#F6BF60" }}>
                        <Clock size={9} /> Przypomnienie ◷
                      </span>
                    )}
                  </div>
                )}
              </div>
              {soon && <Bell size={14} style={{ color: "#7AAFE8", flexShrink: 0 }} />}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   SECTION FILTER
══════════════════════════════════════════════════════════ */
type SectionFilter = "Wszystkie" | "Okno" | "Sala" | "Boks";
const SECTIONS: SectionFilter[] = ["Wszystkie", "Okno", "Sala", "Boks"];

/* ══════════════════════════════════════════════════════════
   FLOOR PLAN VIEW — interactive SVG map for staff
══════════════════════════════════════════════════════════ */
interface FloorSpot {
  tableNumber: string;
  shape: "circle" | "rectangle";
  cx: number;
  cy: number;
  r?: number;
  x?: number;
  y?: number;
  w?: number;
  h?: number;
}

const TR = 27.38;
const FLOOR_SPOTS: FloorSpot[] = [
  // OKNO — O1–O4
  { tableNumber: "O1", shape: "circle", cx: 404.58, cy: 159.58, r: TR },
  { tableNumber: "O2", shape: "circle", cx: 557.58, cy: 159.58, r: TR },
  { tableNumber: "O3", shape: "circle", cx: 712.58, cy: 159.58, r: TR },
  { tableNumber: "O4", shape: "circle", cx: 867.58, cy: 159.58, r: TR },
  // SALA — S1–S4 (okrągłe)
  { tableNumber: "S1", shape: "circle", cx: 154.58, cy: 321.58, r: TR },
  { tableNumber: "S2", shape: "circle", cx: 154.58, cy: 478.74, r: TR },
  { tableNumber: "S3", shape: "circle", cx: 664.58, cy: 321.58, r: TR },
  { tableNumber: "S4", shape: "circle", cx: 666.58, cy: 478.74, r: TR },
  // SALA — S5–S6 (prostokąty duże)
  { tableNumber: "S5", shape: "rectangle", x: 355.25, y: 300.25, w: 110.5, h: 43.5, cx: 410.5, cy: 322 },
  { tableNumber: "S6", shape: "rectangle", x: 355.25, y: 457.25, w: 110.5, h: 43.5, cx: 410.5, cy: 479 },
  // BOKSY — B1–B3
  { tableNumber: "B1", shape: "rectangle", x: 830.20, y: 309.20, w: 76.87, h: 43.71, cx: 868.63, cy: 331.06 },
  { tableNumber: "B2", shape: "rectangle", x: 830.20, y: 475.30, w: 76.87, h: 43.71, cx: 868.63, cy: 497.16 },
  { tableNumber: "B3", shape: "rectangle", x: 830.20, y: 641.41, w: 76.87, h: 43.71, cx: 868.63, cy: 663.27 },
];

function FloorPlanView({
  tables,
  selectedId,
  onSelect,
}: {
  tables: TableData[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const [hovered, setHovered] = useState<string | null>(null);

  const getTableByNumber = (num: string) => tables.find((t) => t.number === num);

  return (
    <div className="flex gap-4 items-start">
      {/* SVG floor plan — takes 2/3 */}
      <div className="flex-1 min-w-0">
        <div
          className="rounded-2xl relative overflow-hidden"
          style={{
            backgroundColor: "#FFFDFB",
            border: "2px solid rgba(243,239,234,0.15)",
            boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
            aspectRatio: "1000 / 800",
          }}
        >
          <svg viewBox="0 0 1000 800" className="w-full h-full block" preserveAspectRatio="xMidYMid meet">
            <defs>
              <style>{`
                @keyframes staffPulse { 0%,100% { opacity:0.2 } 50% { opacity:0.5 } }
                .staff-pulse { animation: staffPulse 2s ease-in-out infinite; }
              `}</style>
            </defs>

            <image href={restauracjaSvg} x={0} y={0} width={1000} height={800} preserveAspectRatio="xMidYMid meet" style={{ pointerEvents: "none" }} />

            {FLOOR_SPOTS.map((spot) => {
              const table = getTableByNumber(spot.tableNumber);
              if (!table) return null;

              const s = STATUS[table.status];
              const isSelected = table.id === selectedId;
              const isHovered = hovered === table.id;
              const isAvailable = table.status === "available";

              const fillColor = isAvailable ? "rgba(243,239,234,0.15)" : `${s.stripe}30`;
              const strokeColor = isAvailable ? "rgba(200,190,175,0.4)" : s.stripe;
              const textColor = isAvailable ? "rgba(30,26,22,0.4)" : s.color;

              return (
                <g key={table.id}>
                  {/* Selection ring */}
                  {isSelected && spot.shape === "circle" && (
                    <circle cx={spot.cx} cy={spot.cy} r={(spot.r ?? 0) + 6} className="staff-pulse" style={{ fill: "none", stroke: C.gold, strokeWidth: 2.5 }} />
                  )}
                  {isSelected && spot.shape === "rectangle" && (
                    <rect x={(spot.x ?? 0) - 6} y={(spot.y ?? 0) - 6} width={(spot.w ?? 0) + 12} height={(spot.h ?? 0) + 12} rx={14} className="staff-pulse" style={{ fill: "none", stroke: C.gold, strokeWidth: 2.5 }} />
                  )}

                  {/* Hover ring */}
                  {isHovered && !isSelected && spot.shape === "circle" && (
                    <circle cx={spot.cx} cy={spot.cy} r={(spot.r ?? 0) + 4} style={{ fill: "none", stroke: "rgba(243,239,234,0.4)", strokeWidth: 1.5, pointerEvents: "none" }} />
                  )}
                  {isHovered && !isSelected && spot.shape === "rectangle" && (
                    <rect x={(spot.x ?? 0) - 4} y={(spot.y ?? 0) - 4} width={(spot.w ?? 0) + 8} height={(spot.h ?? 0) + 8} rx={13} style={{ fill: "none", stroke: "rgba(243,239,234,0.4)", strokeWidth: 1.5, pointerEvents: "none" }} />
                  )}

                  {/* Table shape — colored fill */}
                  {spot.shape === "circle" ? (
                    <circle cx={spot.cx} cy={spot.cy} r={spot.r ?? 0} style={{ fill: fillColor, stroke: strokeColor, strokeWidth: isSelected ? 2.5 : 1.5 }} />
                  ) : (
                    <rect x={spot.x} y={spot.y} width={spot.w} height={spot.h} rx={10} style={{ fill: fillColor, stroke: strokeColor, strokeWidth: isSelected ? 2.5 : 1.5 }} />
                  )}

                  {/* Status dot */}
                  {!isAvailable && (
                    <circle
                      cx={spot.shape === "circle" ? spot.cx + (spot.r ?? 0) - 4 : (spot.x ?? 0) + (spot.w ?? 0) - 6}
                      cy={spot.shape === "circle" ? spot.cy - (spot.r ?? 0) + 4 : (spot.y ?? 0) + 6}
                      r={5}
                      style={{ fill: s.stripe, stroke: "#FFFDFB", strokeWidth: 1.5 }}
                    />
                  )}

                  {/* Hit area */}
                  {spot.shape === "circle" ? (
                    <circle
                      cx={spot.cx} cy={spot.cy} r={spot.r ?? 0}
                      fill="transparent"
                      style={{ cursor: "pointer" }}
                      onMouseEnter={() => setHovered(table.id)}
                      onMouseLeave={() => setHovered(null)}
                      onClick={() => onSelect(table.id)}
                    />
                  ) : (
                    <rect
                      x={spot.x} y={spot.y} width={spot.w} height={spot.h}
                      rx={10} fill="transparent"
                      style={{ cursor: "pointer" }}
                      onMouseEnter={() => setHovered(table.id)}
                      onMouseLeave={() => setHovered(null)}
                      onClick={() => onSelect(table.id)}
                    />
                  )}

                  {/* Table number */}
                  <text
                    x={spot.cx}
                    y={spot.cy + 1}
                    textAnchor="middle"
                    dominantBaseline="central"
                    style={{
                      fontSize: spot.shape === "circle" ? "11px" : "10px",
                      fontWeight: 700,
                      fill: textColor,
                      fontFamily: C.sans,
                      pointerEvents: "none",
                      userSelect: "none",
                    }}
                  >
                    {table.number}
                  </text>

                  {/* Guest name below/beside */}
                  {table.guestName && (
                    <text
                      x={spot.cx}
                      y={spot.shape === "circle" ? spot.cy + (spot.r ?? 0) + 14 : (spot.y ?? 0) + (spot.h ?? 0) + 14}
                      textAnchor="middle"
                      style={{
                        fontSize: "9px",
                        fontWeight: 500,
                        fill: isAvailable ? "rgba(30,26,22,0.3)" : s.color,
                        fontFamily: C.sans,
                        pointerEvents: "none",
                        userSelect: "none",
                        opacity: 0.85,
                      }}
                    >
                      {table.guestName}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        {/* Legend below map */}
        <div className="flex flex-wrap gap-3 mt-3 px-1">
          {(["seated", "ordering", "last-round", "leaving", "upcoming", "available"] as TableStatus[]).map((st) => (
            <div key={st} className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: STATUS[st].stripe }} />
              <span className="text-[10px]" style={{ color: "rgba(243,239,234,0.4)" }}>{STATUS[st].label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Detail panel — right side */}
      <div className="w-80 flex-shrink-0 hidden lg:block">
        {(() => {
          const table = tables.find((t) => t.id === selectedId);
          if (!table) {
            return (
              <div
                className="rounded-2xl p-8 text-center"
                style={{ backgroundColor: C.card, border: `1px solid ${C.border}` }}
              >
                <div className="w-14 h-14 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: "rgba(182,138,58,0.08)", border: "1px solid rgba(182,138,58,0.15)" }}>
                  <MapIcon size={22} style={{ color: C.gold, opacity: 0.5 }} />
                </div>
                <p className="text-sm" style={{ color: "rgba(243,239,234,0.4)", lineHeight: 1.6 }}>
                  Kliknij stolik na planie, aby zobaczyć szczegóły
                </p>
              </div>
            );
          }

          const s = STATUS[table.status];
          const isAvailable = table.status === "available";

          return (
            <div
              className="rounded-2xl overflow-hidden"
              style={{ backgroundColor: C.card, border: `1px solid ${C.border}`, animation: "panelSlideIn 280ms ease-out" }}
            >
              <style>{`@keyframes panelSlideIn { from { opacity:0.7; transform:translateY(6px) } to { opacity:1; transform:translateY(0) } }`}</style>

              {/* Status stripe */}
              <div className="h-1.5" style={{ backgroundColor: s.stripe }} />

              <div className="p-5 space-y-4">
                {/* Header */}
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center text-base font-bold"
                    style={{ backgroundColor: s.bg, color: s.color, border: `1px solid ${s.stripe}40` }}
                  >
                    {table.number}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-medium truncate" style={{ color: C.cream }}>
                        {table.guestName ?? (isAvailable ? "Wolny stolik" : "Brak danych")}
                      </span>
                      {table.vip && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded font-bold tracking-wider" style={{ backgroundColor: "rgba(182,138,58,0.18)", color: C.gold }}>VIP</span>
                      )}
                    </div>
                    <Badge label={s.label} color={s.color} bg={s.bg} />
                  </div>
                </div>

                <div className="h-px" style={{ backgroundColor: C.border }} />

                {/* Info rows */}
                <div className="space-y-2.5 text-sm">
                  <div className="flex items-center gap-2" style={{ color: "rgba(243,239,234,0.5)" }}>
                    <Users size={14} style={{ flexShrink: 0 }} />
                    <span>{table.section} · maks. {table.capacity}</span>
                    {table.partySize && <span style={{ color: C.cream }}>({table.partySize} os.)</span>}
                  </div>
                  {table.arrivalTime && (
                    <div className="flex items-center gap-2" style={{ color: "rgba(243,239,234,0.5)" }}>
                      <Clock size={14} style={{ flexShrink: 0 }} />
                      <span>
                        {table.status === "upcoming" ? "rez. " : table.seatedAt ? "od " : ""}
                        <strong style={{ color: C.cream }}>{table.seatedAt ?? table.arrivalTime}</strong>
                      </span>
                    </div>
                  )}
                  {table.reservationCode && (
                    <div className="flex items-center gap-2" style={{ color: "rgba(243,239,234,0.35)" }}>
                      <CalendarCheck size={14} style={{ flexShrink: 0 }} />
                      <span className="text-xs tracking-wide">{table.reservationCode}</span>
                    </div>
                  )}
                </div>

                {/* Alerts */}
                {(table.celebration || (table.allergies?.length ?? 0) > 0) && (
                  <div className="space-y-2">
                    {table.celebration && (
                      <div className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs" style={{ backgroundColor: "rgba(246,191,96,0.08)", border: "1px solid rgba(246,191,96,0.15)", color: "#F6BF60" }}>
                        <Heart size={13} />
                        {table.celebration}
                      </div>
                    )}
                    {(table.allergies?.length ?? 0) > 0 && (
                      <div className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs" style={{ backgroundColor: "rgba(242,139,130,0.08)", border: "1px solid rgba(242,139,130,0.15)", color: "#F28B82" }}>
                        <AlertCircle size={13} />
                        Alergia: {table.allergies!.join(", ")}
                      </div>
                    )}
                  </div>
                )}

                {/* Drinks */}
                {(table.drinkOrders?.length ?? 0) > 0 && (
                  <div>
                    <p className="text-[10px] uppercase tracking-wider font-medium mb-1.5" style={{ color: "rgba(243,239,234,0.3)" }}>Napoje</p>
                    <div className="space-y-1">
                      {table.drinkOrders!.map((d, i) => (
                        <div key={i} className="flex items-center justify-between text-xs" style={{ color: "rgba(243,239,234,0.55)" }}>
                          <span className="flex items-center gap-1.5"><Wine size={11} style={{ color: "rgba(243,239,234,0.25)" }} />{d.item}</span>
                          <span style={{ color: "rgba(243,239,234,0.3)" }}>{d.time}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Notes */}
                {(table.notes?.length ?? 0) > 0 && (
                  <div>
                    <p className="text-[10px] uppercase tracking-wider font-medium mb-1.5" style={{ color: "rgba(243,239,234,0.3)" }}>Uwagi</p>
                    {table.notes!.map((n, i) => (
                      <p key={i} className="text-xs mb-1" style={{ color: "rgba(243,239,234,0.5)", fontStyle: "italic", lineHeight: 1.5 }}>
                        · {n}
                      </p>
                    ))}
                  </div>
                )}

                {/* Progress bar */}
                {!isAvailable && (() => {
                  const stages: TableStatus[] = ["upcoming", "seated", "ordering", "last-round", "leaving"];
                  const idx = stages.indexOf(table.status);
                  if (idx === -1) return null;
                  const pct = ((idx + 1) / stages.length) * 100;
                  const barColor = idx === 0 ? "#7AAFE8" : idx === 1 ? "#60C275" : idx === 2 ? "#D4A843" : idx === 3 ? "#E8843A" : "#F28B82";
                  return (
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] uppercase tracking-wider font-medium" style={{ color: "rgba(243,239,234,0.3)" }}>Postęp wizyty</span>
                        <span className="text-[10px] tabular-nums font-medium" style={{ color: barColor }}>{idx + 1}/{stages.length}</span>
                      </div>
                      <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "rgba(243,239,234,0.06)" }}>
                        <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: barColor, transition: "width 0.8s ease-in-out, background-color 0.5s ease" }} />
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   MENU VIEW
══════════════════════════════════════════════════════════ */
function MenuView() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<MenuCategory | "Wszystkie">("Wszystkie");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = MENU_ITEMS.filter((item) => {
    const matchesCategory = activeCategory === "Wszystkie" || item.category === activeCategory;
    const matchesSearch = !search || item.name.toLowerCase().includes(search.toLowerCase())
      || item.ingredients.some((i) => i.name.toLowerCase().includes(search.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const grouped = MENU_CATEGORIES.filter((cat) => activeCategory === "Wszystkie" || cat === activeCategory)
    .map((cat) => ({ cat, items: filtered.filter((i) => i.category === cat) }))
    .filter((g) => g.items.length > 0);

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6 py-6 space-y-5">
      {/* Search + filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "rgba(243,239,234,0.3)" }} />
          <input
            type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Szukaj dania lub składnika…"
            className="w-full pl-10 pr-4 py-2.5 rounded-lg text-sm outline-none transition-all duration-200"
            style={{ fontFamily: C.sans, backgroundColor: "rgba(243,239,234,0.04)", border: `1px solid ${C.border}`, color: C.cream }}
            onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(182,138,58,0.3)"; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = C.border; }}
          />
        </div>
        <div className="flex gap-1.5 overflow-x-auto scrollbar-hide pb-1">
          {(["Wszystkie", ...MENU_CATEGORIES] as const).map((cat) => (
            <button
              key={cat} onClick={() => setActiveCategory(cat)}
              className="px-3.5 py-2 rounded-lg text-xs font-medium flex-shrink-0 transition-all duration-150"
              style={{
                backgroundColor: activeCategory === cat ? "rgba(182,138,58,0.15)" : "rgba(243,239,234,0.03)",
                color: activeCategory === cat ? C.gold : "rgba(243,239,234,0.4)",
                border: activeCategory === cat ? "1px solid rgba(182,138,58,0.3)" : `1px solid ${C.border}`,
              }}
            >{cat}</button>
          ))}
        </div>
      </div>

      {/* Diet + allergen legend */}
      <div className="flex flex-wrap gap-2">
        <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px]"
          style={{ backgroundColor: "rgba(76,175,80,0.1)", border: "1px solid rgba(76,175,80,0.3)", color: "#4CAF50" }}>
          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "#4CAF50" }} />Wegan
        </span>
        <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px]"
          style={{ backgroundColor: "rgba(139,195,74,0.1)", border: "1px solid rgba(139,195,74,0.3)", color: "#8BC34A" }}>
          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "#8BC34A" }} />Wege
        </span>
        <span className="w-px h-5 self-center" style={{ backgroundColor: C.border }} />
        {ALLERGENS.slice(0, 8).map((a) => (
          <span key={a} className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px]"
            style={{ backgroundColor: `${ALLERGEN_COLORS[a]}10`, border: `1px solid ${ALLERGEN_COLORS[a]}30`, color: ALLERGEN_COLORS[a] }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: ALLERGEN_COLORS[a] }} />
            {a}
          </span>
        ))}
      </div>

      {/* Menu sections */}
      {grouped.map(({ cat, items }) => (
        <div key={cat}>
          <h3 className="text-xs uppercase tracking-wider font-medium mb-3" style={{ color: "rgba(243,239,234,0.3)" }}>{cat}</h3>
          <div className="space-y-2">
            {items.map((item) => {
              const isExpanded = expandedId === item.id;
              const allergens = item.ingredients.filter((i) => i.allergen).map((i) => i.allergen!);
              const uniqueAllergens = [...new Set(allergens)];
              const hasAlcohol = item.ingredients.some((i) => i.alcohol);
              return (
                <div
                  key={item.id}
                  onClick={() => setExpandedId(isExpanded ? null : item.id)}
                  className="rounded-xl cursor-pointer transition-all duration-200"
                  style={{
                    backgroundColor: isExpanded ? "rgba(182,138,58,0.04)" : C.card,
                    border: isExpanded ? "1px solid rgba(182,138,58,0.2)" : `1px solid ${C.border}`,
                  }}
                >
                  <div className="p-4 flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-medium" style={{ color: C.cream }}>{item.name}</span>
                        {item.diet === "vegan" && (
                          <>
                            <span className="text-[10px] px-1.5 py-0.5 rounded font-semibold" style={{ backgroundColor: "rgba(76,175,80,0.12)", border: "1px solid rgba(76,175,80,0.3)", color: "#4CAF50" }}>
                              Wegan
                            </span>
                            <span className="text-[10px] px-1.5 py-0.5 rounded font-semibold" style={{ backgroundColor: "rgba(139,195,74,0.12)", border: "1px solid rgba(139,195,74,0.3)", color: "#8BC34A" }}>
                              WEGE
                            </span>
                          </>
                        )}
                        {item.diet === "vegetarian" && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded font-semibold" style={{ backgroundColor: "rgba(139,195,74,0.12)", border: "1px solid rgba(139,195,74,0.3)", color: "#8BC34A" }}>
                            Wege
                          </span>
                        )}
                        {hasAlcohol && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded font-semibold" style={{ backgroundColor: "rgba(168,85,247,0.12)", border: "1px solid rgba(168,85,247,0.3)", color: "#A855F7" }}>
                            % ALK
                          </span>
                        )}
                        {uniqueAllergens.map((a) => (
                          <span key={a} className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: ALLERGEN_COLORS[a] }} title={a} />
                        ))}
                      </div>
                      <p className="text-xs mt-1 line-clamp-1" style={{ color: "rgba(243,239,234,0.45)" }}>{item.description}</p>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className="text-sm font-semibold tabular-nums" style={{ color: C.gold }}>{item.price} zł</span>
                      <ChevronDown size={14} style={{ color: "rgba(243,239,234,0.3)", transform: isExpanded ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="px-4 pb-4 space-y-3">
                      <div className="h-px" style={{ backgroundColor: C.border }} />

                      <div>
                        <p className="text-[11px] uppercase tracking-wider font-medium mb-2" style={{ color: "rgba(243,239,234,0.3)" }}>Składniki</p>
                        <div className="flex flex-wrap gap-1.5">
                          {item.ingredients.map((ing, idx) => (
                            <span
                              key={idx}
                              className="px-2.5 py-1 rounded-full text-xs"
                              style={ing.allergen ? {
                                backgroundColor: `${ALLERGEN_COLORS[ing.allergen]}12`,
                                border: `1px solid ${ALLERGEN_COLORS[ing.allergen]}40`,
                                color: ALLERGEN_COLORS[ing.allergen],
                                fontWeight: 600,
                              } : ing.alcohol ? {
                                backgroundColor: "rgba(168,85,247,0.1)",
                                border: "1px solid rgba(168,85,247,0.3)",
                                color: "#A855F7",
                                fontWeight: 600,
                              } : {
                                backgroundColor: "rgba(243,239,234,0.04)",
                                border: `1px solid ${C.border}`,
                                color: "rgba(243,239,234,0.5)",
                              }}
                            >
                              {ing.name}{ing.allergen ? ` ⚠` : ing.alcohol ? ` %` : ""}
                            </span>
                          ))}
                        </div>
                      </div>

                      {(uniqueAllergens.length > 0 || hasAlcohol) && (
                        <div className="space-y-2">
                          {uniqueAllergens.length > 0 && (
                            <div className="flex items-start gap-2 rounded-lg px-3 py-2.5" style={{ backgroundColor: "rgba(242,139,130,0.06)", border: "1px solid rgba(242,139,130,0.15)" }}>
                              <AlertCircle size={14} className="mt-0.5 flex-shrink-0" style={{ color: "#F28B82" }} />
                              <p className="text-xs" style={{ color: "#F28B82" }}>
                                Alergeny: <strong>{uniqueAllergens.join(", ")}</strong>
                              </p>
                            </div>
                          )}
                          {hasAlcohol && (
                            <div className="flex items-start gap-2 rounded-lg px-3 py-2.5" style={{ backgroundColor: "rgba(168,85,247,0.06)", border: "1px solid rgba(168,85,247,0.15)" }}>
                              <Wine size={14} className="mt-0.5 flex-shrink-0" style={{ color: "#A855F7" }} />
                              <p className="text-xs" style={{ color: "#A855F7" }}>
                                Zawiera <strong>alkohol</strong>
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   ORDER VIEW
══════════════════════════════════════════════════════════ */
interface OrderItem {
  id: string;
  name: string;
  qty: number;
  perNotes: string[];
}

function OrderView({
  tables,
  prefillTableId,
  prefillAllergens,
  onSubmitOrder,
}: {
  tables: TableData[];
  prefillTableId?: string | null;
  prefillAllergens?: string[];
  onSubmitOrder?: (tableId: string, foodOrders: FoodOrder[], drinkOrders: DrinkOrder[], allergens: string[]) => void;
}) {
  const [selectedTableId, setSelectedTableId] = useState(prefillTableId ?? "");
  const [guestAllergens, setGuestAllergens] = useState<string[]>(prefillAllergens ?? []);
  const [customAllergen, setCustomAllergen] = useState("");
  const [orderMode, setOrderMode] = useState<"text" | "menu">("menu");
  const [textOrder, setTextOrder] = useState("");
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [menuSearch, setMenuSearch] = useState("");
  const [orderMenuCat, setOrderMenuCat] = useState<MenuCategory | "Wszystkie">("Wszystkie");
  const [submitted, setSubmitted] = useState(false);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    if (prefillTableId) setSelectedTableId(prefillTableId);
    if (prefillAllergens?.length) setGuestAllergens(prefillAllergens);
  }, [prefillTableId, prefillAllergens]);

  const toggleAllergen = (a: string) => {
    setGuestAllergens((prev) => prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]);
  };

  const addCustomAllergen = () => {
    const trimmed = customAllergen.trim();
    if (trimmed && !guestAllergens.includes(trimmed)) {
      setGuestAllergens((prev) => [...prev, trimmed]);
    }
    setCustomAllergen("");
  };

  const addFromMenu = (item: MenuItem) => {
    setOrderItems((prev) => {
      const existing = prev.find((o) => o.id === item.id);
      if (existing) return prev.map((o) => o.id === item.id ? { ...o, qty: o.qty + 1, perNotes: [...o.perNotes, ""] } : o);
      return [...prev, { id: item.id, name: item.name, qty: 1, perNotes: [""] }];
    });
  };

  const removeItem = (id: string) => {
    setOrderItems((prev) => prev.filter((o) => o.id !== id));
  };

  const updateItemQty = (id: string, delta: number) => {
    setOrderItems((prev) => prev.map((o) => {
      if (o.id !== id) return o;
      const newQty = o.qty + delta;
      if (newQty <= 0) return o;
      const newNotes = delta > 0 ? [...o.perNotes, ""] : o.perNotes.slice(0, newQty);
      return { ...o, qty: newQty, perNotes: newNotes };
    }));
  };

  const updateItemNote = (id: string, index: number, note: string) => {
    setOrderItems((prev) => prev.map((o) => {
      if (o.id !== id) return o;
      const updated = [...o.perNotes];
      updated[index] = note;
      return { ...o, perNotes: updated };
    }));
  };

  const menuFiltered = MENU_ITEMS.filter((i) => {
    const matchesCat = orderMenuCat === "Wszystkie" || i.category === orderMenuCat;
    const matchesSearch = !menuSearch || i.name.toLowerCase().includes(menuSearch.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleSubmit = () => {
    if (onSubmitOrder && selectedTableId) {
      const now = "właśnie";
      const DRINK_CATS: MenuCategory[] = ["Napoje", "Koktajle"];
      if (orderMode === "menu") {
        const newFoods: FoodOrder[] = [];
        const newDrinks: DrinkOrder[] = [];
        orderItems.forEach((oi) => {
          const menuItem = MENU_ITEMS.find((m) => m.id === oi.id);
          const isDrink = menuItem && DRINK_CATS.includes(menuItem.category);
          for (let i = 0; i < oi.qty; i++) {
            const note = oi.perNotes[i] || undefined;
            if (isDrink) {
              newDrinks.push({ item: oi.name, time: now, served: false, notes: note });
            } else {
              newFoods.push({ item: oi.name, time: now, served: false, notes: note });
            }
          }
        });
        onSubmitOrder(selectedTableId, newFoods, newDrinks, guestAllergens);
      } else if (textOrder.trim()) {
        const foods: FoodOrder[] = textOrder.trim().split(/[\n,]+/).filter(Boolean).map((line) => {
          const raw = line.trim();
          const match = raw.match(/^(.+?)\s*\((.+?)\)\s*$/);
          if (match) {
            return { item: match[1].trim(), time: now, served: false, notes: match[2].trim() };
          }
          return { item: raw, time: now, served: false };
        });
        onSubmitOrder(selectedTableId, foods, [], guestAllergens);
      }
    }
    setSubmitted(true);
    setEditMode(false);
  };

  const handleEdit = () => {
    setSubmitted(false);
    setEditMode(true);
  };

  const conflictingItems = orderItems.filter((oi) => {
    const menuItem = MENU_ITEMS.find((m) => m.id === oi.id);
    if (!menuItem) return false;
    return menuItem.ingredients.some((ing) => ing.allergen && guestAllergens.includes(ing.allergen));
  });

  const selectedTableData = tables.find((t) => t.id === selectedTableId);

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-6 space-y-6">

      {submitted && !editMode ? (
        <div className="text-center py-16 space-y-4">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto" style={{ backgroundColor: "rgba(96,194,117,0.12)", border: "1px solid rgba(96,194,117,0.3)" }}>
            <CheckCircle size={32} style={{ color: "#60C275" }} />
          </div>
          <h3 className="text-xl font-medium" style={{ color: C.cream }}>Zamówienie przyjęte</h3>
          <p className="text-sm" style={{ color: "rgba(243,239,234,0.5)" }}>
            Stolik {selectedTableData?.number ?? selectedTableId} — {orderMode === "text" ? "zamówienie ręczne" : `${orderItems.length} pozycji`}
          </p>
          <button
            onClick={handleEdit}
            className="mt-4 px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 inline-flex items-center gap-2"
            style={{ backgroundColor: "rgba(243,239,234,0.04)", border: `1px solid ${C.border}`, color: "rgba(243,239,234,0.6)" }}
          >
            <Edit3 size={14} /> Edytuj / Dopisz kolejkę
          </button>
        </div>
      ) : (
        <>
          {/* Table selection */}
          <div className="rounded-xl p-4" style={{ backgroundColor: C.card, border: `1px solid ${C.border}` }}>
            <p className="text-[11px] uppercase tracking-wider font-medium mb-3" style={{ color: "rgba(243,239,234,0.3)" }}>Stolik</p>
            <div className="flex flex-wrap gap-2">
              {tables.map((t) => {
                const canOrder = t.status !== "available" && t.status !== "upcoming";
                return (
                  <button
                    key={t.id}
                    disabled={!canOrder}
                    onClick={() => {
                      if (!canOrder) return;
                      setSelectedTableId(t.id);
                      if (t.allergies?.length) {
                        setGuestAllergens((prev) => [...new Set([...prev, ...t.allergies!])]);
                      }
                    }}
                    className="px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-150"
                    style={{
                      backgroundColor: selectedTableId === t.id ? "rgba(182,138,58,0.15)" : "rgba(243,239,234,0.03)",
                      color: !canOrder ? "rgba(243,239,234,0.15)" : selectedTableId === t.id ? C.gold : "rgba(243,239,234,0.5)",
                      border: selectedTableId === t.id ? "1px solid rgba(182,138,58,0.3)" : `1px solid ${C.border}`,
                      cursor: canOrder ? "pointer" : "not-allowed",
                      opacity: canOrder ? 1 : 0.4,
                    }}
                  >
                    {t.number}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Allergens */}
          <div className="rounded-xl p-4" style={{ backgroundColor: C.card, border: `1px solid ${C.border}` }}>
            <p className="text-[11px] uppercase tracking-wider font-medium mb-3" style={{ color: "rgba(243,239,234,0.3)" }}>Alergeny gościa</p>
            <div className="flex flex-wrap gap-2 mb-3">
              {ALLERGENS.map((a) => (
                <button
                  key={a} onClick={() => toggleAllergen(a)}
                  className="px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-150"
                  style={guestAllergens.includes(a) ? {
                    backgroundColor: `${ALLERGEN_COLORS[a]}20`,
                    border: `1px solid ${ALLERGEN_COLORS[a]}60`,
                    color: ALLERGEN_COLORS[a],
                  } : {
                    backgroundColor: "rgba(243,239,234,0.03)",
                    border: `1px solid ${C.border}`,
                    color: "rgba(243,239,234,0.4)",
                  }}
                >{a}</button>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text" value={customAllergen} onChange={(e) => setCustomAllergen(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addCustomAllergen()}
                placeholder="Inny alergen…"
                className="flex-1 px-3 py-2 rounded-lg text-xs outline-none"
                style={{ fontFamily: C.sans, backgroundColor: "rgba(243,239,234,0.04)", border: `1px solid ${C.border}`, color: C.cream }}
              />
              <button onClick={addCustomAllergen} className="px-3 py-2 rounded-lg text-xs" style={{ backgroundColor: "rgba(182,138,58,0.1)", color: C.gold, border: "1px solid rgba(182,138,58,0.25)" }}>
                <Plus size={14} />
              </button>
            </div>
            {guestAllergens.filter((a) => !ALLERGENS.includes(a as Allergen)).length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {guestAllergens.filter((a) => !ALLERGENS.includes(a as Allergen)).map((a) => (
                  <span key={a} className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs" style={{ backgroundColor: "rgba(182,138,58,0.1)", border: "1px solid rgba(182,138,58,0.25)", color: C.gold }}>
                    {a}
                    <button onClick={() => setGuestAllergens((prev) => prev.filter((x) => x !== a))} className="opacity-60 hover:opacity-100"><X size={10} /></button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Order mode toggle */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setOrderMode(orderMode === "text" ? "menu" : "text")}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all duration-200"
              style={{ backgroundColor: "rgba(243,239,234,0.04)", border: `1px solid ${C.border}`, color: "rgba(243,239,234,0.6)" }}
            >
              {orderMode === "text" ? <ToggleLeft size={16} style={{ color: C.gold }} /> : <ToggleRight size={16} style={{ color: C.gold }} />}
              {orderMode === "text" ? "Tryb ręczny" : "Tryb z menu"}
            </button>
            <span className="text-xs" style={{ color: "rgba(243,239,234,0.3)" }}>
              {orderMode === "text" ? "Wpisz zamówienie ręcznie" : "Wybierz pozycje z karty"}
            </span>
          </div>

          {/* Order content */}
          {orderMode === "text" ? (
            <div className="rounded-xl p-4" style={{ backgroundColor: C.card, border: `1px solid ${C.border}` }}>
              <p className="text-[11px] uppercase tracking-wider font-medium mb-3" style={{ color: "rgba(243,239,234,0.3)" }}>Zamówienie (ręczne)</p>
              <textarea
                value={textOrder} onChange={(e) => setTextOrder(e.target.value)}
                rows={6}
                placeholder="Wpisz zamówienie gościa…"
                className="w-full px-4 py-3 rounded-lg text-sm outline-none resize-none"
                style={{ fontFamily: C.sans, backgroundColor: "rgba(243,239,234,0.04)", border: `1px solid ${C.border}`, color: C.cream, lineHeight: 1.6 }}
                onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(182,138,58,0.3)"; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = C.border; }}
              />
            </div>
          ) : (
            <div className="space-y-4">
              {/* Menu picker */}
              <div className="rounded-xl p-4" style={{ backgroundColor: C.card, border: `1px solid ${C.border}` }}>
                <p className="text-[11px] uppercase tracking-wider font-medium mb-3" style={{ color: "rgba(243,239,234,0.3)" }}>Dodaj z menu</p>
                <div className="flex gap-1.5 overflow-x-auto scrollbar-hide pb-2 mb-2">
                  {(["Wszystkie", ...MENU_CATEGORIES] as const).map((cat) => (
                    <button
                      key={cat} onClick={() => setOrderMenuCat(cat)}
                      className="px-2.5 py-1.5 rounded-lg text-[11px] font-medium flex-shrink-0 transition-all duration-150"
                      style={{
                        backgroundColor: orderMenuCat === cat ? "rgba(182,138,58,0.15)" : "rgba(243,239,234,0.03)",
                        color: orderMenuCat === cat ? C.gold : "rgba(243,239,234,0.4)",
                        border: orderMenuCat === cat ? "1px solid rgba(182,138,58,0.3)" : `1px solid ${C.border}`,
                      }}
                    >{cat}</button>
                  ))}
                </div>
                <div className="relative mb-3">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "rgba(243,239,234,0.3)" }} />
                  <input
                    type="text" value={menuSearch} onChange={(e) => setMenuSearch(e.target.value)}
                    placeholder="Szukaj…"
                    className="w-full pl-9 pr-4 py-2 rounded-lg text-xs outline-none"
                    style={{ fontFamily: C.sans, backgroundColor: "rgba(243,239,234,0.04)", border: `1px solid ${C.border}`, color: C.cream }}
                  />
                </div>
                <div className="max-h-64 overflow-y-auto space-y-1 scrollbar-hide">
                  {menuFiltered.map((item) => {
                    const hasConflict = item.ingredients.some((ing) => ing.allergen && guestAllergens.includes(ing.allergen));
                    return (
                      <button
                        key={item.id}
                        onClick={() => addFromMenu(item)}
                        className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-all duration-150 hover:bg-white/5"
                        style={hasConflict ? { backgroundColor: "rgba(242,139,130,0.06)", border: "1px solid rgba(242,139,130,0.15)" } : {}}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          {hasConflict && <AlertCircle size={13} style={{ color: "#F28B82", flexShrink: 0 }} />}
                          <span className="text-sm truncate" style={{ color: hasConflict ? "#F28B82" : C.cream }}>{item.name}</span>
                          {item.diet === "vegan" && (
                            <>
                              <span className="text-[9px] px-1 py-0.5 rounded font-semibold flex-shrink-0" style={{ backgroundColor: "rgba(76,175,80,0.12)", color: "#4CAF50" }}>Wg</span>
                              <span className="text-[9px] px-1 py-0.5 rounded font-semibold flex-shrink-0" style={{ backgroundColor: "rgba(139,195,74,0.12)", color: "#8BC34A" }}>W</span>
                            </>
                          )}
                          {item.diet === "vegetarian" && <span className="text-[9px] px-1 py-0.5 rounded font-semibold flex-shrink-0" style={{ backgroundColor: "rgba(139,195,74,0.12)", color: "#8BC34A" }}>W</span>}
                          <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ backgroundColor: "rgba(243,239,234,0.04)", color: "rgba(243,239,234,0.3)" }}>{item.category}</span>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                          <span className="text-xs tabular-nums" style={{ color: C.gold }}>{item.price} zł</span>
                          <Plus size={14} style={{ color: "rgba(243,239,234,0.3)" }} />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Current order */}
              {orderItems.length > 0 && (
                <div className="rounded-xl p-4" style={{ backgroundColor: C.card, border: `1px solid ${C.border}` }}>
                  <p className="text-[11px] uppercase tracking-wider font-medium mb-3" style={{ color: "rgba(243,239,234,0.3)" }}>
                    Zamówienie ({orderItems.reduce((s, i) => s + i.qty, 0)} poz.)
                  </p>
                  <div className="space-y-2">
                    {orderItems.map((oi) => {
                      const isConflict = conflictingItems.some((c) => c.id === oi.id);
                      return (
                        <div key={oi.id} className="rounded-lg overflow-hidden" style={{ backgroundColor: isConflict ? "rgba(242,139,130,0.06)" : "rgba(243,239,234,0.02)", border: `1px solid ${isConflict ? "rgba(242,139,130,0.2)" : C.border}` }}>
                          <div className="flex items-center gap-3 px-3 py-2.5">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                {isConflict && <AlertCircle size={12} style={{ color: "#F28B82" }} />}
                                <span className="text-sm" style={{ color: isConflict ? "#F28B82" : C.cream }}>{oi.name}{oi.qty > 1 ? ` ×${oi.qty}` : ""}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-1.5 flex-shrink-0">
                              <button onClick={() => updateItemQty(oi.id, -1)} className="w-6 h-6 rounded flex items-center justify-center text-xs" style={{ backgroundColor: "rgba(243,239,234,0.04)", color: "rgba(243,239,234,0.5)" }}>−</button>
                              <span className="text-sm tabular-nums w-5 text-center" style={{ color: C.cream }}>{oi.qty}</span>
                              <button onClick={() => updateItemQty(oi.id, 1)} className="w-6 h-6 rounded flex items-center justify-center text-xs" style={{ backgroundColor: "rgba(243,239,234,0.04)", color: "rgba(243,239,234,0.5)" }}>+</button>
                            </div>
                            <button onClick={() => removeItem(oi.id)} className="p-1 opacity-40 hover:opacity-100 transition-opacity">
                              <Trash2 size={14} style={{ color: "#F28B82" }} />
                            </button>
                          </div>
                          <div className="px-3 pb-2.5 space-y-1.5">
                            {oi.perNotes.map((note, ni) => (
                              <input
                                key={ni}
                                type="text"
                                value={note}
                                onChange={(e) => updateItemNote(oi.id, ni, e.target.value)}
                                placeholder={oi.qty > 1 ? `Uwagi #${ni + 1}…` : "Uwagi…"}
                                className="w-full text-xs px-0 py-0.5 bg-transparent outline-none"
                                style={{ color: "rgba(243,239,234,0.4)", borderBottom: `1px solid ${C.border}` }}
                              />
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-3" style={{ borderTop: `1px solid ${C.border}` }}>
                    <span className="text-xs" style={{ color: "rgba(243,239,234,0.4)" }}>Suma</span>
                    <span className="text-sm font-semibold tabular-nums" style={{ color: C.gold }}>
                      {orderItems.reduce((sum, oi) => { const mi = MENU_ITEMS.find((m) => m.id === oi.id); return sum + (mi?.price ?? 0) * oi.qty; }, 0)} zł
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Allergen warning */}
          {conflictingItems.length > 0 && orderMode === "menu" && (
            <div className="flex items-start gap-2 rounded-xl px-4 py-3" style={{ backgroundColor: "rgba(242,139,130,0.08)", border: "1px solid rgba(242,139,130,0.2)" }}>
              <AlertCircle size={16} className="mt-0.5 flex-shrink-0" style={{ color: "#F28B82" }} />
              <div>
                <p className="text-xs font-medium" style={{ color: "#F28B82" }}>Uwaga — konflikty alergenowe</p>
                <p className="text-xs mt-1" style={{ color: "rgba(242,139,130,0.7)" }}>
                  {conflictingItems.map((c) => c.name).join(", ")} — zawierają alergeny zaznaczone przez gościa.
                </p>
              </div>
            </div>
          )}

          {/* Submit button */}
          <div className="flex gap-3">
            <button
              onClick={handleSubmit}
              disabled={!selectedTableId || (orderMode === "text" ? !textOrder.trim() : orderItems.length === 0)}
              className="flex-1 py-3.5 rounded-xl text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2"
              style={{
                backgroundColor: (!selectedTableId || (orderMode === "text" ? !textOrder.trim() : orderItems.length === 0)) ? "rgba(182,138,58,0.2)" : C.gold,
                color: "#1E1A16",
                opacity: (!selectedTableId || (orderMode === "text" ? !textOrder.trim() : orderItems.length === 0)) ? 0.5 : 1,
              }}
            >
              <Send size={15} />
              {editMode ? "Zatwierdź edycję" : "Przyjmij zamówienie"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   MAIN DASHBOARD
══════════════════════════════════════════════════════════ */
type ViewMode = "grid" | "floorplan";
type DashboardTab = "sala" | "menu" | "order";

export function StaffDashboardPage() {
  const clock = useClock();
  const nav = useNavigate();
  const [tables, setTables] = useState<TableData[]>(INITIAL_TABLES);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [sectionFilter, setSectionFilter] = useState<SectionFilter>("Wszystkie");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [activeTab, setActiveTab] = useState<DashboardTab>("sala");
  const [orderPrefillTable, setOrderPrefillTable] = useState<string | null>(null);
  const [orderPrefillAllergens, setOrderPrefillAllergens] = useState<string[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const goToOrder = (tableId: string, allergens?: string[]) => {
    setOrderPrefillTable(tableId);
    setOrderPrefillAllergens(allergens ?? []);
    setActiveTab("order");
    setSelectedId(null);
  };

  const toggleFoodServed = (tableId: string, foodIndex: number) => {
    setTables((prev) => prev.map((t) => {
      if (t.id !== tableId || !t.foodOrders) return t;
      return { ...t, foodOrders: t.foodOrders.map((f, i) => i === foodIndex ? { ...f, served: !f.served } : f) };
    }));
  };

  const toggleDrinkServed = (tableId: string, drinkIndex: number) => {
    setTables((prev) => prev.map((t) => {
      if (t.id !== tableId || !t.drinkOrders) return t;
      return { ...t, drinkOrders: t.drinkOrders.map((d, i) => i === drinkIndex ? { ...d, served: !d.served } : d) };
    }));
  };

  const toggleRefillServed = (tableId: string, drinkIndex: number, refillIndex: number) => {
    setTables((prev) => prev.map((t) => {
      if (t.id !== tableId || !t.drinkOrders) return t;
      return {
        ...t,
        drinkOrders: t.drinkOrders.map((d, di) => {
          if (di !== drinkIndex || !d.refills) return d;
          return { ...d, refills: d.refills.map((r, ri) => ri === refillIndex ? { ...r, served: !r.served } : r) };
        }),
      };
    }));
  };

  const batchToggleFoodServed = (tableId: string, indices: number[]) => {
    setTables((prev) => prev.map((t) => {
      if (t.id !== tableId || !t.foodOrders) return t;
      const allServed = indices.every((i) => t.foodOrders![i]?.served);
      const target = !allServed;
      return { ...t, foodOrders: t.foodOrders.map((f, i) => indices.includes(i) ? { ...f, served: target } : f) };
    }));
  };

  const batchToggleDrinkServed = (tableId: string, indices: number[]) => {
    setTables((prev) => prev.map((t) => {
      if (t.id !== tableId || !t.drinkOrders) return t;
      const allServed = indices.every((i) => t.drinkOrders![i]?.served);
      const target = !allServed;
      return { ...t, drinkOrders: t.drinkOrders.map((d, i) => indices.includes(i) ? { ...d, served: target } : d) };
    }));
  };

  const addRefill = (tableId: string, drinkIndex: number) => {
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;
    setTables((prev) => prev.map((t) => {
      if (t.id !== tableId || !t.drinkOrders) return t;
      return {
        ...t,
        drinkOrders: t.drinkOrders.map((d, di) => {
          if (di !== drinkIndex) return d;
          const existing = d.refills ?? [];
          return { ...d, refills: [...existing, { number: existing.length + 1, time: timeStr, served: false }] };
        }),
      };
    }));
  };

  const handleOrderSubmit = (tableId: string, foodOrders: FoodOrder[], drinkOrders: DrinkOrder[], allergens: string[]) => {
    setTables((prev) =>
      prev.map((t) => {
        if (t.id !== tableId) return t;
        const newStatus: TableStatus = (t.status === "seated" || t.status === "upcoming") ? "ordering" : t.status;
        return {
          ...t,
          status: newStatus,
          foodOrders: [...(t.foodOrders ?? []), ...foodOrders],
          drinkOrders: [...(t.drinkOrders ?? []), ...drinkOrders],
          allergies: allergens.length > 0 ? [...new Set([...(t.allergies ?? []), ...allergens])] : t.allergies,
        };
      })
    );
  };

  const selectedTable = tables.find((t) => t.id === selectedId) ?? null;

  // Filter
  const filteredTables =
    sectionFilter === "Wszystkie"
      ? tables
      : tables.filter((t) => t.section === sectionFilter);

  // Sort by priority (urgent first)
  const sortedTables = [...filteredTables].sort(
    (a, b) => STATUS[a.status].priority - STATUS[b.status].priority
  );

  const handleAction = (id: string, action: string) => {
    if (action === "flag") {
      setTables((prev) =>
        prev.map((t) => {
          if (t.id !== id) return t;
          const wasFlagged = t.flagged;
          return {
            ...t,
            flagged: !wasFlagged,
            notes: wasFlagged
              ? (t.notes ?? []).filter((n) => n !== "⚑ Wymaga uwagi")
              : [...(t.notes ?? []), "⚑ Wymaga uwagi"],
          };
        })
      );
      return;
    }
    if (action.startsWith("walkin:")) {
      const size = parseInt(action.split(":")[1], 10) || 1;
      const now = new Date();
      const timeStr = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;
      setTables((prev) =>
        prev.map((t) => (t.id === id ? { ...t, status: "seated" as TableStatus, seatedAt: timeStr, partySize: size } : t))
      );
      setSelectedId(id);
      return;
    }
    setTables((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: action as TableStatus } : t))
    );
    setSelectedId(null);
  };

  // Stats
  const seated = tables.filter((t) => ["seated", "ordering", "last-round", "leaving"].includes(t.status)).length;
  const available = tables.filter((t) => t.status === "available").length;
  const upcoming = tables.filter((t) => t.status === "upcoming").length;
  const vip = tables.filter((t) => t.vip && t.status !== "available").length;

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: C.dark, fontFamily: C.sans }}>

      {/* ─── MOBILE NAV OVERLAY ─── */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileMenuOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-56 flex flex-col" style={{ backgroundColor: C.card, borderRight: `1px solid ${C.border}` }}>
            <div className="flex items-center justify-between px-4 h-14 flex-shrink-0" style={{ borderBottom: `1px solid ${C.border}` }}>
              <span className="text-sm font-light tracking-wider" style={{ color: C.cream }}>Nawigacja</span>
              <button onClick={() => setMobileMenuOpen(false)} className="p-1.5 rounded-lg hover:bg-white/5"><X size={18} style={{ color: "rgba(243,239,234,0.4)" }} /></button>
            </div>
            <nav className="flex-1 py-3 px-2 space-y-1">
              {([
                { id: "sala" as DashboardTab, icon: LayoutGrid, label: "Sala" },
                { id: "menu" as DashboardTab, icon: BookOpen, label: "Menu" },
                { id: "order" as DashboardTab, icon: ClipboardList, label: "Zamówienie" },
              ]).map((tab) => (
                <button key={tab.id}
                  onClick={() => { setActiveTab(tab.id); setMobileMenuOpen(false); if (tab.id !== "order") { setOrderPrefillTable(null); setOrderPrefillAllergens([]); } }}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all w-full text-left"
                  style={{ backgroundColor: activeTab === tab.id ? "rgba(182,138,58,0.12)" : "transparent", color: activeTab === tab.id ? C.gold : "rgba(243,239,234,0.4)", border: activeTab === tab.id ? "1px solid rgba(182,138,58,0.2)" : "1px solid transparent" }}>
                  <tab.icon size={18} className="flex-shrink-0" />
                  <span className="text-sm font-medium">{tab.label}</span>
                </button>
              ))}
            </nav>
          </aside>
        </div>
      )}

      {/* ─── HEADER ─── */}
      <header
        className="flex items-center justify-between px-4 md:px-6 h-14 flex-shrink-0"
        style={{ backgroundColor: C.card, borderBottom: `1px solid ${C.border}` }}
      >
        <div className="flex items-center gap-3">
          <button onClick={() => setMobileMenuOpen(true)} className="md:hidden p-1.5 -ml-1 rounded-lg hover:bg-white/5" style={{ color: "rgba(243,239,234,0.4)" }}>
            <Menu size={20} />
          </button>
          <div className="w-1.5 h-6 rounded-full hidden sm:block" style={{ backgroundColor: C.gold }} />
          <span className="text-base sm:text-lg font-light tracking-wider" style={{ color: C.cream }}>
            La Maison Dorée
          </span>
          <span
            className="text-[10px] px-2 py-0.5 rounded uppercase tracking-wider font-medium hidden sm:inline"
            style={{ backgroundColor: "rgba(96,194,117,0.1)", color: "#60C275", border: "1px solid rgba(96,194,117,0.2)" }}
          >
            Na żywo
          </span>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          <span className="text-sm hidden sm:block" style={{ color: "rgba(243,239,234,0.35)" }}>
            Serwis wieczorny
          </span>
          <span className="text-xs sm:text-sm tabular-nums font-medium" style={{ color: "rgba(243,239,234,0.6)", letterSpacing: "0.03em" }}>
            {clock}
          </span>
          {(() => {
            const auth = (() => { try { return JSON.parse(sessionStorage.getItem("lmd_auth") ?? "{}"); } catch { return {}; } })();
            return auth.name ? (
              <span className="text-xs hidden md:block" style={{ color: "rgba(243,239,234,0.4)" }}>{auth.name}</span>
            ) : null;
          })()}
          <button
            onClick={() => { sessionStorage.removeItem("lmd_auth"); nav("/login"); }}
            className="w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:bg-white/10"
            style={{ backgroundColor: "rgba(242,139,130,0.08)", border: "1px solid rgba(242,139,130,0.2)" }}
            title="Wyloguj się"
          >
            <LogOut size={14} style={{ color: "#F28B82" }} />
          </button>
        </div>
      </header>

      {/* ─── BODY: sidebar + content ─── */}
      <div className="flex-1 flex overflow-hidden">

        {/* Left sidebar navigation (desktop) */}
        <nav className="hidden md:flex w-48 flex-shrink-0 flex-col py-3 px-3 gap-1 overflow-y-auto" style={{ backgroundColor: C.card, borderRight: `1px solid ${C.border}` }}>
          {([
            { id: "sala" as DashboardTab, icon: LayoutGrid, label: "Sala" },
            { id: "menu" as DashboardTab, icon: BookOpen, label: "Menu" },
            { id: "order" as DashboardTab, icon: ClipboardList, label: "Zamówienie" },
          ]).map((tab) => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); if (tab.id !== "order") { setOrderPrefillTable(null); setOrderPrefillAllergens([]); } }}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 w-full text-left"
              style={{
                backgroundColor: activeTab === tab.id ? "rgba(182,138,58,0.12)" : "transparent",
                color: activeTab === tab.id ? C.gold : "rgba(243,239,234,0.4)",
                border: activeTab === tab.id ? "1px solid rgba(182,138,58,0.2)" : "1px solid transparent",
              }}
            >
              <tab.icon size={18} className="flex-shrink-0" />
              <span className="text-sm font-medium">{tab.label}</span>
            </button>
          ))}
        </nav>

        {/* Main content area */}
      <main className="flex-1 overflow-y-auto">
          {activeTab === "menu" && <MenuView />}
          {activeTab === "order" && (
            <OrderView tables={tables} prefillTableId={orderPrefillTable} prefillAllergens={orderPrefillAllergens} onSubmitOrder={handleOrderSubmit} />
          )}
          {activeTab === "sala" && (
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 space-y-4">

          {/* Stats row */}
          <div className="flex gap-3">
            <StatCard value={seated} label="Zajęte" accent="#60C275" />
            <StatCard value={available} label="Wolne" accent="rgba(243,239,234,0.3)" />
            <StatCard value={upcoming} label="Przybywa" accent="#7AAFE8" />
            <StatCard value={vip} label="VIP" accent={C.gold} />
          </div>

          {/* Alert banner */}
          <AlertBanner tables={tables} />

          {/* Upcoming arrivals */}
          <ArrivalsStrip />

          {/* View toggle + Section filter + status legend */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3">
              {/* View mode toggle */}
              <div className="flex rounded-lg overflow-hidden" style={{ border: `1px solid ${C.border}` }}>
                <button
                  onClick={() => setViewMode("grid")}
                  className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium transition-all duration-150"
                  style={{
                    backgroundColor: viewMode === "grid" ? "rgba(182,138,58,0.15)" : "transparent",
                    color: viewMode === "grid" ? C.gold : "rgba(243,239,234,0.35)",
                  }}
                >
                  <LayoutGrid size={14} />
                  Karty
                </button>
                <button
                  onClick={() => setViewMode("floorplan")}
                  className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium transition-all duration-150"
                  style={{
                    backgroundColor: viewMode === "floorplan" ? "rgba(182,138,58,0.15)" : "transparent",
                    color: viewMode === "floorplan" ? C.gold : "rgba(243,239,234,0.35)",
                    borderLeft: `1px solid ${C.border}`,
                  }}
                >
                  <MapIcon size={14} />
                  Plan sali
                </button>
              </div>

              {/* Section filter — only in grid mode */}
              {viewMode === "grid" && (
            <div className="flex gap-1.5 overflow-x-auto scrollbar-hide pb-1">
              {SECTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => setSectionFilter(s)}
                  className="px-4 py-2 rounded-lg text-sm font-medium flex-shrink-0 transition-all duration-150"
                  style={{
                    backgroundColor: sectionFilter === s ? "rgba(182,138,58,0.15)" : "rgba(243,239,234,0.03)",
                    color: sectionFilter === s ? C.gold : "rgba(243,239,234,0.4)",
                    border: sectionFilter === s ? "1px solid rgba(182,138,58,0.3)" : `1px solid ${C.border}`,
                  }}
                >
                  {s}
                </button>
              ))}
                </div>
              )}
            </div>

            {/* Status legend — only in grid mode */}
            {viewMode === "grid" && (
            <div className="flex flex-wrap gap-3">
              {(["seated", "ordering", "last-round", "leaving", "upcoming"] as TableStatus[]).map((st) => (
                <div key={st} className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: STATUS[st].stripe }} />
                  <span className="text-xs" style={{ color: "rgba(243,239,234,0.35)" }}>{STATUS[st].label}</span>
                </div>
              ))}
            </div>
            )}
          </div>

          {/* ─── CONTENT: grid or floor plan ─── */}
          {viewMode === "grid" ? (
          <CardGrid>
            {sortedTables.map((t) => (
              <TableCard
                key={t.id}
                table={t}
                selected={t.id === selectedId}
                onSelect={() => setSelectedId(t.id)}
                onAction={handleAction}
              />
            ))}
          </CardGrid>
          ) : (
            <div className="pb-4">
              <FloorPlanView
                tables={tables}
                selectedId={selectedId}
                onSelect={(id) => setSelectedId(id)}
              />
          </div>
          )}
        </div>
          )}
      </main>
      </div>

      {/* ─── FOOTER STATUS BAR ─── */}
      <footer
        className="flex items-center justify-between px-4 md:px-6 h-10 flex-shrink-0 text-xs"
        style={{ backgroundColor: C.card, borderTop: `1px solid ${C.border}`, color: "rgba(243,239,234,0.3)" }}
      >
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "#60C275" }} />
            System aktywny
          </span>
          <span>Sala: {seated} aktywnych stolików</span>
        </div>
        <div className="flex items-center gap-3">
          <span>Serwis wieczorny · 26 lut</span>
          <button
            className="flex items-center gap-1 opacity-50 hover:opacity-100 transition-opacity"
            onClick={() => { setTables(INITIAL_TABLES); setSelectedId(null); }}
          >
            <RefreshCw size={11} /> Resetuj demo
          </button>
        </div>
      </footer>

      {/* ─── DETAIL DRAWER (only in grid mode) ─── */}
      {activeTab === "sala" && viewMode === "grid" && selectedTable && (
        <DetailDrawer
          table={selectedTable}
          onAction={handleAction}
          onClose={() => setSelectedId(null)}
          onOrderClick={goToOrder}
          onToggleFoodServed={toggleFoodServed}
          onToggleDrinkServed={toggleDrinkServed}
          onToggleRefillServed={toggleRefillServed}
          onAddRefill={addRefill}
          onBatchToggleFoodServed={batchToggleFoodServed}
          onBatchToggleDrinkServed={batchToggleDrinkServed}
        />
      )}

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        .line-clamp-1 { display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden; }
        @keyframes flagPulse { 0%,100% { opacity: 0.6; } 50% { opacity: 1; } }
      `}</style>
    </div>
  );
}
