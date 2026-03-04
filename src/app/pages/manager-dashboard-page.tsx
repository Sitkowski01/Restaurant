import { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import {
  BarChart3, CalendarDays, Utensils, UserCog, BookOpen,
  ChevronLeft, ChevronRight, LogOut, UserCheck, Clock,
  Plus, X, Check, AlertCircle, Search, Eye, Edit3, Trash2,
  Phone, Mail, Calendar, Users, XCircle, Wine, Leaf, Flame,
  ChefHat, Award, GripVertical, Smartphone, Info, Ban, Menu,
} from "lucide-react";

const T = {
  gold: "#B68A3A", cream: "#F3EFEA", dark: "#0E1714", card: "#182522",
  panel: "#1A2B26", border: "rgba(243,239,234,0.07)", subtle: "rgba(243,239,234,0.04)",
  muted: "rgba(243,239,234,0.35)", text: "rgba(243,239,234,0.7)",
  sans: "Inter, sans-serif", serif: "Cormorant Garamond, serif",
  green: "#60C275", red: "#F28B82", blue: "#7AAFE8", amber: "#F6BF60", purple: "#B39DDB",
};

type ManagerSection = "overview" | "reservations" | "tables" | "menu" | "schedule" | "staff";

const NAV_ITEMS: { id: ManagerSection; label: string; icon: React.ComponentType<{ size: number; style?: React.CSSProperties }> }[] = [
  { id: "overview",     label: "Przegląd",    icon: BarChart3 },
  { id: "reservations", label: "Rezerwacje",  icon: CalendarDays },
  { id: "tables",       label: "Stoliki",     icon: Utensils },
  { id: "menu",         label: "Menu",        icon: BookOpen },
  { id: "schedule",     label: "Grafik",      icon: Clock },
  { id: "staff",        label: "Zespół",      icon: UserCog },
];

/* ══════════════════════════════════════════════════════
   SHARED UTILITY COMPONENTS
══════════════════════════════════════════════════════ */
function Badge({ label, color, bg }: { label: string; color: string; bg: string }) {
  return (
    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap" style={{ backgroundColor: bg, color, border: `1px solid ${color}20` }}>
      {label}
    </span>
  );
}

function SectionTitle({ children, sub }: { children: React.ReactNode; sub?: string }) {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-light tracking-wide" style={{ color: T.cream, fontFamily: T.serif, fontSize: "1.6rem" }}>{children}</h2>
      {sub && <p className="text-sm mt-1" style={{ color: T.muted }}>{sub}</p>}
    </div>
  );
}

function Card({ children, className = "", style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  return <div className={`rounded-xl ${className}`} style={{ backgroundColor: T.card, border: `1px solid ${T.border}`, ...style }}>{children}</div>;
}

function BtnPrimary({ children, onClick, small, disabled }: { children: React.ReactNode; onClick?: () => void; small?: boolean; disabled?: boolean }) {
  return (
    <button onClick={onClick} disabled={disabled} className={`${small ? "px-3 py-1.5 text-xs" : "px-4 py-2.5 text-sm"} rounded-lg font-medium transition-all active:scale-[0.97] disabled:opacity-40`} style={{ backgroundColor: T.gold, color: "#1E1A16" }}>
      {children}
    </button>
  );
}

function BtnSecondary({ children, onClick, small, active }: { children: React.ReactNode; onClick?: () => void; small?: boolean; active?: boolean }) {
  return (
    <button onClick={onClick} className={`${small ? "px-3 py-1.5 text-xs" : "px-4 py-2.5 text-sm"} rounded-lg font-medium transition-all active:scale-[0.97]`}
      style={{ backgroundColor: active ? "rgba(182,138,58,0.12)" : T.subtle, color: active ? T.gold : T.text, border: active ? "1px solid rgba(182,138,58,0.25)" : `1px solid ${T.border}` }}>
      {children}
    </button>
  );
}

function InputField({ placeholder, value, onChange, icon: Icon }: { placeholder: string; value: string; onChange: (v: string) => void; icon?: React.ComponentType<{ size: number; style?: React.CSSProperties }> }) {
  return (
    <div className="relative">
      {Icon && <div className="absolute left-3 top-1/2 -translate-y-1/2"><Icon size={15} style={{ color: T.muted }} /></div>}
      <input type="text" placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg text-sm py-2.5 outline-none placeholder:text-[rgba(243,239,234,0.25)]"
        style={{ backgroundColor: T.subtle, border: `1px solid ${T.border}`, color: T.cream, paddingLeft: Icon ? "2.5rem" : "0.75rem", paddingRight: "0.75rem" }} />
    </div>
  );
}

function EmptyState({ icon: Icon, message }: { icon: React.ComponentType<{ size: number; style?: React.CSSProperties }>; message: string }) {
  return <div className="flex flex-col items-center justify-center py-16 gap-3"><Icon size={40} style={{ color: T.muted }} /><p className="text-sm" style={{ color: T.muted }}>{message}</p></div>;
}

function DetailRow({ icon: Icon, label, value }: { icon: React.ComponentType<{ size: number; style?: React.CSSProperties }>; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3">
      <Icon size={15} style={{ color: T.muted, flexShrink: 0 }} />
      <span className="text-sm w-20 flex-shrink-0" style={{ color: T.muted }}>{label}</span>
      <span className="text-sm" style={{ color: T.cream }}>{value}</span>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   MOCK DATA ── Reservations
══════════════════════════════════════════════════════ */
type ReservationStatus = "confirmed" | "pending" | "cancelled" | "completed" | "no-show";

interface Reservation {
  id: string; guestName: string; phone: string; email: string; date: string; time: string;
  partySize: number; status: ReservationStatus; table: string; type: "dining" | "event";
  notes: string; createdAt: string; vip?: boolean;
  reminderSms?: "scheduled" | "sent" | "failed"; reminderEmail?: "scheduled" | "sent" | "failed";
}

const RESERVATIONS: Reservation[] = [
  { id: "R-001", guestName: "Zofia Kowalska", phone: "+48 501 234 567", email: "zofia@mail.com", date: "2026-02-26", time: "19:30", partySize: 2, status: "confirmed", table: "O1", type: "dining", notes: "Stały gość VIP — preferuje stolik przy oknie", createdAt: "2026-02-20", vip: true, reminderSms: "sent", reminderEmail: "sent" },
  { id: "R-002", guestName: "Marek Lewandowski", phone: "+48 502 345 678", email: "marek@mail.com", date: "2026-02-26", time: "19:30", partySize: 4, status: "confirmed", table: "O2", type: "dining", notes: "Rocznica — tort zamówiony", createdAt: "2026-02-18", reminderSms: "sent", reminderEmail: "sent" },
  { id: "R-003", guestName: "Rodzina Nowaków", phone: "+48 503 456 789", email: "nowak@mail.com", date: "2026-02-26", time: "20:00", partySize: 2, status: "pending", table: "O3", type: "dining", notes: "Alergia na skorupiaki", createdAt: "2026-02-22", reminderSms: "scheduled", reminderEmail: "scheduled" },
  { id: "R-004", guestName: "Piotr Wiśniewski", phone: "+48 504 567 890", email: "piotr@mail.com", date: "2026-02-26", time: "19:45", partySize: 4, status: "confirmed", table: "S6", type: "dining", notes: "Menu degustacyjne + dobór win", createdAt: "2026-02-19", reminderSms: "sent", reminderEmail: "sent" },
  { id: "R-005", guestName: "Orlen Corp.", phone: "+48 22 456 78 90", email: "events@orlen.pl", date: "2026-02-26", time: "19:30", partySize: 6, status: "confirmed", table: "S5", type: "dining", notes: "Konto korporacyjne VIP — alergia na orzechy", createdAt: "2026-02-15", vip: true, reminderSms: "sent", reminderEmail: "sent" },
  { id: "R-006", guestName: "Klara Kamińska", phone: "+48 505 678 901", email: "klara@mail.com", date: "2026-02-26", time: "20:30", partySize: 4, status: "pending", table: "S4", type: "dining", notes: "", createdAt: "2026-02-24", reminderSms: "scheduled", reminderEmail: "scheduled" },
  { id: "R-007", guestName: "Antoni Zieliński", phone: "+48 506 789 012", email: "antoni@mail.com", date: "2026-02-26", time: "20:15", partySize: 2, status: "confirmed", table: "S2", type: "dining", notes: "Urodziny — deser ze świeczką", createdAt: "2026-02-21", reminderSms: "sent", reminderEmail: "sent" },
  { id: "R-008", guestName: "Jan Mazur", phone: "+48 507 890 123", email: "jan@mail.com", date: "2026-02-26", time: "21:00", partySize: 5, status: "confirmed", table: "B1", type: "dining", notes: "Kolacja po konferencji", createdAt: "2026-02-23", reminderSms: "scheduled", reminderEmail: "scheduled" },
  { id: "R-009", guestName: "Kowalski & Syn", phone: "+48 508 901 234", email: "kowalski@mail.com", date: "2026-02-25", time: "19:30", partySize: 2, status: "completed", table: "B3", type: "dining", notes: "Rachunek opłacony", createdAt: "2026-02-20", reminderSms: "sent", reminderEmail: "sent" },
  { id: "R-010", guestName: "Maria Wójcik", phone: "+48 509 012 345", email: "maria@mail.com", date: "2026-02-25", time: "20:00", partySize: 3, status: "no-show", table: "S3", type: "dining", notes: "Brak kontaktu telefonicznego", createdAt: "2026-02-19", reminderSms: "sent", reminderEmail: "failed" },
  { id: "R-011", guestName: "Łukasz Kaczmarek", phone: "+48 510 123 456", email: "lukasz@mail.com", date: "2026-02-27", time: "19:30", partySize: 2, status: "confirmed", table: "O1", type: "dining", notes: "", createdAt: "2026-02-25", reminderSms: "scheduled", reminderEmail: "scheduled" },
  { id: "R-012", guestName: "Gala Firmowa PKO BP", phone: "+48 22 567 89 01", email: "events@pkobp.pl", date: "2026-03-05", time: "19:00", partySize: 40, status: "confirmed", table: "Cała sala", type: "event", notes: "Menu 5-daniowe + welcome drink", createdAt: "2026-01-15", vip: true, reminderSms: "scheduled", reminderEmail: "scheduled" },
];

const RESERVATION_STATUS_META: Record<ReservationStatus, { label: string; color: string; bg: string }> = {
  confirmed: { label: "Potwierdzona", color: T.green, bg: "rgba(96,194,117,0.1)" },
  pending:   { label: "Oczekująca",   color: T.amber, bg: "rgba(246,191,96,0.1)" },
  cancelled: { label: "Anulowana",    color: T.red,   bg: "rgba(242,139,130,0.1)" },
  completed: { label: "Zrealizowana", color: T.blue,  bg: "rgba(122,175,232,0.1)" },
  "no-show": { label: "Nieobecność",  color: T.red,   bg: "rgba(242,139,130,0.1)" },
};

type ReminderStatus = "scheduled" | "sent" | "failed";
const REMINDER_STATUS_META: Record<ReminderStatus, { label: string; color: string; bg: string }> = {
  scheduled: { label: "Zaplanowane", color: T.amber, bg: "rgba(246,191,96,0.1)" },
  sent:      { label: "Wysłane",     color: T.green, bg: "rgba(96,194,117,0.1)" },
  failed:    { label: "Błąd",        color: T.red,   bg: "rgba(242,139,130,0.1)" },
};

/* ══════════════════════════════════════════════════════
   MOCK DATA ── Tables
══════════════════════════════════════════════════════ */
interface TableDef {
  id: string; number: string; section: string; capacity: number; isActive: boolean; minParty: number; notes: string;
}

const TABLES: TableDef[] = [
  { id: "t1",  number: "O1", section: "Okno", capacity: 4, isActive: true,  minParty: 1, notes: "Widok na ogród" },
  { id: "t2",  number: "O2", section: "Okno", capacity: 4, isActive: true,  minParty: 2, notes: "Stolik narożny" },
  { id: "t3",  number: "O3", section: "Okno", capacity: 4, isActive: true,  minParty: 1, notes: "" },
  { id: "t4",  number: "O4", section: "Okno", capacity: 4, isActive: true,  minParty: 1, notes: "" },
  { id: "t5",  number: "S1", section: "Sala", capacity: 4, isActive: true,  minParty: 1, notes: "" },
  { id: "t6",  number: "S2", section: "Sala", capacity: 4, isActive: true,  minParty: 1, notes: "" },
  { id: "t7",  number: "S3", section: "Sala", capacity: 4, isActive: true,  minParty: 2, notes: "" },
  { id: "t8",  number: "S4", section: "Sala", capacity: 4, isActive: true,  minParty: 2, notes: "" },
  { id: "t9",  number: "S5", section: "Sala", capacity: 8, isActive: true,  minParty: 4, notes: "Duży prostokątny" },
  { id: "t10", number: "S6", section: "Sala", capacity: 8, isActive: true,  minParty: 4, notes: "Duży prostokątny" },
  { id: "t11", number: "B1", section: "Boks", capacity: 6, isActive: true,  minParty: 2, notes: "Zacisze, romantyk" },
  { id: "t12", number: "B2", section: "Boks", capacity: 6, isActive: true,  minParty: 2, notes: "Boks kątowy" },
  { id: "t13", number: "B3", section: "Boks", capacity: 6, isActive: true,  minParty: 2, notes: "Boks narożny" },
];

const TIME_SLOT_PERFORMANCE = [
  { slot: "18:00", avg: 12 }, { slot: "18:30", avg: 18 }, { slot: "19:00", avg: 32 }, { slot: "19:30", avg: 38 },
  { slot: "20:00", avg: 36 }, { slot: "20:30", avg: 28 }, { slot: "21:00", avg: 20 }, { slot: "21:30", avg: 10 },
];

/* ══════════════════════════════════════════════════════
   MOCK DATA ── Menu
══════════════════════════════════════════════════════ */
type MenuCategory = "Przystawki" | "Zupy" | "Dania główne" | "Desery" | "Napoje" | "Koktajle";
const MENU_CATEGORIES: MenuCategory[] = ["Przystawki", "Zupy", "Dania główne", "Desery", "Napoje", "Koktajle"];

const CATEGORY_ICONS: Record<MenuCategory, typeof Utensils> = {
  "Przystawki": Leaf, "Zupy": Flame, "Dania główne": ChefHat, "Desery": Award, "Napoje": Wine, "Koktajle": Wine,
};

interface Ingredient { name: string; allergen?: string; alcohol?: boolean; }
type DietType = "vegetarian" | "vegan";

interface MgrMenuItem {
  id: string; name: string; price: number; description: string; ingredients: Ingredient[];
  category: MenuCategory; isActive: boolean; isSeasonal?: boolean; diet?: DietType;
}

const INITIAL_MENU: MgrMenuItem[] = [
  { id: "m1", name: "Tatar z polędwicy wołowej", price: 58, category: "Przystawki", isActive: true, description: "Klasyczny tatar z marynowanym żółtkiem, kaparami i grzanką brioche.", ingredients: [{ name: "polędwica wołowa" }, { name: "żółtko jaja", allergen: "Jaja" }, { name: "kapary" }, { name: "szalotka" }, { name: "oliwa truflowa" }, { name: "brioche", allergen: "Gluten" }, { name: "masło", allergen: "Laktoza" }] },
  { id: "m2", name: "Carpaccio z buraka z chèvre", price: 42, category: "Przystawki", isActive: true, diet: "vegetarian", description: "Cienkie plastry buraka z kremowym kozim serem, orzechami włoskimi i vinaigrette miodowym.", ingredients: [{ name: "burak" }, { name: "kozi ser", allergen: "Laktoza" }, { name: "orzechy włoskie", allergen: "Orzechy" }, { name: "miód" }, { name: "rukola" }] },
  { id: "m3", name: "Foie gras z konfiturą figową", price: 72, category: "Przystawki", isActive: true, description: "Delikatny foie gras z domową konfiturą z fig i chrupiącą brioche.", ingredients: [{ name: "wątroba kacza" }, { name: "figi" }, { name: "cukier" }, { name: "brioche", allergen: "Gluten" }, { name: "masło", allergen: "Laktoza" }] },
  { id: "m19", name: "Bruschetta z awokado i pomidorami", price: 36, category: "Przystawki", isActive: true, diet: "vegetarian", description: "Chrupiąca ciabatta z kremem z awokado, pomidorami cherry i bazylią.", ingredients: [{ name: "ciabatta", allergen: "Gluten" }, { name: "awokado" }, { name: "pomidory cherry" }, { name: "bazylia" }, { name: "oliwa z oliwek" }] },
  { id: "m4", name: "Bisque z homara", price: 48, category: "Zupy", isActive: true, description: "Aksamitna zupa z homara z kroplą koniaku i kremem śmietanowym.", ingredients: [{ name: "homar", allergen: "Skorupiaki" }, { name: "śmietana", allergen: "Laktoza" }, { name: "koniak", alcohol: true }, { name: "marchewka" }, { name: "seler naciowy", allergen: "Seler" }] },
  { id: "m5", name: "Consommé z grzybami leśnymi", price: 38, category: "Zupy", isActive: true, isSeasonal: true, description: "Klarowny bulion wołowy z sezonowymi grzybami leśnymi i kluseczkami.", ingredients: [{ name: "bulion wołowy" }, { name: "borowiki" }, { name: "kurki" }, { name: "kluseczki", allergen: "Gluten" }, { name: "jaja", allergen: "Jaja" }] },
  { id: "m6", name: "Risotto truflowe", price: 78, category: "Dania główne", isActive: true, diet: "vegetarian", description: "Kremowe risotto z czarną truflą, parmezanem i masłem truflowym.", ingredients: [{ name: "ryż arborio" }, { name: "trufla czarna" }, { name: "parmezan", allergen: "Laktoza" }, { name: "masło", allergen: "Laktoza" }, { name: "wino białe", alcohol: true }] },
  { id: "m7", name: "Polędwica wołowa Wellington", price: 128, category: "Dania główne", isActive: true, description: "Polędwica w cieście francuskim z duxelles grzybowym i foie gras.", ingredients: [{ name: "polędwica wołowa" }, { name: "ciasto francuskie", allergen: "Gluten" }, { name: "pieczarki" }, { name: "wątroba kacza" }, { name: "musztarda", allergen: "Gorczyca" }, { name: "jaja", allergen: "Jaja" }] },
  { id: "m8", name: "Dorsz konfitowany w oliwie", price: 88, category: "Dania główne", isActive: true, description: "Dorsz wolno gotowany w oliwie z puree z selera i sosem beurre blanc.", ingredients: [{ name: "dorsz", allergen: "Ryby" }, { name: "oliwa z oliwek" }, { name: "seler korzeniowy", allergen: "Seler" }, { name: "masło", allergen: "Laktoza" }, { name: "wino białe", alcohol: true }] },
  { id: "m9", name: "Kaczka confit z purée", price: 96, category: "Dania główne", isActive: true, description: "Udko kacze confit z purée ziemniaczanym, konfiturą wiśniową i jus.", ingredients: [{ name: "udko kacze" }, { name: "tłuszcz kaczy" }, { name: "ziemniaki" }, { name: "masło", allergen: "Laktoza" }, { name: "wiśnie" }] },
  { id: "m10", name: "Rack of Lamb", price: 118, category: "Dania główne", isActive: true, description: "Karczek jagnięcy z ziołową panierką, ratatouille i sosem demi-glace.", ingredients: [{ name: "jagnięcina" }, { name: "bułka tarta", allergen: "Gluten" }, { name: "zioła prowansalskie" }, { name: "cukinia" }, { name: "musztarda", allergen: "Gorczyca" }] },
  { id: "m20", name: "Bowl z pieczonymi warzywami", price: 52, category: "Dania główne", isActive: true, diet: "vegan", description: "Komosa ryżowa z pieczonymi warzywami sezonowymi, hummusem i tahini.", ingredients: [{ name: "komosa ryżowa" }, { name: "bataty" }, { name: "cukinia" }, { name: "ciecierzyca" }, { name: "tahini", allergen: "Sezam" }] },
  { id: "m21", name: "Ravioli szpinakowe z ricottą", price: 62, category: "Dania główne", isActive: true, diet: "vegetarian", description: "Domowy makaron z nadzieniem szpinakowym i ricottą w sosie maślanym z szałwią.", ingredients: [{ name: "mąka", allergen: "Gluten" }, { name: "jaja", allergen: "Jaja" }, { name: "szpinak" }, { name: "ricotta", allergen: "Laktoza" }, { name: "masło", allergen: "Laktoza" }] },
  { id: "m11", name: "Crème brûlée waniliowe", price: 36, category: "Desery", isActive: true, description: "Klasyczne crème brûlée z laską wanilii tahitańskiej.", ingredients: [{ name: "śmietana", allergen: "Laktoza" }, { name: "żółtka jaj", allergen: "Jaja" }, { name: "wanilia tahitańska" }, { name: "cukier" }] },
  { id: "m12", name: "Fondant czekoladowy", price: 42, category: "Desery", isActive: true, description: "Ciepły fondant z gorzkiej czekolady 70% z lodami waniliowymi.", ingredients: [{ name: "czekolada 70%" }, { name: "masło", allergen: "Laktoza" }, { name: "jaja", allergen: "Jaja" }, { name: "mąka", allergen: "Gluten" }] },
  { id: "m13", name: "Tarte Tatin", price: 38, category: "Desery", isActive: true, description: "Odwrócona tarta jabłkowa z karmelizowanymi jabłkami i lodami.", ingredients: [{ name: "jabłka" }, { name: "ciasto kruche", allergen: "Gluten" }, { name: "masło", allergen: "Laktoza" }, { name: "cukier" }] },
  { id: "m22", name: "Sorbet z mango i marakui", price: 28, category: "Desery", isActive: true, diet: "vegan", description: "Orzeźwiający sorbet z mango i marakui z miętą i chipsem kokosowym.", ingredients: [{ name: "mango" }, { name: "marakuja" }, { name: "cukier" }, { name: "mięta" }] },
  { id: "m14", name: "Espresso / Doppio", price: 14, category: "Napoje", isActive: true, description: "Kawa specialty z palarni lokalnej.", ingredients: [{ name: "kawa arabica" }] },
  { id: "m15", name: "Herbata premium", price: 18, category: "Napoje", isActive: true, description: "Wybór herbat liściastych: Earl Grey, Jasmine, Sencha, Rooibos.", ingredients: [{ name: "herbata liściasta" }] },
  { id: "m16", name: "Negroni Classico", price: 38, category: "Koktajle", isActive: true, description: "Gin, Campari, słodki wermut — klasyczna proporcja 1:1:1.", ingredients: [{ name: "gin", alcohol: true }, { name: "Campari", alcohol: true }, { name: "wermut słodki", alcohol: true }] },
  { id: "m17", name: "Old Fashioned", price: 42, category: "Koktajle", isActive: true, description: "Bourbon, angostura, cukier trzcinowy, skórka pomarańczy.", ingredients: [{ name: "bourbon", alcohol: true }, { name: "angostura" }, { name: "cukier trzcinowy" }] },
  { id: "m18", name: "Champagne Coupe", price: 48, category: "Koktajle", isActive: true, description: "Kieliszek szampana z domową konfiturą malinową.", ingredients: [{ name: "szampan", alcohol: true }, { name: "konfitury malinowe" }] },
];

const ALLERGENS_LIST = ["Gluten", "Laktoza", "Jaja", "Ryby", "Skorupiaki", "Orzechy", "Soja", "Seler", "Gorczyca", "Sezam", "Mięczaki", "Łubin"];
const ALLERGEN_COLORS: Record<string, string> = { Gluten: "#E8843A", Laktoza: "#7AAFE8", Jaja: "#F6BF60", Ryby: "#60C275", Skorupiaki: "#F28B82", Orzechy: "#D4A843", Soja: "#A3D977", Seler: "#8BC9A3", Gorczyca: "#E8D843", Sezam: "#C9A86C", Mięczaki: "#7A8FE8", Łubin: "#C77AD4" };

/* ══════════════════════════════════════════════════════
   STAFF DATA
══════════════════════════════════════════════════════ */
interface StaffMember {
  id: string; name: string; role: "waiter" | "manager" | "admin"; position: string; status: "active" | "inactive"; avatar?: string; color: string;
}

const STAFF_COLORS = ["#F6BF60", "#7AAFE8", "#60C275", "#F28B82", "#B39DDB", "#E8843A", "#8BC34A", "#C77AD4"];

const STAFF: StaffMember[] = [
  { id: "s1", name: "Mikołaj Sitek",        role: "admin",   position: "Administrator",   status: "active", avatar: "https://i.pravatar.cc/128?img=59", color: STAFF_COLORS[0] },
  { id: "s2", name: "Magdalena Dąbrowska",  role: "manager", position: "Menedżer",        status: "active", avatar: "https://i.pravatar.cc/128?img=25", color: STAFF_COLORS[1] },
  { id: "s3", name: "Jan Kowalski",         role: "waiter",  position: "Kelner/ka",       status: "active", avatar: "https://i.pravatar.cc/150?u=jan", color: STAFF_COLORS[2] },
  { id: "s4", name: "Anna Nowak",           role: "waiter",  position: "Kelner/ka",       status: "active", avatar: "https://i.pravatar.cc/150?u=anna", color: STAFF_COLORS[3] },
  { id: "s5", name: "Marek Wiśniewski",     role: "waiter",  position: "Barman/ka",       status: "active", avatar: "https://i.pravatar.cc/150?u=marek", color: STAFF_COLORS[4] },
  { id: "s6", name: "Ewa Kamińska",         role: "waiter",  position: "Kelner/ka",       status: "active", avatar: "https://i.pravatar.cc/150?u=ewa", color: STAFF_COLORS[5] },
  { id: "s7", name: "Tomasz Zieliński",     role: "waiter",  position: "Sommelier",       status: "active", avatar: "https://i.pravatar.cc/150?u=tomasz", color: STAFF_COLORS[6] },
];

/* ══════════════════════════════════════════════════════
   SCHEDULE MODULE
══════════════════════════════════════════════════════ */
type ShiftType = "morning" | "evening" | "full" | "off";
const SHIFT_LABELS: Record<ShiftType, string> = { morning: "Rano", evening: "Wieczór", full: "Cały dzień", off: "Wolne" };
const SHIFT_COLORS: Record<ShiftType, { bg: string; text: string; border: string }> = {
  morning: { bg: "rgba(246,191,96,0.12)", text: "#F6BF60", border: "rgba(246,191,96,0.25)" },
  evening: { bg: "rgba(122,175,232,0.12)", text: "#7AAFE8", border: "rgba(122,175,232,0.25)" },
  full:    { bg: "rgba(96,194,117,0.12)", text: "#60C275", border: "rgba(96,194,117,0.25)" },
  off:     { bg: "rgba(243,239,234,0.04)", text: "rgba(243,239,234,0.3)", border: "rgba(243,239,234,0.06)" },
};
const SHIFT_HOURS: Record<ShiftType, string> = { morning: "10:00–16:00", evening: "16:00–23:00", full: "10:00–23:00", off: "—" };

type ScheduleKey = string;
const makeKey = (staffId: string, date: string): ScheduleKey => `${staffId}_${date}`;

function getWeekDays(weekOffset: number): { date: string; dayName: string; dayNum: number; isToday: boolean }[] {
  const now = new Date();
  const monday = new Date(now);
  monday.setDate(now.getDate() - now.getDay() + 1 + weekOffset * 7);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const iso = d.toISOString().split("T")[0];
    return { date: iso, dayName: d.toLocaleDateString("pl-PL", { weekday: "short" }), dayNum: d.getDate(), isToday: iso === new Date().toISOString().split("T")[0] };
  });
}

function generateMockSchedule(): Record<ScheduleKey, ShiftType> {
  const result: Record<ScheduleKey, ShiftType> = {};
  for (const staff of STAFF) {
    for (let w = -1; w <= 2; w++) {
      const days = getWeekDays(w);
      for (const day of days) {
        const r = Math.random();
        result[makeKey(staff.id, day.date)] = r < 0.3 ? "morning" : r < 0.6 ? "evening" : r < 0.8 ? "full" : "off";
      }
    }
  }
  return result;
}

/* ══════════════════════════════════════════════════════
   SECTION: OVERVIEW
══════════════════════════════════════════════════════ */
function OverviewSection() {
  const todayRes = RESERVATIONS.filter((r) => r.date === "2026-02-26");
  const stats = [
    { label: "Rezerwacje dziś", value: String(todayRes.length), color: T.blue },
    { label: "Stoliki zajęte", value: `${todayRes.filter((r) => r.status === "confirmed").length}/${TABLES.filter((t) => t.isActive).length}`, color: T.green },
    { label: "Personel na zmianie", value: String(STAFF.filter((s) => s.status === "active").length), color: T.amber },
    { label: "Oczekujące", value: String(todayRes.filter((r) => r.status === "pending").length), color: T.purple },
  ];
  return (
    <div className="space-y-6">
      <SectionTitle sub="Podsumowanie operacyjne restauracji">Przegląd dnia</SectionTitle>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((s) => (
          <Card key={s.label} className="p-4">
            <p className="text-[11px] uppercase tracking-wider mb-2" style={{ color: T.muted }}>{s.label}</p>
            <p className="text-2xl font-light tabular-nums" style={{ color: s.color }}>{s.value}</p>
          </Card>
        ))}
      </div>
      <Card className="p-5">
        <h3 className="text-sm font-medium mb-3" style={{ color: T.cream }}>Nadchodzące rezerwacje</h3>
        {todayRes.filter((r) => r.status === "confirmed" || r.status === "pending").sort((a, b) => a.time.localeCompare(b.time)).map((r, i) => (
          <div key={r.id} className="flex items-center gap-4 py-2.5" style={{ borderTop: i > 0 ? `1px solid ${T.border}` : undefined }}>
            <span className="text-sm tabular-nums font-medium" style={{ color: T.gold, width: 50 }}>{r.time}</span>
            <span className="text-sm flex-1" style={{ color: T.cream }}>{r.guestName}</span>
            <Badge label={RESERVATION_STATUS_META[r.status].label} color={RESERVATION_STATUS_META[r.status].color} bg={RESERVATION_STATUS_META[r.status].bg} />
            <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: T.subtle, color: T.text, border: `1px solid ${T.border}` }}>{r.partySize} os.</span>
            <span className="text-xs font-medium tabular-nums" style={{ color: T.muted }}>Stolik {r.table}</span>
          </div>
        ))}
      </Card>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   SECTION: RESERVATIONS
══════════════════════════════════════════════════════ */
function ReservationsSection() {
  const [search, setSearch] = useState("");
  const [statusF, setStatusF] = useState<ReservationStatus | "all">("all");
  const [detail, setDetail] = useState<Reservation | null>(null);

  const filtered = useMemo(() => {
    return RESERVATIONS.filter((r) => {
      if (statusF !== "all" && r.status !== statusF) return false;
      if (search) {
        const q = search.toLowerCase();
        return r.guestName.toLowerCase().includes(q) || r.id.toLowerCase().includes(q) || r.table.toLowerCase().includes(q);
      }
      return true;
    });
  }, [search, statusF]);

  return (
    <div className="space-y-6">
      <SectionTitle sub="Zarządzanie rezerwacjami gości">Rezerwacje</SectionTitle>

      <div className="flex flex-wrap items-center gap-3">
        <div className="w-72"><InputField placeholder="Szukaj gościa, ID, stolika..." value={search} onChange={setSearch} icon={Search} /></div>
        <div className="flex gap-2">
          {(["all", "confirmed", "pending", "completed", "no-show", "cancelled"] as const).map((s) => (
            <BtnSecondary key={s} small active={statusF === s} onClick={() => setStatusF(s)}>
              {s === "all" ? "Wszystkie" : RESERVATION_STATUS_META[s].label}
            </BtnSecondary>
          ))}
        </div>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm" style={{ color: T.text }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${T.border}` }}>
                {["ID", "Gość", "Data", "Godzina", "Os.", "Stolik", "Status", "Przypomnienia", ""].map((h) => (
                  <th key={h} className="text-left py-3 px-4 text-xs uppercase tracking-wider font-medium" style={{ color: T.muted }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => {
                const sm = RESERVATION_STATUS_META[r.status];
                return (
                  <tr key={r.id} className="cursor-pointer transition-colors hover:bg-white/[0.02]" style={{ borderBottom: `1px solid ${T.border}` }} onClick={() => setDetail(r)}>
                    <td className="py-3 px-4 tabular-nums text-xs" style={{ color: T.muted }}>{r.id}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span style={{ color: T.cream }}>{r.guestName}</span>
                        {r.vip && <span className="text-[9px] px-1.5 py-0.5 rounded font-bold tracking-wider" style={{ backgroundColor: "rgba(182,138,58,0.15)", color: T.gold }}>VIP</span>}
                      </div>
                    </td>
                    <td className="py-3 px-4 tabular-nums">{r.date}</td>
                    <td className="py-3 px-4 tabular-nums">{r.time}</td>
                    <td className="py-3 px-4 text-center">{r.partySize}</td>
                    <td className="py-3 px-4">{r.table}</td>
                    <td className="py-3 px-4"><Badge label={sm.label} color={sm.color} bg={sm.bg} /></td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        {r.reminderSms && (() => { const m = REMINDER_STATUS_META[r.reminderSms]; return <span title={`SMS: ${m.label}`} className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded" style={{ backgroundColor: m.bg, color: m.color }}><Smartphone size={10} />{r.reminderSms === "sent" ? "✓" : r.reminderSms === "failed" ? "✗" : "◷"}</span>; })()}
                        {r.reminderEmail && (() => { const m = REMINDER_STATUS_META[r.reminderEmail]; return <span title={`Email: ${m.label}`} className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded" style={{ backgroundColor: m.bg, color: m.color }}><Mail size={10} />{r.reminderEmail === "sent" ? "✓" : r.reminderEmail === "failed" ? "✗" : "◷"}</span>; })()}
                      </div>
                    </td>
                    <td className="py-3 px-4"><button className="p-1.5 rounded-md hover:bg-white/5 transition-colors" style={{ color: T.muted }}><Eye size={15} /></button></td>
                  </tr>
                );
              })}
              {filtered.length === 0 && <tr><td colSpan={9}><EmptyState icon={Search} message="Brak wyników dla wybranych filtrów" /></td></tr>}
            </tbody>
          </table>
        </div>
      </Card>

      {detail && <ReservationDetail reservation={detail} onClose={() => setDetail(null)} />}
    </div>
  );
}

function ReservationDetail({ reservation: r, onClose }: { reservation: Reservation; onClose: () => void }) {
  const sm = RESERVATION_STATUS_META[r.status];
  return (
    <>
      <div className="fixed inset-0 z-40" style={{ backgroundColor: "rgba(0,0,0,0.5)" }} onClick={onClose} />
      <div className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md overflow-y-auto" style={{ backgroundColor: "#111A17", borderLeft: "1px solid rgba(182,138,58,0.15)" }}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-xs tabular-nums mb-1" style={{ color: T.muted }}>{r.id}</p>
              <h3 className="text-xl font-light" style={{ color: T.cream }}>{r.guestName}</h3>
            </div>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/5" style={{ color: T.muted }}><X size={18} /></button>
          </div>
          <div className="flex gap-2 mb-6">
            <Badge label={sm.label} color={sm.color} bg={sm.bg} />
            {r.vip && <Badge label="VIP" color={T.gold} bg="rgba(182,138,58,0.1)" />}
            <Badge label={r.type === "dining" ? "Kolacja" : "Wydarzenie"} color={T.text} bg={T.subtle} />
          </div>
          <div className="h-px mb-5" style={{ backgroundColor: T.border }} />
          <div className="space-y-3 mb-6">
            <DetailRow icon={Calendar} label="Data" value={r.date} />
            <DetailRow icon={Clock} label="Godzina" value={r.time} />
            <DetailRow icon={Users} label="Osoby" value={`${r.partySize}`} />
            <DetailRow icon={Utensils} label="Stolik" value={r.table} />
            <DetailRow icon={Phone} label="Telefon" value={r.phone} />
            <DetailRow icon={Mail} label="Email" value={r.email} />
            <DetailRow icon={CalendarDays} label="Utworzono" value={r.createdAt} />
          </div>
          {r.notes && (
            <div className="mb-6">
              <p className="text-[11px] uppercase tracking-wider font-medium mb-2" style={{ color: T.muted }}>Uwagi</p>
              <p className="text-sm leading-relaxed p-3 rounded-lg" style={{ color: T.text, backgroundColor: T.subtle, border: `1px solid ${T.border}` }}>{r.notes}</p>
            </div>
          )}
          {(r.reminderSms || r.reminderEmail) && (
            <div className="mb-6">
              <p className="text-[11px] uppercase tracking-wider font-medium mb-3" style={{ color: T.muted }}>Przypomnienia</p>
              <div className="space-y-2">
                {r.reminderSms && (() => { const m = REMINDER_STATUS_META[r.reminderSms]; return (<div className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: m.bg, border: `1px solid ${m.color}22` }}><Smartphone size={15} style={{ color: m.color }} /><div className="flex-1"><span className="text-sm" style={{ color: T.cream }}>SMS</span></div><span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: m.bg, color: m.color }}>{m.label}</span></div>); })()}
                {r.reminderEmail && (() => { const m = REMINDER_STATUS_META[r.reminderEmail]; return (<div className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: m.bg, border: `1px solid ${m.color}22` }}><Mail size={15} style={{ color: m.color }} /><div className="flex-1"><span className="text-sm" style={{ color: T.cream }}>E-mail</span></div><span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: m.bg, color: m.color }}>{m.label}</span></div>); })()}
              </div>
            </div>
          )}
          <div className="h-px mb-5" style={{ backgroundColor: T.border }} />
          <div className="space-y-2">
            <BtnPrimary><span className="flex items-center gap-2"><Edit3 size={14} /> Edytuj rezerwację</span></BtnPrimary>
            <div className="flex gap-2">
              <button className="flex-1 py-2.5 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-all active:scale-[0.97]" style={{ backgroundColor: T.subtle, color: T.text, border: `1px solid ${T.border}` }}>
                <Utensils size={14} /> Przypisz stolik
              </button>
              <button className="flex-1 py-2.5 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-all active:scale-[0.97]" style={{ backgroundColor: "rgba(242,139,130,0.08)", color: T.red, border: "1px solid rgba(242,139,130,0.2)" }}>
                <Trash2 size={14} /> Anuluj
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* ══════════════════════════════════════════════════════
   SECTION: TABLES
══════════════════════════════════════════════════════ */
function TablesSection() {
  return (
    <div className="space-y-6">
      <SectionTitle sub="Stoliki, pojemność i obłożenie">Stoliki</SectionTitle>
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm" style={{ color: T.text }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${T.border}` }}>
                {["Nr", "Sekcja", "Maks. os.", "Min. os.", "Status", "Uwagi"].map((h) => (
                  <th key={h} className="text-left py-3 px-4 text-xs uppercase tracking-wider font-medium" style={{ color: T.muted }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TABLES.map((t) => (
                <tr key={t.id} className="transition-colors hover:bg-white/[0.02]" style={{ borderBottom: `1px solid ${T.border}` }}>
                  <td className="py-3 px-4 font-medium" style={{ color: T.cream }}>{t.number}</td>
                  <td className="py-3 px-4">{t.section}</td>
                  <td className="py-3 px-4 text-center">{t.capacity}</td>
                  <td className="py-3 px-4 text-center">{t.minParty}</td>
                  <td className="py-3 px-4">
                    {t.isActive ? <Badge label="Aktywny" color={T.green} bg="rgba(96,194,117,0.1)" /> : <Badge label="Wyłączony" color={T.red} bg="rgba(242,139,130,0.1)" />}
                  </td>
                  <td className="py-3 px-4 text-xs" style={{ color: T.muted }}>{t.notes || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-5">
          <p className="text-sm font-medium mb-4" style={{ color: T.cream }}>Podsumowanie pojemności</p>
          <div className="space-y-3">
            {["Okno", "Sala", "Boks"].map((section) => {
              const sectionTables = TABLES.filter((t) => t.section === section);
              const active = sectionTables.filter((t) => t.isActive);
              const totalCap = active.reduce((s, t) => s + t.capacity, 0);
              return (
                <div key={section} className="flex items-center gap-3">
                  <span className="text-sm w-16" style={{ color: T.text }}>{section}</span>
                  <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ backgroundColor: T.subtle }}>
                    <div className="h-full rounded-full" style={{ width: `${(totalCap / 24) * 100}%`, backgroundColor: T.gold + "80" }} />
                  </div>
                  <span className="text-xs tabular-nums w-20 text-right" style={{ color: T.muted }}>{active.length} st. / {totalCap} os.</span>
                </div>
              );
            })}
            <div className="h-px mt-2" style={{ backgroundColor: T.border }} />
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium" style={{ color: T.cream }}>Łącznie aktywne</span>
              <span className="text-sm tabular-nums" style={{ color: T.gold }}>{TABLES.filter((t) => t.isActive).length} stolików · {TABLES.filter((t) => t.isActive).reduce((s, t) => s + t.capacity, 0)} miejsc</span>
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <p className="text-sm font-medium mb-4" style={{ color: T.cream }}>Obłożenie — okna czasowe</p>
          <div className="grid grid-cols-4 gap-2">
            {TIME_SLOT_PERFORMANCE.map((slot) => {
              const maxCap = 38;
              const pct = Math.round((slot.avg / maxCap) * 100);
              return (
                <div key={slot.slot} className="text-center p-2.5 rounded-lg" style={{ backgroundColor: T.subtle, border: `1px solid ${T.border}` }}>
                  <span className="text-[10px] block mb-1 tabular-nums" style={{ color: T.muted }}>{slot.slot}</span>
                  <span className="text-lg font-light block tabular-nums" style={{ color: pct > 80 ? T.red : pct > 60 ? T.amber : T.cream }}>{slot.avg}</span>
                  <div className="h-1 mt-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "rgba(243,239,234,0.05)" }}>
                    <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: pct > 80 ? T.red : pct > 60 ? T.amber : T.green }} />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   SECTION: MENU (no cost/margin — manager view)
══════════════════════════════════════════════════════ */
function MenuSection() {
  const [items, setItems] = useState<MgrMenuItem[]>(INITIAL_MENU);
  const [activeCategory, setActiveCategory] = useState<MenuCategory | "Wszystkie">("Wszystkie");
  const [search, setSearch] = useState("");
  const [editingItem, setEditingItem] = useState<MgrMenuItem | null>(null);
  const [isNew, setIsNew] = useState(false);

  const filtered = items.filter((i) => {
    const matchCat = activeCategory === "Wszystkie" || i.category === activeCategory;
    const matchSearch = !search || i.name.toLowerCase().includes(search.toLowerCase()) || i.description.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const grouped = MENU_CATEGORIES.map((cat) => ({ category: cat, items: filtered.filter((i) => i.category === cat) })).filter((g) => activeCategory === "Wszystkie" ? g.items.length > 0 : g.category === activeCategory);

  const stats = useMemo(() => ({ total: items.length, active: items.filter((i) => i.isActive).length, avgPrice: Math.round(items.reduce((s, i) => s + i.price, 0) / items.length) }), [items]);

  const openNew = () => {
    setEditingItem({ id: `m${Date.now()}`, name: "", price: 0, description: "", ingredients: [], category: activeCategory !== "Wszystkie" ? activeCategory : "Dania główne", isActive: true });
    setIsNew(true);
  };

  const openEdit = (item: MgrMenuItem) => {
    setEditingItem({ ...item, ingredients: item.ingredients.map((i) => ({ ...i })) });
    setIsNew(false);
  };

  const saveItem = () => {
    if (!editingItem || !editingItem.name.trim()) return;
    if (isNew) setItems((prev) => [...prev, editingItem]);
    else setItems((prev) => prev.map((i) => (i.id === editingItem.id ? editingItem : i)));
    setEditingItem(null);
  };

  const toggleActive = (id: string) => setItems((prev) => prev.map((i) => (i.id === id ? { ...i, isActive: !i.isActive } : i)));

  const addIngredient = () => { if (editingItem) setEditingItem({ ...editingItem, ingredients: [...editingItem.ingredients, { name: "" }] }); };
  const updateIngredient = (idx: number, field: keyof Ingredient, value: string | boolean | undefined) => { if (editingItem) setEditingItem({ ...editingItem, ingredients: editingItem.ingredients.map((ing, i) => (i === idx ? { ...ing, [field]: value } : ing)) }); };
  const removeIngredient = (idx: number) => { if (editingItem) setEditingItem({ ...editingItem, ingredients: editingItem.ingredients.filter((_, i) => i !== idx) }); };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <SectionTitle sub={`${stats.total} pozycji · ${stats.active} aktywnych · śr. cena ${stats.avgPrice} zł`}>Menu restauracji</SectionTitle>
        <BtnPrimary onClick={openNew}><Plus size={14} className="inline mr-1" />Dodaj pozycję</BtnPrimary>
      </div>

      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: T.muted }} />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Szukaj po nazwie lub opisie…" className="w-full pl-9 pr-3 py-2 rounded-lg text-sm outline-none" style={{ backgroundColor: T.subtle, color: T.cream, border: `1px solid ${T.border}` }} />
          </div>
          <div className="flex gap-1.5 flex-wrap">
            <BtnSecondary small active={activeCategory === "Wszystkie"} onClick={() => setActiveCategory("Wszystkie")}>Wszystkie</BtnSecondary>
            {MENU_CATEGORIES.map((cat) => <BtnSecondary key={cat} small active={activeCategory === cat} onClick={() => setActiveCategory(cat)}>{cat}</BtnSecondary>)}
          </div>
        </div>
      </Card>

      {grouped.map((g) => (
        <div key={g.category}>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm font-medium" style={{ color: T.gold }}>{g.category}</span>
            <span className="text-xs" style={{ color: T.muted }}>({g.items.length})</span>
          </div>
          <div className="space-y-2">
            {g.items.map((item) => {
              const allergens = item.ingredients.filter((i) => i.allergen).map((i) => i.allergen!);
              const hasAlcohol = item.ingredients.some((i) => i.alcohol);
              return (
                <Card key={item.id} className="p-4 transition-all hover:scale-[1.002]" style={{ opacity: item.isActive ? 1 : 0.5 }}>
                  <div className="flex items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="text-sm font-medium" style={{ color: T.cream }}>{item.name}</span>
                        {item.diet === "vegan" && <><Badge label="Wegan" color="#4CAF50" bg="rgba(76,175,80,0.1)" /><Badge label="Wege" color="#8BC34A" bg="rgba(139,195,74,0.1)" /></>}
                        {item.diet === "vegetarian" && <Badge label="Wege" color="#8BC34A" bg="rgba(139,195,74,0.1)" />}
                        {!item.isActive && <Badge label="Nieaktywne" color={T.red} bg="rgba(242,139,130,0.1)" />}
                        {item.isSeasonal && <Badge label="Sezonowe" color={T.amber} bg="rgba(246,191,96,0.1)" />}
                        {hasAlcohol && <span className="text-[10px] px-1.5 py-0.5 rounded font-medium" style={{ backgroundColor: "rgba(179,157,219,0.1)", color: T.purple, border: `1px solid ${T.purple}25` }}>Alkohol</span>}
                      </div>
                      <p className="text-xs mb-2 line-clamp-1" style={{ color: T.muted }}>{item.description}</p>
                      {allergens.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {[...new Set(allergens)].map((a) => <span key={a} className="text-[10px] px-1.5 py-0.5 rounded-md font-medium" style={{ backgroundColor: (ALLERGEN_COLORS[a] ?? T.muted) + "18", color: ALLERGEN_COLORS[a] ?? T.muted }}>{a}</span>)}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-4 flex-shrink-0">
                      <div className="text-sm font-semibold tabular-nums" style={{ color: T.cream }}>{item.price} zł</div>
                      <div className="flex items-center gap-1">
                        <button onClick={() => toggleActive(item.id)} className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:bg-white/5" title={item.isActive ? "Dezaktywuj" : "Aktywuj"}>
                          {item.isActive ? <Eye size={14} style={{ color: T.green }} /> : <XCircle size={14} style={{ color: T.red }} />}
                        </button>
                        <button onClick={() => openEdit(item)} className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:bg-white/5" title="Edytuj">
                          <Edit3 size={14} style={{ color: T.blue }} />
                        </button>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      ))}

      {filtered.length === 0 && <Card className="p-12 text-center"><Search size={32} style={{ color: T.muted, margin: "0 auto 12px" }} /><p className="text-sm" style={{ color: T.muted }}>Brak wyników</p></Card>}

      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}>
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl p-6" style={{ backgroundColor: T.card, border: `1px solid ${T.border}` }}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-light" style={{ color: T.cream, fontFamily: T.serif }}>{isNew ? "Nowa pozycja menu" : `Edytuj: ${editingItem.name}`}</h3>
              <button onClick={() => setEditingItem(null)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/5"><X size={16} style={{ color: T.muted }} /></button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase tracking-widest block mb-1.5" style={{ color: T.muted }}>Nazwa</label>
                  <input value={editingItem.name} onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })} className="w-full px-3 py-2.5 rounded-lg text-sm outline-none" style={{ backgroundColor: T.subtle, color: T.cream, border: `1px solid ${T.border}` }} placeholder="Nazwa dania…" />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-widest block mb-1.5" style={{ color: T.muted }}>Kategoria</label>
                  <select value={editingItem.category} onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value as MenuCategory })} className="w-full px-3 py-2.5 rounded-lg text-sm outline-none appearance-none cursor-pointer" style={{ backgroundColor: T.subtle, color: T.cream, border: `1px solid ${T.border}` }}>
                    {MENU_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-widest block mb-1.5" style={{ color: T.muted }}>Opis</label>
                <textarea value={editingItem.description} onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })} rows={2} className="w-full px-3 py-2.5 rounded-lg text-sm outline-none resize-none" style={{ backgroundColor: T.subtle, color: T.cream, border: `1px solid ${T.border}` }} placeholder="Krótki opis dania…" />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[10px] uppercase tracking-widest block mb-1.5" style={{ color: T.muted }}>Cena (zł)</label>
                  <input type="number" value={editingItem.price || ""} onChange={(e) => setEditingItem({ ...editingItem, price: Number(e.target.value) })} className="w-full px-3 py-2.5 rounded-lg text-sm outline-none" style={{ backgroundColor: T.subtle, color: T.cream, border: `1px solid ${T.border}` }} />
                </div>
                <div className="flex items-end pb-1">
                  <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={editingItem.isActive} onChange={() => setEditingItem({ ...editingItem, isActive: !editingItem.isActive })} className="w-4 h-4 rounded accent-[#60C275]" /><span className="text-xs" style={{ color: T.text }}>Aktywne</span></label>
                </div>
                <div className="flex items-end pb-1">
                  <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={editingItem.isSeasonal ?? false} onChange={() => setEditingItem({ ...editingItem, isSeasonal: !(editingItem.isSeasonal ?? false) })} className="w-4 h-4 rounded accent-[#F6BF60]" /><span className="text-xs" style={{ color: T.text }}>Sezonowe</span></label>
                </div>
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-widest block mb-1.5" style={{ color: T.muted }}>Dieta</label>
                <div className="flex gap-2">
                  {([{ value: undefined, label: "Brak", color: T.muted }, { value: "vegetarian" as DietType, label: "Wege", color: "#8BC34A" }, { value: "vegan" as DietType, label: "Wegan", color: "#4CAF50" }] as const).map((opt) => (
                    <button key={opt.label} onClick={() => setEditingItem({ ...editingItem, diet: opt.value as DietType | undefined })} className="px-3 py-2 rounded-lg text-xs font-medium transition-all"
                      style={{ backgroundColor: editingItem.diet === opt.value ? (opt.value ? `${opt.color}15` : T.subtle) : T.subtle, color: editingItem.diet === opt.value ? (opt.value ? opt.color : T.cream) : T.muted, border: editingItem.diet === opt.value ? `1px solid ${opt.value ? opt.color + "40" : T.border}` : `1px solid ${T.border}` }}>
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[10px] uppercase tracking-widest" style={{ color: T.muted }}>Składniki</label>
                  <button onClick={addIngredient} className="text-xs px-2 py-1 rounded-lg flex items-center gap-1 transition-colors hover:bg-white/5" style={{ color: T.gold }}><Plus size={12} /> Dodaj</button>
                </div>
                <div className="space-y-2">
                  {editingItem.ingredients.map((ing, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <GripVertical size={12} style={{ color: T.muted, flexShrink: 0 }} />
                      <input value={ing.name} onChange={(e) => updateIngredient(idx, "name", e.target.value)} placeholder="Nazwa składnika…" className="flex-1 px-3 py-2 rounded-lg text-xs outline-none" style={{ backgroundColor: T.subtle, color: T.cream, border: `1px solid ${T.border}` }} />
                      <select value={ing.allergen ?? ""} onChange={(e) => updateIngredient(idx, "allergen", e.target.value || undefined)} className="w-28 px-2 py-2 rounded-lg text-xs outline-none appearance-none cursor-pointer" style={{ backgroundColor: T.subtle, color: ing.allergen ? (ALLERGEN_COLORS[ing.allergen] ?? T.cream) : T.muted, border: `1px solid ${T.border}` }}>
                        <option value="">Brak alergenu</option>
                        {ALLERGENS_LIST.map((a) => <option key={a} value={a}>{a}</option>)}
                      </select>
                      <label className="flex items-center gap-1 cursor-pointer flex-shrink-0"><input type="checkbox" checked={ing.alcohol ?? false} onChange={(e) => updateIngredient(idx, "alcohol", e.target.checked || undefined)} className="w-3.5 h-3.5 rounded accent-[#B39DDB]" /><span className="text-[10px]" style={{ color: T.purple }}>Alk.</span></label>
                      <button onClick={() => removeIngredient(idx)} className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white/5 flex-shrink-0"><X size={12} style={{ color: T.red }} /></button>
                    </div>
                  ))}
                  {editingItem.ingredients.length === 0 && <p className="text-xs text-center py-4" style={{ color: T.muted }}>Brak składników — kliknij „Dodaj" powyżej</p>}
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 mt-6 pt-4" style={{ borderTop: `1px solid ${T.border}` }}>
              <BtnSecondary onClick={() => setEditingItem(null)}>Anuluj</BtnSecondary>
              <BtnPrimary onClick={saveItem} disabled={!editingItem.name.trim() || editingItem.price <= 0}>{isNew ? "Dodaj do menu" : "Zapisz zmiany"}</BtnPrimary>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   SECTION: SCHEDULE
══════════════════════════════════════════════════════ */
function ScheduleSection() {
  const [weekOffset, setWeekOffset] = useState(0);
  const [schedule, setSchedule] = useState<Record<ScheduleKey, ShiftType>>(generateMockSchedule);
  const [editCell, setEditCell] = useState<{ staffId: string; date: string } | null>(null);

  const days = useMemo(() => getWeekDays(weekOffset), [weekOffset]);
  const isCurrentWeek = weekOffset === 0;

  const weekLabel = useMemo(() => {
    if (days.length === 0) return "";
    const s = new Date(days[0].date);
    const e = new Date(days[6].date);
    return `${s.getDate()} ${s.toLocaleDateString("pl-PL", { month: "short" })} – ${e.getDate()} ${e.toLocaleDateString("pl-PL", { month: "short", year: "numeric" })}`;
  }, [days]);

  const activeStaff = STAFF.filter((s) => s.status === "active");

  const setShift = (staffId: string, date: string, shift: ShiftType) => {
    setSchedule((prev) => ({ ...prev, [makeKey(staffId, date)]: shift }));
    setEditCell(null);
  };

  const daySummary = (date: string) => {
    let morning = 0, evening = 0;
    for (const s of activeStaff) {
      const sh = schedule[makeKey(s.id, date)];
      if (sh === "morning") morning++;
      else if (sh === "evening") evening++;
      else if (sh === "full") { morning++; evening++; }
    }
    const total = activeStaff.filter((s) => { const sh = schedule[makeKey(s.id, date)]; return sh && sh !== "off"; }).length;
    return { morning, evening, total };
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <SectionTitle sub="Planowanie tygodniowe personelu">Grafik zmian</SectionTitle>
        <div className="flex items-center gap-2">
          <button onClick={() => setWeekOffset((w) => w - 1)} className="p-2 rounded-lg transition-colors hover:bg-white/5" style={{ border: `1px solid ${T.border}`, color: T.muted }}>
            <ChevronLeft size={16} />
          </button>
          <button onClick={() => setWeekOffset(0)} className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors hover:bg-white/5"
            style={{ border: isCurrentWeek ? "1px solid rgba(182,138,58,0.4)" : `1px solid ${T.border}`, color: isCurrentWeek ? T.gold : T.text, backgroundColor: isCurrentWeek ? "rgba(182,138,58,0.08)" : "transparent" }}>
            Dziś
          </button>
          <button onClick={() => setWeekOffset((w) => w + 1)} className="p-2 rounded-lg transition-colors hover:bg-white/5" style={{ border: `1px solid ${T.border}`, color: T.muted }}>
            <ChevronRight size={16} />
          </button>
          <span className="text-sm ml-2 tabular-nums" style={{ color: T.text }}>{weekLabel}</span>
        </div>
      </div>

      <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${T.border}`, backgroundColor: T.card }}>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse" style={{ minWidth: 800 }}>
            <thead>
              <tr>
                <th className="text-left px-4 py-3 text-xs uppercase tracking-wider sticky left-0 z-10" style={{ color: T.muted, backgroundColor: T.panel, borderBottom: `1px solid ${T.border}`, width: 180 }}>Pracownik</th>
                {days.map((d) => {
                  const summary = daySummary(d.date);
                  return (
                    <th key={d.date} className="px-2 py-2.5 text-center" style={{ borderBottom: `1px solid ${T.border}`, backgroundColor: d.isToday ? "rgba(182,138,58,0.06)" : T.panel, minWidth: 100 }}>
                      <div className="text-[11px] uppercase tracking-wide" style={{ color: d.isToday ? T.gold : T.muted }}>{d.dayName}</div>
                      <div className="text-sm font-medium mt-0.5" style={{ color: d.isToday ? T.gold : T.cream }}>{d.dayNum}</div>
                      {d.isToday && <div className="text-[8px] uppercase tracking-widest font-bold mt-0.5" style={{ color: T.gold }}>dziś</div>}
                      <div className="flex items-center justify-center gap-1 mt-1">
                        <span className="text-[9px] px-1 py-px rounded" style={{ backgroundColor: "rgba(246,191,96,0.12)", color: "#F6BF60" }} title="Rano">☀ {summary.morning}</span>
                        <span className="text-[9px] px-1 py-px rounded" style={{ backgroundColor: "rgba(122,175,232,0.12)", color: "#7AAFE8" }} title="Wieczór">🌙 {summary.evening}</span>
                      </div>
                      <div className="text-[9px] mt-0.5 font-medium flex items-center justify-center gap-1" style={{ color: summary.total > 0 ? T.cream : T.muted }}>
                        <Users size={9} /> Łącznie {summary.total}
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {activeStaff.map((staff, idx) => (
                <tr key={staff.id} style={{ borderBottom: idx < activeStaff.length - 1 ? `1px solid ${T.border}` : undefined }}>
                  <td className="px-4 py-3 sticky left-0 z-10" style={{ backgroundColor: T.card, borderRight: `1px solid ${T.border}` }}>
                    <div className="flex items-center gap-3">
                      {staff.avatar ? (
                        <img src={staff.avatar} alt="" className="w-7 h-7 rounded-full object-cover flex-shrink-0" />
                      ) : (
                        <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-medium flex-shrink-0" style={{ backgroundColor: "rgba(182,138,58,0.12)", color: T.gold }}>
                          {staff.name.split(" ").map((n) => n[0]).join("")}
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="text-xs font-medium truncate" style={{ color: T.cream }}>{staff.name}</p>
                        <p className="text-[10px]" style={{ color: T.muted }}>{staff.position}</p>
                      </div>
                    </div>
                  </td>
                  {days.map((d) => {
                    const shift = schedule[makeKey(staff.id, d.date)] ?? "off";
                    const sc = SHIFT_COLORS[shift];
                    const isEditing = editCell?.staffId === staff.id && editCell?.date === d.date;
                    return (
                      <td key={d.date} className="px-1.5 py-2 text-center relative" style={{ backgroundColor: d.isToday ? "rgba(182,138,58,0.03)" : undefined }}>
                        {isEditing ? (
                          <div className="absolute inset-0 z-20 flex items-center justify-center" style={{ backgroundColor: "rgba(14,23,20,0.95)" }}>
                            <div className="flex flex-col gap-1 p-2 rounded-lg" style={{ backgroundColor: T.card, border: `1px solid ${T.border}`, boxShadow: "0 8px 24px rgba(0,0,0,0.4)" }}>
                              {(["morning", "evening", "full", "off"] as ShiftType[]).map((st) => {
                                const stc = SHIFT_COLORS[st];
                                return (
                                  <button key={st} onClick={() => setShift(staff.id, d.date, st)} className="flex items-center gap-2 px-3 py-1.5 rounded-md text-[11px] font-medium transition-colors hover:opacity-80 text-left" style={{ backgroundColor: stc.bg, color: stc.text, border: `1px solid ${stc.border}` }}>
                                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: stc.text }} />
                                    {SHIFT_LABELS[st]}
                                    <span className="text-[10px] ml-auto opacity-60">{SHIFT_HOURS[st]}</span>
                                  </button>
                                );
                              })}
                              <button onClick={() => setEditCell(null)} className="text-[10px] mt-1 text-center" style={{ color: T.muted }}>Anuluj</button>
                            </div>
                          </div>
                        ) : (
                          <button onClick={() => setEditCell({ staffId: staff.id, date: d.date })} className="w-full px-2 py-1.5 rounded-md text-[11px] font-medium transition-all hover:scale-105 hover:shadow-md" style={{ backgroundColor: sc.bg, color: sc.text, border: `1px solid ${sc.border}` }} title={`${SHIFT_LABELS[shift]} (${SHIFT_HOURS[shift]})`}>
                            {SHIFT_LABELS[shift]}
                          </button>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Legenda */}
      <div className="flex flex-wrap items-center gap-4 mt-2 px-1">
        <span className="text-[10px] uppercase tracking-wider" style={{ color: T.muted }}>Legenda:</span>
        {(["morning", "evening", "full", "off"] as ShiftType[]).map((st) => (
          <div key={st} className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded" style={{ backgroundColor: SHIFT_COLORS[st].bg, border: `1px solid ${SHIFT_COLORS[st].border}` }} />
            <span className="text-[11px]" style={{ color: SHIFT_COLORS[st].text }}>{SHIFT_LABELS[st]}</span>
            <span className="text-[10px]" style={{ color: T.muted }}>({SHIFT_HOURS[st]})</span>
          </div>
        ))}
      </div>

      {/* Podsumowanie tygodnia */}
      <div className="rounded-xl p-4 mt-2" style={{ backgroundColor: T.panel, border: `1px solid ${T.border}` }}>
        <h3 className="text-xs uppercase tracking-wider mb-3" style={{ color: T.muted }}>Podsumowanie tygodnia</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {activeStaff.map((s) => {
            let hours = 0;
            for (const d of days) {
              const sh = schedule[makeKey(s.id, d.date)];
              if (sh === "morning" || sh === "evening") hours += 6;
              else if (sh === "full") hours += 13;
            }
            const shiftCount = days.filter((d) => { const sh = schedule[makeKey(s.id, d.date)]; return sh && sh !== "off"; }).length;
            return (
              <div key={s.id} className="rounded-lg p-3" style={{ backgroundColor: T.subtle, border: `1px solid ${T.border}` }}>
                <p className="text-xs font-medium truncate" style={{ color: T.cream }}>{s.name}</p>
                <p className="text-lg font-light tabular-nums mt-1" style={{ color: hours > 50 ? T.red : hours > 40 ? T.amber : T.green }}>{hours}h</p>
                <p className="text-[10px]" style={{ color: T.muted }}>{shiftCount} zmian</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   SECTION: STAFF VIEW (read-only)
══════════════════════════════════════════════════════ */
function StaffViewSection() {
  return (
    <div className="space-y-4">
      <SectionTitle sub="Podgląd pracowników (edycja w panelu admina)">Zespół</SectionTitle>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {STAFF.map((s) => (
          <Card key={s.id} className="p-4">
            <div className="flex items-center gap-4">
              {s.avatar ? (
                <img src={s.avatar} alt="" className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
              ) : (
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0" style={{ backgroundColor: "rgba(182,138,58,0.12)", color: T.gold }}>
                  {s.name.split(" ").map((n) => n[0]).join("")}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate" style={{ color: T.cream }}>{s.name}</p>
                <p className="text-xs" style={{ color: T.muted }}>{s.position}</p>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                style={{ backgroundColor: s.status === "active" ? "rgba(96,194,117,0.1)" : "rgba(242,139,130,0.1)", color: s.status === "active" ? T.green : T.red, border: `1px solid ${s.status === "active" ? "rgba(96,194,117,0.2)" : "rgba(242,139,130,0.2)"}` }}>
                {s.status === "active" ? "Aktywny" : "Nieaktywny"}
              </span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   MAIN LAYOUT
══════════════════════════════════════════════════════ */
export function ManagerDashboardPage() {
  const nav = useNavigate();
  const [section, setSection] = useState<ManagerSection>("overview");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const renderSection = () => {
    switch (section) {
      case "overview":     return <OverviewSection />;
      case "reservations": return <ReservationsSection />;
      case "tables":       return <TablesSection />;
      case "menu":         return <MenuSection />;
      case "schedule":     return <ScheduleSection />;
      case "staff":        return <StaffViewSection />;
    }
  };

  const sidebarNav = (mobile?: boolean) => (
    <nav className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto">
      {NAV_ITEMS.map((item) => {
        const active = section === item.id;
        const Icon = item.icon;
        return (
          <button key={item.id} onClick={() => { setSection(item.id); if (mobile) setMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 rounded-lg transition-all duration-150 ${!mobile && sidebarCollapsed ? "justify-center px-2 py-3" : "px-3 py-2.5"}`}
            style={{ backgroundColor: active ? "rgba(182,138,58,0.12)" : "transparent", color: active ? T.gold : T.text, border: active ? "1px solid rgba(182,138,58,0.2)" : "1px solid transparent" }}
            title={!mobile && sidebarCollapsed ? item.label : undefined}>
            <Icon size={18} style={{ color: active ? T.gold : T.muted, flexShrink: 0 }} />
            {(mobile || !sidebarCollapsed) && <span className="text-sm font-medium truncate">{item.label}</span>}
          </button>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: T.dark, fontFamily: T.sans }}>

      {/* Mobile sidebar overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileMenuOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-64 flex flex-col" style={{ backgroundColor: T.card, borderRight: `1px solid ${T.border}` }}>
            <div className="flex items-center justify-between px-4 h-16 flex-shrink-0" style={{ borderBottom: `1px solid ${T.border}` }}>
              <div className="flex items-center gap-3">
                <div className="w-2 h-7 rounded-full flex-shrink-0" style={{ backgroundColor: T.gold }} />
                <div className="min-w-0">
                  <p className="text-sm font-light tracking-wider truncate" style={{ color: T.cream, fontFamily: T.serif, fontSize: "1rem" }}>La Maison Dorée</p>
                  <p className="text-[10px] uppercase tracking-widest" style={{ color: T.muted }}>Panel Manager</p>
                </div>
              </div>
              <button onClick={() => setMobileMenuOpen(false)} className="p-1.5 rounded-lg hover:bg-white/5"><X size={18} style={{ color: T.muted }} /></button>
            </div>
            {sidebarNav(true)}
          </aside>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col flex-shrink-0 h-screen sticky top-0 transition-all duration-300" style={{ width: sidebarCollapsed ? 64 : 220, backgroundColor: T.card, borderRight: `1px solid ${T.border}` }}>
        <div className="flex items-center gap-3 px-4 h-16 flex-shrink-0" style={{ borderBottom: `1px solid ${T.border}` }}>
          <div className="w-2 h-7 rounded-full flex-shrink-0" style={{ backgroundColor: T.gold }} />
          {!sidebarCollapsed && (
            <div className="min-w-0">
              <p className="text-sm font-light tracking-wider truncate" style={{ color: T.cream, fontFamily: T.serif, fontSize: "1rem" }}>La Maison Dorée</p>
              <p className="text-[10px] uppercase tracking-widest" style={{ color: T.muted }}>Panel Manager</p>
            </div>
          )}
        </div>
        {sidebarNav()}
        <div className="px-2 py-3 flex-shrink-0" style={{ borderTop: `1px solid ${T.border}` }}>
          <button onClick={() => setSidebarCollapsed((v) => !v)} className="w-full flex items-center justify-center gap-2 py-2 rounded-lg transition-colors hover:bg-white/5" style={{ color: T.muted }}>
            {sidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            {!sidebarCollapsed && <span className="text-xs">Zwiń</span>}
          </button>
        </div>
      </aside>

      <main className="flex-1 min-w-0 overflow-y-auto">
        <header className="sticky top-0 z-20 flex items-center justify-between px-4 md:px-6 lg:px-8 h-14 md:h-16" style={{ backgroundColor: T.dark + "F0", borderBottom: `1px solid ${T.border}`, backdropFilter: "blur(12px)" }}>
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileMenuOpen(true)} className="md:hidden p-1.5 -ml-1 rounded-lg hover:bg-white/5" style={{ color: T.muted }}>
              <Menu size={20} />
            </button>
            <h1 className="text-base md:text-lg font-light tracking-wide" style={{ color: T.cream, fontFamily: T.serif }}>
              {NAV_ITEMS.find((n) => n.id === section)?.label}
            </h1>
          </div>
          <div className="flex items-center gap-2 md:gap-3">
            <span className="text-xs tabular-nums hidden sm:block" style={{ color: T.muted }}>
              {new Date().toLocaleDateString("pl-PL", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
            </span>
            {(() => {
              const auth = (() => { try { return JSON.parse(sessionStorage.getItem("lmd_auth") ?? "{}"); } catch { return {}; } })();
              return auth.name ? <span className="text-xs hidden md:block" style={{ color: T.muted }}>{auth.name}</span> : null;
            })()}
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: "rgba(182,138,58,0.12)", border: "1px solid rgba(182,138,58,0.25)" }}>
              <UserCheck size={14} style={{ color: T.gold }} />
            </div>
            <button onClick={() => { sessionStorage.removeItem("lmd_auth"); nav("/login"); }} className="w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:bg-white/10" style={{ backgroundColor: "rgba(242,139,130,0.08)", border: "1px solid rgba(242,139,130,0.2)" }} title="Wyloguj się">
              <LogOut size={14} style={{ color: "#F28B82" }} />
            </button>
          </div>
        </header>
        <div className="px-4 md:px-6 lg:px-8 py-4 md:py-6">{renderSection()}</div>
      </main>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        select option { background-color: #182522; color: #F3EFEA; }
      `}</style>
    </div>
  );
}
