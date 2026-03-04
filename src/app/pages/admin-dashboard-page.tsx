import { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import {
  BarChart3, CalendarDays, Users, Utensils, Shield, UserCog,
  TrendingUp, Search, Filter, ChevronDown, ChevronRight, X,
  Plus, Edit3, Trash2, Eye, Clock, AlertCircle, CheckCircle,
  XCircle, Star, Wine, Phone, Mail, MapPin, Bell,
  ArrowUpRight, ArrowDownRight, Minus, Calendar,
  FileText, Lock, ClipboardList, Activity, Settings,
  Hash, DollarSign, UserCheck, Ban, RefreshCw, Download,
  ChevronLeft, MoreHorizontal, Info, MessageSquare, Smartphone,
  Award, Flame, ChefHat, Crown, Medal, BookOpen, GripVertical, Leaf, LogOut, Menu,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip as ReTooltip, ResponsiveContainer,
  AreaChart, Area, PieChart, Pie, Cell, LineChart, Line, Legend,
} from "recharts";

/* ══════════════════════════════════════════════════════════
   DESIGN TOKENS
══════════════════════════════════════════════════════════ */
const T = {
  gold:    "#B68A3A",
  cream:   "#F3EFEA",
  dark:    "#0E1714",
  card:    "#182522",
  panel:   "#1A2B26",
  border:  "rgba(243,239,234,0.07)",
  subtle:  "rgba(243,239,234,0.04)",
  muted:   "rgba(243,239,234,0.35)",
  text:    "rgba(243,239,234,0.7)",
  sans:    "Inter, sans-serif",
  serif:   "Cormorant Garamond, serif",
  green:   "#60C275",
  red:     "#F28B82",
  blue:    "#7AAFE8",
  amber:   "#F6BF60",
  purple:  "#B39DDB",
};

/* ══════════════════════════════════════════════════════════
   NAVIGATION SECTIONS
══════════════════════════════════════════════════════════ */
type Section = "overview" | "reservations" | "events" | "tables" | "menu" | "schedule" | "policy" | "staff" | "analytics";

const NAV_ITEMS: { id: Section; label: string; icon: React.ComponentType<{ size: number; style?: React.CSSProperties }> }[] = [
  { id: "overview",     label: "Przegląd",      icon: BarChart3 },
  { id: "reservations", label: "Rezerwacje",     icon: CalendarDays },
  { id: "events",       label: "Wydarzenia",     icon: Star },
  { id: "tables",       label: "Stoliki",        icon: Utensils },
  { id: "menu",         label: "Menu",           icon: BookOpen },
  { id: "schedule",     label: "Grafik",         icon: Clock },
  { id: "policy",       label: "Regulamin",      icon: Shield },
  { id: "staff",        label: "Zespół",         icon: UserCog },
  { id: "analytics",    label: "Analityka",      icon: TrendingUp },
];

/* ══════════════════════════════════════════════════════════
   MOCK DATA ── Reservations
══════════════════════════════════════════════════════════ */
type ReservationStatus = "confirmed" | "pending" | "cancelled" | "completed" | "no-show";

interface Reservation {
  id: string;
  guestName: string;
  phone: string;
  email: string;
  date: string;
  time: string;
  partySize: number;
  status: ReservationStatus;
  table: string;
  type: "dining" | "event";
  notes: string;
  createdAt: string;
  vip?: boolean;
  reminderSms?: "scheduled" | "sent" | "failed";
  reminderEmail?: "scheduled" | "sent" | "failed";
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
  confirmed: { label: "Potwierdzona", color: T.green,  bg: "rgba(96,194,117,0.1)" },
  pending:   { label: "Oczekująca",   color: T.amber,  bg: "rgba(246,191,96,0.1)" },
  cancelled: { label: "Anulowana",    color: T.red,    bg: "rgba(242,139,130,0.1)" },
  completed: { label: "Zrealizowana", color: T.blue,   bg: "rgba(122,175,232,0.1)" },
  "no-show": { label: "Nieobecność",  color: T.red,    bg: "rgba(242,139,130,0.1)" },
};

type ReminderStatus = "scheduled" | "sent" | "failed";
const REMINDER_STATUS_META: Record<ReminderStatus, { label: string; color: string; bg: string; icon: typeof CheckCircle }> = {
  scheduled: { label: "Zaplanowane", color: T.amber, bg: "rgba(246,191,96,0.1)", icon: Clock },
  sent:      { label: "Wysłane",     color: T.green, bg: "rgba(96,194,117,0.1)", icon: CheckCircle },
  failed:    { label: "Błąd",        color: T.red,   bg: "rgba(242,139,130,0.1)", icon: AlertCircle },
};

/* ══════════════════════════════════════════════════════════
   MOCK DATA ── Events
══════════════════════════════════════════════════════════ */
type EventStatus = "inquiry" | "pending" | "confirmed" | "completed";

interface EventData {
  id: string;
  clientName: string;
  date: string;
  guestCount: number;
  status: EventStatus;
  menuPackage: string;
  assignedManager: string;
  space: string;
  revenue: number;
  notes: string;
  contactEmail: string;
  contactPhone: string;
}

const EVENTS: EventData[] = [
  { id: "E-001", clientName: "Gala Firmowa PKO BP", date: "2026-03-05", guestCount: 40, status: "confirmed", menuPackage: "Prestige (5 dań + welcome)", assignedManager: "Izabela Kowalska", space: "Cała sala", revenue: 34000, notes: "Wynajęcie całej sali, DJ po kolacji", contactEmail: "events@pkobp.pl", contactPhone: "+48 22 567 89 01" },
  { id: "E-002", clientName: "Ślub Wiśniewska–Nowakowski", date: "2026-03-14", guestCount: 28, status: "pending", menuPackage: "Romantique (7 dań + szampan)", assignedManager: "Izabela Kowalska", space: "Salon VIP + Ogród", revenue: 26800, notes: "Tort weselny od cukierni zewnętrznej", contactEmail: "klara@wisniewska.pl", contactPhone: "+48 505 678 901" },
  { id: "E-003", clientName: "Degustacja win — Gazeta Wyborcza", date: "2026-03-20", guestCount: 16, status: "inquiry", menuPackage: "Oenophile (4 dania + 8 win)", assignedManager: "—", space: "Piwnica", revenue: 13400, notes: "Wstępne zapytanie — budget do potwierdzenia", contactEmail: "redakcja@wyborcza.pl", contactPhone: "+48 22 678 90 12" },
  { id: "E-004", clientName: "Urodziny 50. — Mazur", date: "2026-04-02", guestCount: 22, status: "inquiry", menuPackage: "Classique (4 dania)", assignedManager: "—", space: "Salon VIP", revenue: 15900, notes: "Życzenie live jazz", contactEmail: "jan@mazur.pl", contactPhone: "+48 507 890 123" },
  { id: "E-005", clientName: "Kolacja korporacyjna PZU", date: "2026-02-15", guestCount: 30, status: "completed", menuPackage: "Prestige (5 dań + welcome)", assignedManager: "Izabela Kowalska", space: "Cała sala", revenue: 31400, notes: "Zrealizowane bez uwag — klient zadowolony", contactEmail: "events@pzu.pl", contactPhone: "+48 22 789 01 23" },
  { id: "E-006", clientName: "Rocznica Wiśniewskich", date: "2026-02-10", guestCount: 8, status: "completed", menuPackage: "Romantique (7 dań + szampan)", assignedManager: "Tomasz Zieliński", space: "Boks B1", revenue: 8800, notes: "Kwiaty + tort spersonalizowany", contactEmail: "piotr@wisniewski.pl", contactPhone: "+48 504 567 890" },
];

const EVENT_STATUS_META: Record<EventStatus, { label: string; color: string; bg: string }> = {
  inquiry:   { label: "Zapytanie",     color: T.purple, bg: "rgba(179,157,219,0.1)" },
  pending:   { label: "W trakcie",     color: T.amber,  bg: "rgba(246,191,96,0.1)" },
  confirmed: { label: "Potwierdzone",  color: T.green,  bg: "rgba(96,194,117,0.1)" },
  completed: { label: "Zrealizowane",  color: T.blue,   bg: "rgba(122,175,232,0.1)" },
};

/* ══════════════════════════════════════════════════════════
   MOCK DATA ── Tables
══════════════════════════════════════════════════════════ */
interface TableDef {
  id: string;
  number: string;
  section: string;
  capacity: number;
  isActive: boolean;
  minParty: number;
  notes: string;
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

/* ══════════════════════════════════════════════════════════
   MOCK DATA ── Staff
══════════════════════════════════════════════════════════ */
type StaffRole = "admin" | "manager" | "service";
type ContractType = "umowa o pracę" | "umowa zlecenie" | "B2B" | "staż";
type StaffPosition = "Kierownik sali" | "Menedżer" | "Kelner/ka" | "Sommelier" | "Barman/ka" | "Administrator" | "Hostessa";

interface StaffMember {
  id: string;
  name: string;
  role: StaffRole;
  position: StaffPosition;
  email: string;
  phone: string;
  pin: string;
  hireDate: string;
  contract: ContractType;
  lastActive: string;
  status: "active" | "inactive";
  notes?: string;
  avatar?: string;
}

const INITIAL_STAFF: StaffMember[] = [
  { id: "s1", name: "Mikołaj Sitek",        role: "admin",   position: "Administrator",    email: "mikolaj@lmd.pl",    phone: "+48 500 000 001", pin: "000000", hireDate: "2022-09-01", contract: "umowa o pracę", lastActive: "2026-02-26 19:15", status: "active", notes: "Właściciel / główny administrator systemu", avatar: "https://i.pravatar.cc/128?img=59" },
  { id: "s2", name: "Magdalena Dąbrowska",  role: "manager", position: "Menedżer",         email: "magdalena@lmd.pl",  phone: "+48 500 000 002", pin: "666666", hireDate: "2023-08-01", contract: "umowa o pracę", lastActive: "2026-02-26 19:10", status: "active", notes: "Zarządza grafikiem i operacjami codziennymi", avatar: "https://i.pravatar.cc/128?img=25" },
  { id: "s3", name: "Jan Kowalski",         role: "service", position: "Kelner/ka",         email: "jan@lmd.pl",        phone: "+48 500 000 003", pin: "111111", hireDate: "2024-01-10", contract: "umowa o pracę", lastActive: "2026-02-26 19:00", status: "active", notes: "Specjalizacja: obsługa VIP", avatar: "https://i.pravatar.cc/150?u=jan" },
  { id: "s4", name: "Anna Nowak",           role: "service", position: "Kelner/ka",         email: "anna@lmd.pl",       phone: "+48 500 000 004", pin: "222222", hireDate: "2024-06-01", contract: "umowa o pracę", lastActive: "2026-02-26 18:30", status: "active", avatar: "https://i.pravatar.cc/150?u=anna" },
  { id: "s5", name: "Marek Wiśniewski",     role: "service", position: "Barman/ka",         email: "marek@lmd.pl",      phone: "+48 500 000 005", pin: "333333", hireDate: "2024-03-15", contract: "umowa o pracę", lastActive: "2026-02-26 18:45", status: "active", avatar: "https://i.pravatar.cc/150?u=marek" },
  { id: "s6", name: "Ewa Kamińska",         role: "service", position: "Kelner/ka",         email: "ewa@lmd.pl",        phone: "+48 500 000 006", pin: "444444", hireDate: "2025-01-15", contract: "umowa zlecenie", lastActive: "2026-02-26 17:00", status: "active", avatar: "https://i.pravatar.cc/150?u=ewa" },
  { id: "s7", name: "Tomasz Zieliński",     role: "service", position: "Sommelier",         email: "tomasz@lmd.pl",     phone: "+48 500 000 007", pin: "555555", hireDate: "2025-03-01", contract: "umowa zlecenie", lastActive: "2026-02-25 22:15", status: "active", avatar: "https://i.pravatar.cc/150?u=tomasz" },
];

const ROLE_META: Record<StaffRole, { label: string; color: string; bg: string }> = {
  admin:   { label: "Administrator", color: T.gold,    bg: "rgba(182,138,58,0.1)" },
  manager: { label: "Menedżer",     color: T.purple,  bg: "rgba(179,157,219,0.1)" },
  service: { label: "Obsługa",      color: T.green,   bg: "rgba(96,194,117,0.1)" },
};

interface ActivityEntry {
  id: string;
  user: string;
  action: string;
  timestamp: string;
  detail: string;
}

const ACTIVITY_LOG: ActivityEntry[] = [
  { id: "a1", user: "Mikołaj Sitek",        action: "Edycja rezerwacji",  timestamp: "26 lut, 19:02", detail: "R-003 — zmiana stolika O3→O1" },
  { id: "a2", user: "Magdalena Dąbrowska",  action: "Zmiana grafiku",     timestamp: "26 lut, 17:30", detail: "Jan Kowalski — zmiana z rano na wieczór (pon)" },
  { id: "a3", user: "Mikołaj Sitek",        action: "Zmiana polityki",    timestamp: "26 lut, 14:15", detail: "Okno rezerwacji 14→21 dni" },
  { id: "a4", user: "Jan Kowalski",         action: "No-show",            timestamp: "25 lut, 22:30", detail: "R-010 (Dubois) — oznaczono jako nieobecność" },
  { id: "a5", user: "Mikołaj Sitek",        action: "Anulowanie",         timestamp: "25 lut, 16:00", detail: "R-014 (Petit) — anulowanie na życzenie gościa" },
  { id: "a6", user: "Mikołaj Sitek",        action: "Nowy pracownik",     timestamp: "24 lut, 10:00", detail: "Dodano: Tomasz Zieliński (Obsługa)" },
  { id: "a7", user: "Magdalena Dąbrowska",  action: "Edycja menu",        timestamp: "23 lut, 11:00", detail: "Tartare — zmiana ceny 58→62 zł" },
  { id: "a8", user: "Mikołaj Sitek",        action: "Edycja stolika",     timestamp: "22 lut, 09:30", detail: "S4 — wyłączony (remont)" },
];

/* ══════════════════════════════════════════════════════════
   MOCK DATA ── Policies
══════════════════════════════════════════════════════════ */
interface PolicyData {
  cancellationHours: number;
  noShowFee: number;
  bookingWindowDays: number;
  maxPartySize: number;
  dressCode: string;
  houseRules: string[];
  blackoutDates: string[];
  reminderEnabled: boolean;
  reminderSmsEnabled: boolean;
  reminderEmailEnabled: boolean;
  reminderHoursBefore: number;
}

const POLICY: PolicyData = {
  cancellationHours: 24,
  noShowFee: 50,
  bookingWindowDays: 21,
  maxPartySize: 8,
  reminderEnabled: true,
  reminderSmsEnabled: true,
  reminderEmailEnabled: true,
  reminderHoursBefore: 3,
  dressCode: "Smart casual. Prosimy o elegancki strój wieczorowy — bez sportowych butów i krótkich spodenek.",
  houseRules: [
    "Prosimy o punktualność — stolik utrzymywany jest przez 15 minut po godzinie rezerwacji.",
    "Dzieci powyżej 8 roku życia są mile widziane.",
    "Restauracja jest strefą wolną od dymu.",
    "W sali nie używamy głośno telefonów — prosimy o dyskrecję.",
    "Fotografowanie flash jest niedozwolone.",
    "Zwierzęta niedozwolone z wyjątkiem psów przewodników.",
  ],
  blackoutDates: ["2026-03-01", "2026-04-05", "2026-12-25", "2026-12-31"],
};

/* ══════════════════════════════════════════════════════════
   MOCK DATA ── Charts / KPIs
══════════════════════════════════════════════════════════ */
const WEEKLY_RESERVATIONS = [
  { day: "Pon", count: 18, covers: 42 },
  { day: "Wt",  count: 22, covers: 56 },
  { day: "Śr",  count: 20, covers: 48 },
  { day: "Czw", count: 25, covers: 64 },
  { day: "Pt",  count: 34, covers: 88 },
  { day: "Sob", count: 38, covers: 96 },
  { day: "Nd",  count: 28, covers: 72 },
];

const MONTHLY_REVENUE = [
  { month: "Wrz", dining: 42000, events: 12000 },
  { month: "Paź", dining: 48000, events: 8000 },
  { month: "Lis", dining: 45000, events: 15000 },
  { month: "Gru", dining: 62000, events: 28000 },
  { month: "Sty", dining: 38000, events: 6000 },
  { month: "Lut", dining: 52000, events: 18000 },
];

const TIME_SLOT_PERFORMANCE = [
  { slot: "18:00", avg: 12 },
  { slot: "18:30", avg: 18 },
  { slot: "19:00", avg: 32 },
  { slot: "19:30", avg: 38 },
  { slot: "20:00", avg: 36 },
  { slot: "20:30", avg: 28 },
  { slot: "21:00", avg: 20 },
  { slot: "21:30", avg: 10 },
];

const REVENUE_SPLIT = [
  { name: "Kolacje", value: 287000, color: T.gold },
  { name: "Wydarzenia", value: 87000, color: T.blue },
  { name: "Bar", value: 34000, color: T.purple },
];

/* ══════════════════════════════════════════════════════════
   MOCK DATA ── Menu
══════════════════════════════════════════════════════════ */
type MenuCategory = "Przystawki" | "Zupy" | "Dania główne" | "Desery" | "Napoje" | "Koktajle";
const MENU_CATEGORIES: MenuCategory[] = ["Przystawki", "Zupy", "Dania główne", "Desery", "Napoje", "Koktajle"];

const CATEGORY_ICONS: Record<MenuCategory, typeof Utensils> = {
  "Przystawki": Leaf,
  "Zupy": Flame,
  "Dania główne": ChefHat,
  "Desery": Award,
  "Napoje": Wine,
  "Koktajle": Wine,
};

interface Ingredient {
  name: string;
  allergen?: string;
  alcohol?: boolean;
}

type DietType = "vegetarian" | "vegan";

interface AdminMenuItem {
  id: string;
  name: string;
  price: number;
  description: string;
  ingredients: Ingredient[];
  category: MenuCategory;
  isActive: boolean;
  isSeasonal?: boolean;
  diet?: DietType;
  cost?: number;
}

const INITIAL_MENU: AdminMenuItem[] = [
  { id: "m1", name: "Tatar z polędwicy wołowej", price: 58, cost: 18, category: "Przystawki", isActive: true,
    description: "Klasyczny tatar z marynowanym żółtkiem, kaparami i grzanką brioche.",
    ingredients: [{ name: "polędwica wołowa" }, { name: "żółtko jaja", allergen: "Jaja" }, { name: "kapary" }, { name: "szalotka" }, { name: "oliwa truflowa" }, { name: "brioche", allergen: "Gluten" }, { name: "masło", allergen: "Laktoza" }] },
  { id: "m2", name: "Carpaccio z buraka z chèvre", price: 42, cost: 12, category: "Przystawki", isActive: true, diet: "vegetarian",
    description: "Cienkie plastry buraka z kremowym kozim serem, orzechami włoskimi i vinaigrette miodowym.",
    ingredients: [{ name: "burak" }, { name: "kozi ser", allergen: "Laktoza" }, { name: "orzechy włoskie", allergen: "Orzechy" }, { name: "miód" }, { name: "rukola" }] },
  { id: "m3", name: "Foie gras z konfiturą figową", price: 72, cost: 28, category: "Przystawki", isActive: true,
    description: "Delikatny foie gras z domową konfiturą z fig i chrupiącą brioche.",
    ingredients: [{ name: "wątroba kacza" }, { name: "figi" }, { name: "cukier" }, { name: "brioche", allergen: "Gluten" }, { name: "masło", allergen: "Laktoza" }] },
  { id: "m19", name: "Bruschetta z awokado i pomidorami", price: 36, cost: 9, category: "Przystawki", isActive: true, diet: "vegetarian",
    description: "Chrupiąca ciabatta z kremem z awokado, pomidorami cherry i bazylią.",
    ingredients: [{ name: "ciabatta", allergen: "Gluten" }, { name: "awokado" }, { name: "pomidory cherry" }, { name: "bazylia" }, { name: "oliwa z oliwek" }] },
  { id: "m4", name: "Bisque z homara", price: 48, cost: 16, category: "Zupy", isActive: true,
    description: "Aksamitna zupa z homara z kroplą koniaku i kremem śmietanowym.",
    ingredients: [{ name: "homar", allergen: "Skorupiaki" }, { name: "śmietana", allergen: "Laktoza" }, { name: "koniak", alcohol: true }, { name: "marchewka" }, { name: "seler naciowy", allergen: "Seler" }] },
  { id: "m5", name: "Consommé z grzybami leśnymi", price: 38, cost: 10, category: "Zupy", isActive: true, isSeasonal: true,
    description: "Klarowny bulion wołowy z sezonowymi grzybami leśnymi i kluseczkami.",
    ingredients: [{ name: "bulion wołowy" }, { name: "borowiki" }, { name: "kurki" }, { name: "kluseczki", allergen: "Gluten" }, { name: "jaja", allergen: "Jaja" }] },
  { id: "m6", name: "Risotto truflowe", price: 78, cost: 24, category: "Dania główne", isActive: true, diet: "vegetarian",
    description: "Kremowe risotto z czarną truflą, parmezanem i masłem truflowym.",
    ingredients: [{ name: "ryż arborio" }, { name: "trufla czarna" }, { name: "parmezan", allergen: "Laktoza" }, { name: "masło", allergen: "Laktoza" }, { name: "wino białe", alcohol: true }] },
  { id: "m7", name: "Polędwica wołowa Wellington", price: 128, cost: 42, category: "Dania główne", isActive: true,
    description: "Polędwica w cieście francuskim z duxelles grzybowym i foie gras.",
    ingredients: [{ name: "polędwica wołowa" }, { name: "ciasto francuskie", allergen: "Gluten" }, { name: "pieczarki" }, { name: "wątroba kacza" }, { name: "musztarda", allergen: "Gorczyca" }, { name: "jaja", allergen: "Jaja" }] },
  { id: "m8", name: "Dorsz konfitowany w oliwie", price: 88, cost: 28, category: "Dania główne", isActive: true,
    description: "Dorsz wolno gotowany w oliwie z puree z selera i sosem beurre blanc.",
    ingredients: [{ name: "dorsz", allergen: "Ryby" }, { name: "oliwa z oliwek" }, { name: "seler korzeniowy", allergen: "Seler" }, { name: "masło", allergen: "Laktoza" }, { name: "wino białe", alcohol: true }] },
  { id: "m9", name: "Kaczka confit z purée", price: 96, cost: 30, category: "Dania główne", isActive: true,
    description: "Udko kacze confit z purée ziemniaczanym, konfiturą wiśniową i jus.",
    ingredients: [{ name: "udko kacze" }, { name: "tłuszcz kaczy" }, { name: "ziemniaki" }, { name: "masło", allergen: "Laktoza" }, { name: "wiśnie" }] },
  { id: "m10", name: "Rack of Lamb", price: 118, cost: 38, category: "Dania główne", isActive: true,
    description: "Karczek jagnięcy z ziołową panierką, ratatouille i sosem demi-glace.",
    ingredients: [{ name: "jagnięcina" }, { name: "bułka tarta", allergen: "Gluten" }, { name: "zioła prowansalskie" }, { name: "cukinia" }, { name: "musztarda", allergen: "Gorczyca" }] },
  { id: "m20", name: "Bowl z pieczonymi warzywami", price: 52, cost: 14, category: "Dania główne", isActive: true, diet: "vegan",
    description: "Komosa ryżowa z pieczonymi warzywami sezonowymi, hummusem i tahini.",
    ingredients: [{ name: "komosa ryżowa" }, { name: "bataty" }, { name: "cukinia" }, { name: "ciecierzyca" }, { name: "tahini", allergen: "Sezam" }] },
  { id: "m21", name: "Ravioli szpinakowe z ricottą", price: 62, cost: 18, category: "Dania główne", isActive: true, diet: "vegetarian",
    description: "Domowy makaron z nadzieniem szpinakowym i ricottą w sosie maślanym z szałwią.",
    ingredients: [{ name: "mąka", allergen: "Gluten" }, { name: "jaja", allergen: "Jaja" }, { name: "szpinak" }, { name: "ricotta", allergen: "Laktoza" }, { name: "masło", allergen: "Laktoza" }] },
  { id: "m11", name: "Crème brûlée waniliowe", price: 36, cost: 8, category: "Desery", isActive: true,
    description: "Klasyczne crème brûlée z laską wanilii tahitańskiej.",
    ingredients: [{ name: "śmietana", allergen: "Laktoza" }, { name: "żółtka jaj", allergen: "Jaja" }, { name: "wanilia tahitańska" }, { name: "cukier" }] },
  { id: "m12", name: "Fondant czekoladowy", price: 42, cost: 10, category: "Desery", isActive: true,
    description: "Ciepły fondant z gorzkiej czekolady 70% z lodami waniliowymi.",
    ingredients: [{ name: "czekolada 70%" }, { name: "masło", allergen: "Laktoza" }, { name: "jaja", allergen: "Jaja" }, { name: "mąka", allergen: "Gluten" }] },
  { id: "m13", name: "Tarte Tatin", price: 38, cost: 9, category: "Desery", isActive: true,
    description: "Odwrócona tarta jabłkowa z karmelizowanymi jabłkami i lodami.",
    ingredients: [{ name: "jabłka" }, { name: "ciasto kruche", allergen: "Gluten" }, { name: "masło", allergen: "Laktoza" }, { name: "cukier" }] },
  { id: "m22", name: "Sorbet z mango i marakui", price: 28, cost: 6, category: "Desery", isActive: true, diet: "vegan",
    description: "Orzeźwiający sorbet z mango i marakui z miętą i chipsem kokosowym.",
    ingredients: [{ name: "mango" }, { name: "marakuja" }, { name: "cukier" }, { name: "mięta" }] },
  { id: "m14", name: "Espresso / Doppio", price: 14, cost: 3, category: "Napoje", isActive: true,
    description: "Kawa specialty z palarni lokalnej.",
    ingredients: [{ name: "kawa arabica" }] },
  { id: "m15", name: "Herbata premium", price: 18, cost: 4, category: "Napoje", isActive: true,
    description: "Wybór herbat liściastych: Earl Grey, Jasmine, Sencha, Rooibos.",
    ingredients: [{ name: "herbata liściasta" }] },
  { id: "m16", name: "Negroni Classico", price: 38, cost: 12, category: "Koktajle", isActive: true,
    description: "Gin, Campari, słodki wermut — klasyczna proporcja 1:1:1.",
    ingredients: [{ name: "gin", alcohol: true }, { name: "Campari", alcohol: true }, { name: "wermut słodki", alcohol: true }] },
  { id: "m17", name: "Old Fashioned", price: 42, cost: 14, category: "Koktajle", isActive: true,
    description: "Bourbon, angostura, cukier trzcinowy, skórka pomarańczy.",
    ingredients: [{ name: "bourbon", alcohol: true }, { name: "angostura" }, { name: "cukier trzcinowy" }] },
  { id: "m18", name: "Champagne Coupe", price: 48, cost: 18, category: "Koktajle", isActive: true,
    description: "Kieliszek szampana z domową konfiturą malinową.",
    ingredients: [{ name: "szampan", alcohol: true }, { name: "konfitury malinowe" }] },
];

const ALLERGENS_LIST = ["Gluten", "Laktoza", "Jaja", "Ryby", "Skorupiaki", "Orzechy", "Soja", "Seler", "Gorczyca", "Sezam", "Mięczaki", "Łubin"];

const ALLERGEN_COLORS: Record<string, string> = {
  Gluten: "#E8843A", Laktoza: "#7AAFE8", Jaja: "#F6BF60", Ryby: "#60C275",
  Skorupiaki: "#F28B82", Orzechy: "#D4A843", Soja: "#A3D977", Seler: "#8BC9A3",
  Gorczyca: "#E8D843", Sezam: "#C9A86C", Mięczaki: "#7A8FE8", Łubin: "#C77AD4",
};

/* ══════════════════════════════════════════════════════════
   UTILITY COMPONENTS
══════════════════════════════════════════════════════════ */
function Badge({ label, color, bg }: { label: string; color: string; bg: string }) {
  return (
    <span
      className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap"
      style={{ backgroundColor: bg, color, border: `1px solid ${color}20` }}
    >
      {label}
    </span>
  );
}

function SectionTitle({ children, sub }: { children: React.ReactNode; sub?: string }) {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-light tracking-wide" style={{ color: T.cream, fontFamily: T.serif, fontSize: "1.6rem" }}>
        {children}
      </h2>
      {sub && <p className="text-sm mt-1" style={{ color: T.muted }}>{sub}</p>}
    </div>
  );
}

function Card({ children, className = "", style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <div
      className={`rounded-xl ${className}`}
      style={{ backgroundColor: T.card, border: `1px solid ${T.border}`, ...style }}
    >
      {children}
    </div>
  );
}

function KpiCard({ value, label, change, icon: Icon, accent }: {
  value: string | number;
  label: string;
  change?: { value: number; label: string };
  icon: React.ComponentType<{ size: number; style?: React.CSSProperties }>;
  accent: string;
}) {
  const isUp = change && change.value >= 0;
  return (
    <Card className="p-5 flex-1 min-w-[180px]">
      <div className="flex items-start justify-between mb-3">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: accent + "15", border: `1px solid ${accent}25` }}
        >
          <Icon size={18} style={{ color: accent }} />
        </div>
        {change && (
          <div className="flex items-center gap-1 text-xs" style={{ color: isUp ? T.green : T.red }}>
            {isUp ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
            {Math.abs(change.value)}%
          </div>
        )}
      </div>
      <div className="text-3xl font-light mb-1" style={{ color: T.cream }}>{value}</div>
      <div className="text-xs uppercase tracking-widest" style={{ color: T.muted }}>{label}</div>
      {change && <p className="text-[11px] mt-1.5" style={{ color: T.muted }}>{change.label}</p>}
    </Card>
  );
}

function BtnPrimary({ children, onClick, small, disabled }: { children: React.ReactNode; onClick?: () => void; small?: boolean; disabled?: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${small ? "px-3 py-1.5 text-xs" : "px-4 py-2.5 text-sm"} rounded-lg font-medium transition-all active:scale-[0.97] disabled:opacity-40`}
      style={{ backgroundColor: T.gold, color: "#1E1A16" }}
    >
      {children}
    </button>
  );
}

function BtnSecondary({ children, onClick, small, active }: { children: React.ReactNode; onClick?: () => void; small?: boolean; active?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={`${small ? "px-3 py-1.5 text-xs" : "px-4 py-2.5 text-sm"} rounded-lg font-medium transition-all active:scale-[0.97]`}
      style={{
        backgroundColor: active ? "rgba(182,138,58,0.12)" : T.subtle,
        color: active ? T.gold : T.text,
        border: active ? `1px solid rgba(182,138,58,0.25)` : `1px solid ${T.border}`,
      }}
    >
      {children}
    </button>
  );
}

function InputField({ placeholder, value, onChange, icon: Icon }: {
  placeholder: string; value: string; onChange: (v: string) => void;
  icon?: React.ComponentType<{ size: number; style?: React.CSSProperties }>;
}) {
  return (
    <div className="relative">
      {Icon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2">
          <Icon size={15} style={{ color: T.muted }} />
        </div>
      )}
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg text-sm py-2.5 outline-none placeholder:text-[rgba(243,239,234,0.25)]"
        style={{
          backgroundColor: T.subtle,
          border: `1px solid ${T.border}`,
          color: T.cream,
          paddingLeft: Icon ? "2.5rem" : "0.75rem",
          paddingRight: "0.75rem",
        }}
      />
    </div>
  );
}

function EmptyState({ icon: Icon, message }: { icon: React.ComponentType<{ size: number; style?: React.CSSProperties }>; message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3">
      <Icon size={40} style={{ color: T.muted }} />
      <p className="text-sm" style={{ color: T.muted }}>{message}</p>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   SECTION 1 ── OVERVIEW DASHBOARD
══════════════════════════════════════════════════════════ */
function OverviewSection() {
  const todayRes = RESERVATIONS.filter((r) => r.date === "2026-02-26");
  const confirmedToday = todayRes.filter((r) => r.status === "confirmed").length;
  const pendingToday = todayRes.filter((r) => r.status === "pending").length;
  const coversToday = todayRes.reduce((s, r) => s + r.partySize, 0);
  const noShowsWeek = RESERVATIONS.filter((r) => r.status === "no-show").length;
  const eventsMonth = EVENTS.filter((e) => e.date.startsWith("2026-02") || e.date.startsWith("2026-03")).length;

  return (
    <div className="space-y-6">
      <SectionTitle sub="Podsumowanie operacyjne — dane na żywo">Przegląd</SectionTitle>

      {/* KPI Row */}
      <div className="flex gap-4 flex-wrap">
        <KpiCard value={confirmedToday + pendingToday} label="Rezerwacji dziś" change={{ value: 12, label: "vs ostatni czwartek" }} icon={CalendarDays} accent={T.gold} />
        <KpiCard value={coversToday} label="Nakryć dziś" change={{ value: 8, label: "vs średnia tygodniowa" }} icon={Users} accent={T.green} />
        <KpiCard value={noShowsWeek} label="No-shows (tydzień)" change={{ value: -25, label: "vs poprzedni tydzień" }} icon={XCircle} accent={T.red} />
        <KpiCard value={eventsMonth} label="Wydarzeń (luty–marzec)" change={{ value: 33, label: "vs styczeń–luty" }} icon={Star} accent={T.blue} />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Weekly reservations */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-medium" style={{ color: T.cream }}>Rezerwacje — bieżący tydzień</p>
              <p className="text-xs mt-0.5" style={{ color: T.muted }}>Liczba rezerwacji i nakryć</p>
            </div>
            <Badge label="Ten tydzień" color={T.gold} bg="rgba(182,138,58,0.1)" />
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={WEEKLY_RESERVATIONS} barGap={4}>
              <XAxis dataKey="day" tick={{ fill: T.muted, fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: T.muted, fontSize: 11 }} axisLine={false} tickLine={false} width={30} />
              <ReTooltip
                cursor={false}
                contentStyle={{ backgroundColor: T.card, border: `1px solid ${T.border}`, borderRadius: 8, color: T.cream, fontSize: 12 }}
                itemStyle={{ color: T.cream }}
              />
              <Bar dataKey="count" name="Rezerwacje" fill={T.gold} radius={[4, 4, 0, 0]} />
              <Bar dataKey="covers" name="Nakrycia" fill={T.gold + "40"} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Monthly revenue */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-medium" style={{ color: T.cream }}>Przychody — ostatnie 6 mies.</p>
              <p className="text-xs mt-0.5" style={{ color: T.muted }}>Kolacje vs wydarzenia (zł)</p>
            </div>
            <Badge label="Trend" color={T.green} bg="rgba(96,194,117,0.1)" />
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={MONTHLY_REVENUE}>
              <XAxis dataKey="month" tick={{ fill: T.muted, fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: T.muted, fontSize: 11 }} axisLine={false} tickLine={false} width={40} tickFormatter={(v) => `${v / 1000}k`} />
              <ReTooltip
                cursor={false}
                contentStyle={{ backgroundColor: T.card, border: `1px solid ${T.border}`, borderRadius: 8, color: T.cream, fontSize: 12 }}
                formatter={(v: number) => [`${v.toLocaleString()} zł`, ""]}
              />
              <Area type="monotone" dataKey="dining" name="Kolacje" stroke={T.gold} fill={T.gold + "20"} strokeWidth={2} />
              <Area type="monotone" dataKey="events" name="Wydarzenia" stroke={T.blue} fill={T.blue + "20"} strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Quick summary cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Pending attention */}
        <Card className="p-5">
          <p className="text-sm font-medium mb-3" style={{ color: T.cream }}>
            <span className="inline-flex items-center gap-2"><Bell size={14} style={{ color: T.amber }} /> Wymagające uwagi</span>
          </p>
          <div className="space-y-2">
            {RESERVATIONS.filter((r) => r.status === "pending").map((r) => (
              <div key={r.id} className="flex items-center justify-between py-2 px-3 rounded-lg" style={{ backgroundColor: T.subtle }}>
                <div>
                  <span className="text-sm" style={{ color: T.cream }}>{r.guestName}</span>
                  <span className="text-xs ml-2" style={{ color: T.muted }}>{r.date} · {r.time}</span>
                </div>
                <Badge label="Oczekująca" color={T.amber} bg="rgba(246,191,96,0.1)" />
              </div>
            ))}
            {EVENTS.filter((e) => e.status === "inquiry").map((e) => (
              <div key={e.id} className="flex items-center justify-between py-2 px-3 rounded-lg" style={{ backgroundColor: T.subtle }}>
                <div>
                  <span className="text-sm" style={{ color: T.cream }}>{e.clientName}</span>
                  <span className="text-xs ml-2" style={{ color: T.muted }}>{e.date}</span>
                </div>
                <Badge label="Zapytanie" color={T.purple} bg="rgba(179,157,219,0.1)" />
              </div>
            ))}
          </div>
        </Card>

        {/* Today's timeline */}
        <Card className="p-5">
          <p className="text-sm font-medium mb-3" style={{ color: T.cream }}>
            <span className="inline-flex items-center gap-2"><Clock size={14} style={{ color: T.gold }} /> Dziś — oś czasu</span>
          </p>
          <div className="space-y-1.5">
            {todayRes.sort((a, b) => a.time.localeCompare(b.time)).map((r) => {
              const sm = RESERVATION_STATUS_META[r.status];
              return (
                <div key={r.id} className="flex items-center gap-3 py-1.5">
                  <span className="text-xs tabular-nums w-10 flex-shrink-0" style={{ color: T.muted }}>{r.time}</span>
                  <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: sm.color }} />
                  <span className="text-sm truncate" style={{ color: T.text }}>{r.guestName}</span>
                  <span className="text-xs ml-auto flex-shrink-0" style={{ color: T.muted }}>{r.partySize} os.</span>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Upcoming events */}
        <Card className="p-5">
          <p className="text-sm font-medium mb-3" style={{ color: T.cream }}>
            <span className="inline-flex items-center gap-2"><Star size={14} style={{ color: T.blue }} /> Nadchodzące wydarzenia</span>
          </p>
          <div className="space-y-2">
            {EVENTS.filter((e) => e.status !== "completed").sort((a, b) => a.date.localeCompare(b.date)).slice(0, 4).map((e) => {
              const sm = EVENT_STATUS_META[e.status];
              return (
                <div key={e.id} className="flex items-center justify-between py-2 px-3 rounded-lg" style={{ backgroundColor: T.subtle }}>
                  <div className="min-w-0">
                    <span className="text-sm block truncate" style={{ color: T.cream }}>{e.clientName}</span>
                    <span className="text-xs" style={{ color: T.muted }}>{e.date} · {e.guestCount} os.</span>
                  </div>
                  <Badge label={sm.label} color={sm.color} bg={sm.bg} />
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   SECTION 2 ── RESERVATION MANAGEMENT
══════════════════════════════════════════════════════════ */
function ReservationsSection() {
  const [search, setSearch] = useState("");
  const [statusF, setStatusF] = useState<ReservationStatus | "all">("all");
  const [typeF, setTypeF] = useState<"all" | "dining" | "event">("all");
  const [detail, setDetail] = useState<Reservation | null>(null);

  const filtered = useMemo(() => {
    return RESERVATIONS.filter((r) => {
      if (statusF !== "all" && r.status !== statusF) return false;
      if (typeF !== "all" && r.type !== typeF) return false;
      if (search) {
        const q = search.toLowerCase();
        return r.guestName.toLowerCase().includes(q) || r.id.toLowerCase().includes(q) || r.table.toLowerCase().includes(q);
      }
      return true;
    });
  }, [search, statusF, typeF]);

  return (
    <div className="space-y-6">
      <SectionTitle sub="Zarządzanie wszystkimi rezerwacjami">Rezerwacje</SectionTitle>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="w-72">
          <InputField placeholder="Szukaj gościa, ID, stolika..." value={search} onChange={setSearch} icon={Search} />
        </div>
        <div className="flex gap-2">
          {(["all", "confirmed", "pending", "completed", "no-show", "cancelled"] as const).map((s) => (
            <BtnSecondary key={s} small active={statusF === s} onClick={() => setStatusF(s)}>
              {s === "all" ? "Wszystkie" : RESERVATION_STATUS_META[s].label}
            </BtnSecondary>
          ))}
        </div>
        <div className="flex gap-2 ml-auto">
          <BtnSecondary small active={typeF === "all"} onClick={() => setTypeF("all")}>Wszystkie</BtnSecondary>
          <BtnSecondary small active={typeF === "dining"} onClick={() => setTypeF("dining")}>Kolacje</BtnSecondary>
          <BtnSecondary small active={typeF === "event"} onClick={() => setTypeF("event")}>Wydarzenia</BtnSecondary>
        </div>
      </div>

      {/* Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm" style={{ color: T.text }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${T.border}` }}>
                {["ID", "Gość", "Data", "Godzina", "Os.", "Stolik", "Typ", "Status", "Przypomnienia", ""].map((h) => (
                  <th key={h} className="text-left py-3 px-4 text-xs uppercase tracking-wider font-medium" style={{ color: T.muted }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => {
                const sm = RESERVATION_STATUS_META[r.status];
                return (
                  <tr
                    key={r.id}
                    className="cursor-pointer transition-colors hover:bg-white/[0.02]"
                    style={{ borderBottom: `1px solid ${T.border}` }}
                    onClick={() => setDetail(r)}
                  >
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
                    <td className="py-3 px-4 text-xs">{r.type === "dining" ? "Kolacja" : "Wydarzenie"}</td>
                    <td className="py-3 px-4"><Badge label={sm.label} color={sm.color} bg={sm.bg} /></td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        {r.reminderSms && (() => {
                          const m = REMINDER_STATUS_META[r.reminderSms];
                          return <span title={`SMS: ${m.label}`} className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded" style={{ backgroundColor: m.bg, color: m.color }}><Smartphone size={10} />{r.reminderSms === "sent" ? "✓" : r.reminderSms === "failed" ? "✗" : "◷"}</span>;
                        })()}
                        {r.reminderEmail && (() => {
                          const m = REMINDER_STATUS_META[r.reminderEmail];
                          return <span title={`Email: ${m.label}`} className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded" style={{ backgroundColor: m.bg, color: m.color }}><Mail size={10} />{r.reminderEmail === "sent" ? "✓" : r.reminderEmail === "failed" ? "✗" : "◷"}</span>;
                        })()}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <button className="p-1.5 rounded-md hover:bg-white/5 transition-colors" style={{ color: T.muted }}>
                        <Eye size={15} />
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={10}><EmptyState icon={Search} message="Brak wyników dla wybranych filtrów" /></td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Detail drawer */}
      {detail && <ReservationDetail reservation={detail} onClose={() => setDetail(null)} />}
    </div>
  );
}

function ReservationDetail({ reservation: r, onClose }: { reservation: Reservation; onClose: () => void }) {
  const sm = RESERVATION_STATUS_META[r.status];
  return (
    <>
      <div className="fixed inset-0 z-40" style={{ backgroundColor: "rgba(0,0,0,0.5)" }} onClick={onClose} />
      <div className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md overflow-y-auto" style={{ backgroundColor: "#111A17", borderLeft: `1px solid rgba(182,138,58,0.15)` }}>
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
              <p className="text-[11px] uppercase tracking-wider font-medium mb-2" style={{ color: T.muted }}>Uwagi wewnętrzne</p>
              <p className="text-sm leading-relaxed p-3 rounded-lg" style={{ color: T.text, backgroundColor: T.subtle, border: `1px solid ${T.border}` }}>{r.notes}</p>
            </div>
          )}

          {/* Reminder status */}
          {(r.reminderSms || r.reminderEmail) && (
            <div className="mb-6">
              <p className="text-[11px] uppercase tracking-wider font-medium mb-3" style={{ color: T.muted }}>Przypomnienia ({POLICY.reminderHoursBefore}h przed wizytą)</p>
              <div className="space-y-2">
                {r.reminderSms && (() => {
                  const m = REMINDER_STATUS_META[r.reminderSms];
                  return (
                    <div className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: m.bg, border: `1px solid ${m.color}22` }}>
                      <Smartphone size={15} style={{ color: m.color }} />
                      <div className="flex-1">
                        <span className="text-sm" style={{ color: T.cream }}>SMS</span>
                        <span className="text-xs ml-2" style={{ color: T.muted }}>({r.phone})</span>
                      </div>
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: m.bg, color: m.color }}>{m.label}</span>
                    </div>
                  );
                })()}
                {r.reminderEmail && (() => {
                  const m = REMINDER_STATUS_META[r.reminderEmail];
                  return (
                    <div className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: m.bg, border: `1px solid ${m.color}22` }}>
                      <Mail size={15} style={{ color: m.color }} />
                      <div className="flex-1">
                        <span className="text-sm" style={{ color: T.cream }}>E-mail</span>
                        <span className="text-xs ml-2" style={{ color: T.muted }}>({r.email})</span>
                      </div>
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: m.bg, color: m.color }}>{m.label}</span>
                    </div>
                  );
                })()}
              </div>
            </div>
          )}

          <div className="h-px mb-5" style={{ backgroundColor: T.border }} />

          <div className="space-y-2">
            <BtnPrimary>
              <span className="flex items-center gap-2"><Edit3 size={14} /> Edytuj rezerwację</span>
            </BtnPrimary>
            <div className="flex gap-2">
              <button
                className="flex-1 py-2.5 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-all active:scale-[0.97]"
                style={{ backgroundColor: T.subtle, color: T.text, border: `1px solid ${T.border}` }}
              >
                <Utensils size={14} /> Przypisz stolik
              </button>
              <button
                className="flex-1 py-2.5 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-all active:scale-[0.97]"
                style={{ backgroundColor: "rgba(242,139,130,0.08)", color: T.red, border: `1px solid rgba(242,139,130,0.2)` }}
              >
                <Trash2 size={14} /> Anuluj
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
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

/* ══════════════════════════════════════════════════════════
   SECTION 3 ── EVENT MANAGEMENT (Kanban pipeline)
══════════════════════════════════════════════════════════ */
function EventsSection() {
  const [detail, setDetail] = useState<EventData | null>(null);
  const columns: EventStatus[] = ["inquiry", "pending", "confirmed", "completed"];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <SectionTitle sub="Pipeline wydarzeń prywatnych">Wydarzenia</SectionTitle>
        <BtnPrimary><span className="flex items-center gap-2"><Plus size={14} /> Nowe wydarzenie</span></BtnPrimary>
      </div>

      {/* Pipeline columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {columns.map((col) => {
          const meta = EVENT_STATUS_META[col];
          const items = EVENTS.filter((e) => e.status === col);
          return (
            <div key={col}>
              {/* Column header */}
              <div className="flex items-center gap-2 mb-3 px-1">
                <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: meta.color }} />
                <span className="text-sm font-medium" style={{ color: T.cream }}>{meta.label}</span>
                <span className="ml-auto text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: meta.bg, color: meta.color }}>{items.length}</span>
              </div>

              {/* Cards */}
              <div className="space-y-3">
                {items.map((ev) => (
                  <Card key={ev.id} className="p-4 cursor-pointer hover:bg-white/[0.02] transition-colors" style={{ borderLeft: `3px solid ${meta.color}` }}>
                    <div onClick={() => setDetail(ev)}>
                      <p className="text-sm font-medium mb-1 truncate" style={{ color: T.cream }}>{ev.clientName}</p>
                      <div className="flex items-center gap-3 text-xs mb-2" style={{ color: T.muted }}>
                        <span className="flex items-center gap-1"><Calendar size={11} /> {ev.date}</span>
                        <span className="flex items-center gap-1"><Users size={11} /> {ev.guestCount} os.</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs mb-2" style={{ color: T.text }}>
                        <MapPin size={11} style={{ color: T.muted, flexShrink: 0 }} />
                        <span className="truncate">{ev.space}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs" style={{ color: T.muted }}>{ev.menuPackage.split("(")[0].trim()}</span>
                        <span className="text-sm font-medium tabular-nums" style={{ color: T.gold }}>{ev.revenue.toLocaleString()} zł</span>
                      </div>
                      {ev.assignedManager !== "—" && (
                        <div className="flex items-center gap-1.5 mt-2 text-xs" style={{ color: T.muted }}>
                          <UserCog size={11} /> {ev.assignedManager}
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
                {items.length === 0 && (
                  <div className="text-center py-10 text-xs" style={{ color: T.muted }}>Brak</div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary bar */}
      <Card className="p-4 flex items-center justify-between">
        <div className="flex gap-6">
          <div>
            <span className="text-xs block uppercase tracking-wider" style={{ color: T.muted }}>Łączne przychody (potwierdzone)</span>
            <span className="text-xl font-light tabular-nums" style={{ color: T.gold }}>
              {EVENTS.filter((e) => e.status === "confirmed" || e.status === "completed").reduce((s, e) => s + e.revenue, 0).toLocaleString()} zł
            </span>
          </div>
          <div>
            <span className="text-xs block uppercase tracking-wider" style={{ color: T.muted }}>Pipeline (zapytania + w trakcie)</span>
            <span className="text-xl font-light tabular-nums" style={{ color: T.amber }}>
              {EVENTS.filter((e) => e.status === "inquiry" || e.status === "pending").reduce((s, e) => s + e.revenue, 0).toLocaleString()} zł
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <BtnSecondary small><span className="flex items-center gap-1"><Download size={12} /> Eksport</span></BtnSecondary>
        </div>
      </Card>

      {/* Event detail drawer */}
      {detail && <EventDetail event={detail} onClose={() => setDetail(null)} />}
    </div>
  );
}

function EventDetail({ event: ev, onClose }: { event: EventData; onClose: () => void }) {
  const sm = EVENT_STATUS_META[ev.status];
  return (
    <>
      <div className="fixed inset-0 z-40" style={{ backgroundColor: "rgba(0,0,0,0.5)" }} onClick={onClose} />
      <div className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md overflow-y-auto" style={{ backgroundColor: "#111A17", borderLeft: `1px solid rgba(182,138,58,0.15)` }}>
        <div className="h-1.5" style={{ backgroundColor: sm.color }} />
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-xs tabular-nums mb-1" style={{ color: T.muted }}>{ev.id}</p>
              <h3 className="text-xl font-light" style={{ color: T.cream }}>{ev.clientName}</h3>
            </div>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/5" style={{ color: T.muted }}><X size={18} /></button>
          </div>
          <Badge label={sm.label} color={sm.color} bg={sm.bg} />

          <div className="h-px my-5" style={{ backgroundColor: T.border }} />

          <div className="space-y-3 mb-6">
            <DetailRow icon={Calendar} label="Data" value={ev.date} />
            <DetailRow icon={Users} label="Goście" value={`${ev.guestCount}`} />
            <DetailRow icon={MapPin} label="Przestrzeń" value={ev.space} />
            <DetailRow icon={Utensils} label="Menu" value={ev.menuPackage} />
            <DetailRow icon={UserCog} label="Menedżer" value={ev.assignedManager} />
            <DetailRow icon={DollarSign} label="Przychód" value={`${ev.revenue.toLocaleString()} zł`} />
            <DetailRow icon={Mail} label="Email" value={ev.contactEmail} />
            <DetailRow icon={Phone} label="Telefon" value={ev.contactPhone} />
          </div>

          {ev.notes && (
            <div className="mb-6">
              <p className="text-[11px] uppercase tracking-wider font-medium mb-2" style={{ color: T.muted }}>Uwagi</p>
              <p className="text-sm p-3 rounded-lg leading-relaxed" style={{ color: T.text, backgroundColor: T.subtle, border: `1px solid ${T.border}` }}>{ev.notes}</p>
            </div>
          )}

          <div className="h-px mb-5" style={{ backgroundColor: T.border }} />
          <div className="flex gap-2">
            <BtnPrimary><span className="flex items-center gap-2"><Edit3 size={14} /> Edytuj</span></BtnPrimary>
            <BtnSecondary><span className="flex items-center gap-2"><CheckCircle size={14} /> Potwierdź</span></BtnSecondary>
          </div>
        </div>
      </div>
    </>
  );
}

/* ══════════════════════════════════════════════════════════
   SECTION 4 ── TABLE & CAPACITY CONTROL
══════════════════════════════════════════════════════════ */
function TablesSection() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <SectionTitle sub="Definicja stolików, pojemność i daty zamknięcia">Stoliki i pojemność</SectionTitle>
        <BtnPrimary><span className="flex items-center gap-2"><Plus size={14} /> Dodaj stolik</span></BtnPrimary>
      </div>

      {/* Table definitions */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm" style={{ color: T.text }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${T.border}` }}>
                {["Nr", "Sekcja", "Maks. os.", "Min. os.", "Status", "Uwagi", ""].map((h) => (
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
                    {t.isActive
                      ? <Badge label="Aktywny" color={T.green} bg="rgba(96,194,117,0.1)" />
                      : <Badge label="Wyłączony" color={T.red} bg="rgba(242,139,130,0.1)" />
                    }
                  </td>
                  <td className="py-3 px-4 text-xs" style={{ color: T.muted }}>{t.notes || "—"}</td>
                  <td className="py-3 px-4">
                    <button className="p-1.5 rounded-md hover:bg-white/5 transition-colors" style={{ color: T.muted }}><Edit3 size={14} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Capacity grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Capacity summary */}
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
                  <span className="text-xs tabular-nums w-20 text-right" style={{ color: T.muted }}>
                    {active.length} st. / {totalCap} os.
                  </span>
                </div>
              );
            })}
            <div className="h-px mt-2" style={{ backgroundColor: T.border }} />
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium" style={{ color: T.cream }}>Łącznie aktywne</span>
              <span className="text-sm tabular-nums" style={{ color: T.gold }}>
                {TABLES.filter((t) => t.isActive).length} stolików · {TABLES.filter((t) => t.isActive).reduce((s, t) => s + t.capacity, 0)} miejsc
              </span>
            </div>
          </div>
        </Card>

        {/* Blackout dates */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium" style={{ color: T.cream }}>Daty zamknięcia (blackout)</p>
            <BtnSecondary small><span className="flex items-center gap-1"><Plus size={12} /> Dodaj</span></BtnSecondary>
          </div>
          <div className="space-y-2">
            {POLICY.blackoutDates.map((d) => (
              <div key={d} className="flex items-center justify-between py-2.5 px-3 rounded-lg" style={{ backgroundColor: T.subtle, border: `1px solid ${T.border}` }}>
                <div className="flex items-center gap-2">
                  <Ban size={14} style={{ color: T.red }} />
                  <span className="text-sm tabular-nums" style={{ color: T.cream }}>{d}</span>
                </div>
                <button className="p-1 rounded hover:bg-white/5 transition-colors" style={{ color: T.muted }}><Trash2 size={13} /></button>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 rounded-lg" style={{ backgroundColor: "rgba(122,175,232,0.06)", border: "1px solid rgba(122,175,232,0.15)" }}>
            <p className="text-xs" style={{ color: T.blue }}>
              <Info size={12} className="inline mr-1" />
              Daty zamknięcia blokują nowe rezerwacje online. Istniejące rezerwacje nie są automatycznie anulowane.
            </p>
          </div>
        </Card>
      </div>

      {/* Capacity per time slot */}
      <Card className="p-5">
        <p className="text-sm font-medium mb-4" style={{ color: T.cream }}>Limity pojemności — okna czasowe</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {["18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30"].map((slot) => {
            const maxCap = 38;
            const currentCap = TIME_SLOT_PERFORMANCE.find((t) => t.slot === slot)?.avg ?? 0;
            const pct = Math.round((currentCap / maxCap) * 100);
            return (
              <div key={slot} className="text-center p-3 rounded-lg" style={{ backgroundColor: T.subtle, border: `1px solid ${T.border}` }}>
                <span className="text-xs block mb-1 tabular-nums" style={{ color: T.muted }}>{slot}</span>
                <span className="text-lg font-light block tabular-nums" style={{ color: pct > 80 ? T.red : pct > 60 ? T.amber : T.cream }}>{currentCap}</span>
                <span className="text-[10px] block" style={{ color: T.muted }}>śr. nakryć</span>
                <div className="h-1 mt-2 rounded-full overflow-hidden" style={{ backgroundColor: "rgba(243,239,234,0.05)" }}>
                  <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: pct > 80 ? T.red : pct > 60 ? T.amber : T.green }} />
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   SECTION 5 ── POLICY & RULES
══════════════════════════════════════════════════════════ */
function PolicySection() {
  return (
    <div className="space-y-6">
      <SectionTitle sub="Zasady rezerwacji, anulacji i regulamin dla gości">Regulamin i zasady</SectionTitle>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Booking rules */}
        <Card className="p-5">
          <p className="text-sm font-medium mb-4 flex items-center gap-2" style={{ color: T.cream }}>
            <Settings size={15} style={{ color: T.gold }} /> Zasady rezerwacji
          </p>
          <div className="space-y-4">
            <PolicyRow label="Okno rezerwacji" value={`${POLICY.bookingWindowDays} dni z wyprzedzeniem`} hint="Goście mogą rezerwować do X dni naprzód" />
            <PolicyRow label="Czas anulacji" value={`Bezpłatna do ${POLICY.cancellationHours}h przed`} hint="Anulacja po terminie = opłata" />
            <PolicyRow label="Opłata za nieobecność" value={`${POLICY.noShowFee} zł / osobę`} hint="Pobierana automatycznie z karty" />
            <PolicyRow label="Maks. wielkość grupy" value={`${POLICY.maxPartySize} osób (online)`} hint="Większe grupy — kontakt telefoniczny" />
            <PolicyRow label="Utrzymanie stolika" value="15 minut" hint="Po tym czasie rezerwacja automatycznie wygasa" />
          </div>
          <div className="mt-5">
            <BtnPrimary small><span className="flex items-center gap-2"><Edit3 size={13} /> Edytuj zasady</span></BtnPrimary>
          </div>
        </Card>

        {/* Dress code */}
        <Card className="p-5">
          <p className="text-sm font-medium mb-4 flex items-center gap-2" style={{ color: T.cream }}>
            <Shield size={15} style={{ color: T.gold }} /> Dress code
          </p>
          <p className="text-sm leading-relaxed p-4 rounded-lg mb-4" style={{ color: T.text, backgroundColor: T.subtle, border: `1px solid ${T.border}` }}>
            {POLICY.dressCode}
          </p>
          <p className="text-[11px] uppercase tracking-wider font-medium mb-2 mt-6" style={{ color: T.muted }}>Wyświetlane w interfejsie gościa</p>
          <div className="p-3 rounded-lg" style={{ backgroundColor: "rgba(182,138,58,0.06)", border: "1px solid rgba(182,138,58,0.15)" }}>
            <p className="text-xs italic" style={{ color: T.gold }}>
              "{POLICY.dressCode}"
            </p>
          </div>
          <div className="mt-4">
            <BtnPrimary small><span className="flex items-center gap-2"><Edit3 size={13} /> Edytuj dress code</span></BtnPrimary>
          </div>
        </Card>
      </div>

      {/* Notification / Reminder settings */}
      <Card className="p-5">
        <p className="text-sm font-medium mb-4 flex items-center gap-2" style={{ color: T.cream }}>
          <Bell size={15} style={{ color: T.gold }} /> Automatyczne przypomnienia
        </p>
        <div className="p-4 rounded-lg mb-4" style={{ backgroundColor: POLICY.reminderEnabled ? "rgba(96,194,117,0.06)" : T.subtle, border: `1px solid ${POLICY.reminderEnabled ? "rgba(96,194,117,0.15)" : T.border}` }}>
          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="text-sm block" style={{ color: T.cream }}>Status systemu powiadomień</span>
              <span className="text-xs block mt-0.5" style={{ color: T.muted }}>Automatyczne SMS i e-mail przed rezerwacją</span>
            </div>
            <span className="text-xs font-semibold px-3 py-1 rounded-full" style={{
              backgroundColor: POLICY.reminderEnabled ? "rgba(96,194,117,0.12)" : "rgba(242,139,130,0.1)",
              color: POLICY.reminderEnabled ? T.green : T.red,
            }}>
              {POLICY.reminderEnabled ? "Aktywne" : "Wyłączone"}
            </span>
          </div>
        </div>
        <div className="space-y-4">
          <PolicyRow label="Czas przypomnienia" value={`${POLICY.reminderHoursBefore}h przed wizytą`} hint="SMS i e-mail wysyłane automatycznie" />
          <div className="flex items-start justify-between py-2">
            <div>
              <span className="text-sm flex items-center gap-2" style={{ color: T.cream }}><Smartphone size={13} style={{ color: T.gold }} /> Przypomnienie SMS</span>
              <span className="text-xs block mt-0.5" style={{ color: T.muted }}>Wiadomość tekstowa na numer gościa</span>
            </div>
            <span className="text-sm font-medium tabular-nums text-right" style={{ color: POLICY.reminderSmsEnabled ? T.green : T.red }}>
              {POLICY.reminderSmsEnabled ? "Włączone ✓" : "Wyłączone"}
            </span>
          </div>
          <div className="flex items-start justify-between py-2">
            <div>
              <span className="text-sm flex items-center gap-2" style={{ color: T.cream }}><Mail size={13} style={{ color: T.gold }} /> Przypomnienie e-mail</span>
              <span className="text-xs block mt-0.5" style={{ color: T.muted }}>Wiadomość e-mail z podsumowaniem rezerwacji</span>
            </div>
            <span className="text-sm font-medium tabular-nums text-right" style={{ color: POLICY.reminderEmailEnabled ? T.green : T.red }}>
              {POLICY.reminderEmailEnabled ? "Włączone ✓" : "Wyłączone"}
            </span>
          </div>
        </div>

        <div className="h-px my-4" style={{ backgroundColor: T.border }} />

        {/* Reminder preview */}
        <p className="text-[11px] uppercase tracking-wider font-medium mb-3" style={{ color: T.muted }}>Podgląd wiadomości SMS</p>
        <div className="p-4 rounded-lg mb-4" style={{ backgroundColor: "rgba(182,138,58,0.04)", border: "1px solid rgba(182,138,58,0.15)" }}>
          <p className="text-xs leading-relaxed" style={{ color: T.gold, fontStyle: "italic" }}>
            "Przypominamy o rezerwacji w La Maison Dorée na dziś o godz. 19:30 (2 os., stolik O1). Prosimy o punktualność — stolik utrzymujemy 15 min. W razie zmian: +48 22 345 67 89. Do zobaczenia! 🍽"
          </p>
        </div>
        <p className="text-[11px] uppercase tracking-wider font-medium mb-3" style={{ color: T.muted }}>Podgląd wiadomości e-mail</p>
        <div className="p-4 rounded-lg" style={{ backgroundColor: "rgba(182,138,58,0.04)", border: "1px solid rgba(182,138,58,0.15)" }}>
          <p className="text-xs mb-1" style={{ color: T.muted }}>Temat: Przypomnienie — rezerwacja w La Maison Dorée</p>
          <p className="text-xs leading-relaxed" style={{ color: T.gold, fontStyle: "italic" }}>
            "Szanowna/y [imię], przypominamy o dzisiejszej rezerwacji o godz. 19:30 dla 2 osób (stolik O1). Prosimy o strój smart casual i przybycie w ciągu 15 minut od godziny rezerwacji. W razie pytań: +48 22 345 67 89 lub info@lamaisondoree.pl. Serdecznie zapraszamy!"
          </p>
        </div>

        <div className="mt-5 flex gap-2">
          <BtnPrimary small><span className="flex items-center gap-2"><Edit3 size={13} /> Edytuj szablony</span></BtnPrimary>
          <BtnPrimary small><span className="flex items-center gap-2"><Settings size={13} /> Ustawienia</span></BtnPrimary>
        </div>

        {/* Reminder stats */}
        <div className="h-px my-4" style={{ backgroundColor: T.border }} />
        <p className="text-[11px] uppercase tracking-wider font-medium mb-3" style={{ color: T.muted }}>Statystyki przypomnień — ostatnie 30 dni</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "SMS wysłane", value: "284", color: T.green },
            { label: "E-mail wysłane", value: "291", color: T.green },
            { label: "Dostarczenie SMS", value: "98.2%", color: T.blue },
            { label: "Otwarcia e-mail", value: "67.4%", color: T.amber },
          ].map((stat) => (
            <div key={stat.label} className="text-center p-3 rounded-lg" style={{ backgroundColor: T.subtle, border: `1px solid ${T.border}` }}>
              <span className="text-lg font-light block tabular-nums" style={{ color: stat.color }}>{stat.value}</span>
              <span className="text-[10px] block mt-1" style={{ color: T.muted }}>{stat.label}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* House rules */}
      <Card className="p-5">
        <p className="text-sm font-medium mb-4 flex items-center gap-2" style={{ color: T.cream }}>
          <ClipboardList size={15} style={{ color: T.gold }} /> Regulamin restauracji
        </p>
        <div className="space-y-2">
          {POLICY.houseRules.map((rule, i) => (
            <div key={i} className="flex items-start gap-3 py-2.5 px-4 rounded-lg" style={{ backgroundColor: i % 2 === 0 ? T.subtle : "transparent" }}>
              <span className="text-xs mt-0.5 tabular-nums w-5 flex-shrink-0 font-medium" style={{ color: T.gold }}>{i + 1}.</span>
              <span className="text-sm leading-relaxed" style={{ color: T.text }}>{rule}</span>
              <button className="ml-auto p-1 rounded hover:bg-white/5 flex-shrink-0" style={{ color: T.muted }}><Edit3 size={13} /></button>
            </div>
          ))}
        </div>
        <div className="mt-4 flex gap-2">
          <BtnPrimary small><span className="flex items-center gap-2"><Plus size={13} /> Dodaj regułę</span></BtnPrimary>
        </div>
      </Card>
    </div>
  );
}

function PolicyRow({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div className="flex items-start justify-between py-2">
      <div>
        <span className="text-sm block" style={{ color: T.cream }}>{label}</span>
        <span className="text-xs block mt-0.5" style={{ color: T.muted }}>{hint}</span>
      </div>
      <span className="text-sm font-medium tabular-nums text-right" style={{ color: T.gold }}>{value}</span>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   SECTION 6 ── STAFF & ROLES
══════════════════════════════════════════════════════════ */
const POSITIONS: StaffPosition[] = ["Kierownik sali", "Menedżer", "Kelner/ka", "Sommelier", "Barman/ka", "Administrator", "Hostessa"];
const CONTRACTS: ContractType[] = ["umowa o pracę", "umowa zlecenie", "B2B", "staż"];

const CONTRACT_META: Record<ContractType, { color: string; bg: string }> = {
  "umowa o pracę": { color: T.green, bg: "rgba(96,194,117,0.1)" },
  "umowa zlecenie": { color: T.blue, bg: "rgba(122,175,232,0.1)" },
  "B2B": { color: T.purple, bg: "rgba(179,157,219,0.1)" },
  "staż": { color: T.amber, bg: "rgba(246,191,96,0.1)" },
};

function emptyStaff(): StaffMember {
  return { id: `s${Date.now()}`, name: "", role: "service", position: "Kelner/ka", email: "", phone: "", pin: "", hireDate: new Date().toISOString().slice(0, 10), contract: "umowa o pracę", lastActive: "—", status: "active" };
}

function StaffSection() {
  const [tab, setTab] = useState<"team" | "log">("team");
  const [staff, setStaff] = useState<StaffMember[]>(INITIAL_STAFF);
  const [editing, setEditing] = useState<StaffMember | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [showPins, setShowPins] = useState<Set<string>>(new Set());
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [detailId, setDetailId] = useState<string | null>(null);

  const openNew = () => { setEditing(emptyStaff()); setIsNew(true); };
  const openEdit = (s: StaffMember) => { setEditing({ ...s }); setIsNew(false); };

  const save = () => {
    if (!editing || !editing.name.trim() || !editing.email.trim()) return;
    if (isNew) setStaff((prev) => [...prev, editing]);
    else setStaff((prev) => prev.map((s) => (s.id === editing.id ? editing : s)));
    setEditing(null);
  };

  const remove = (id: string) => { setStaff((prev) => prev.filter((s) => s.id !== id)); setDeleteConfirm(null); if (detailId === id) setDetailId(null); };
  const toggleStatus = (id: string) => setStaff((prev) => prev.map((s) => (s.id === id ? { ...s, status: s.status === "active" ? "inactive" as const : "active" as const } : s)));
  const togglePin = (id: string) => setShowPins((prev) => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const detail = staff.find((s) => s.id === detailId) ?? null;
  const tenure = (d: string) => { const ms = Date.now() - new Date(d).getTime(); const m = Math.floor(ms / (1000 * 60 * 60 * 24 * 30)); return m < 12 ? `${m} mies.` : `${Math.floor(m / 12)} lat ${m % 12} mies.`; };

  const InputField = ({ label, value, onChange, type = "text", placeholder }: { label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string }) => (
    <div>
      <label className="text-[10px] uppercase tracking-widest block mb-1.5" style={{ color: T.muted }}>{label}</label>
      <input value={value} onChange={(e) => onChange(e.target.value)} type={type} placeholder={placeholder}
        className="w-full px-3 py-2.5 rounded-lg text-sm outline-none" style={{ backgroundColor: T.subtle, color: T.cream, border: `1px solid ${T.border}` }} />
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <SectionTitle sub={`${staff.length} osób · ${staff.filter((s) => s.status === "active").length} aktywnych`}>Zespół</SectionTitle>
        <BtnPrimary onClick={openNew}><span className="flex items-center gap-2"><Plus size={14} /> Dodaj osobę</span></BtnPrimary>
      </div>

      <div className="flex gap-2">
        <BtnSecondary active={tab === "team"} onClick={() => setTab("team")}>
          <span className="flex items-center gap-2"><Users size={14} /> Członkowie zespołu</span>
        </BtnSecondary>
        <BtnSecondary active={tab === "log"} onClick={() => setTab("log")}>
          <span className="flex items-center gap-2"><Activity size={14} /> Dziennik aktywności</span>
        </BtnSecondary>
      </div>

      {tab === "team" ? (
        <div className="flex flex-col md:flex-row gap-4">
          {/* Staff table */}
          <Card className={detail ? "flex-1 min-w-0" : "w-full"}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm" style={{ color: T.text }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${T.border}` }}>
                    {["Imię i nazwisko", "Stanowisko", "Rola", "Umowa", "Status", ""].map((h) => (
                      <th key={h} className="text-left py-3 px-4 text-xs uppercase tracking-wider font-medium" style={{ color: T.muted }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {staff.map((s) => {
                    const rm = ROLE_META[s.role];
                    const cm = CONTRACT_META[s.contract];
                    const sel = detailId === s.id;
                    return (
                      <tr
                        key={s.id}
                        onClick={() => setDetailId(sel ? null : s.id)}
                        className="transition-colors hover:bg-white/[0.02] cursor-pointer"
                        style={{ borderBottom: `1px solid ${T.border}`, backgroundColor: sel ? "rgba(182,138,58,0.04)" : undefined }}
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            {s.avatar ? (
                              <img src={s.avatar} alt={s.name} className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
                            ) : (
                              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0" style={{ backgroundColor: rm.bg, color: rm.color }}>
                              {s.name.split(" ").map((n) => n[0]).join("")}
                            </div>
                            )}
                            <div>
                            <span style={{ color: T.cream }}>{s.name}</span>
                              <p className="text-[10px]" style={{ color: T.muted }}>{s.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-xs" style={{ color: T.text }}>{s.position}</td>
                        <td className="py-3 px-4"><Badge label={rm.label} color={rm.color} bg={rm.bg} /></td>
                        <td className="py-3 px-4"><Badge label={s.contract} color={cm.color} bg={cm.bg} /></td>
                        <td className="py-3 px-4">
                          <button onClick={(e) => { e.stopPropagation(); toggleStatus(s.id); }} className="flex items-center gap-1.5 hover:opacity-80 transition-opacity">
                            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: s.status === "active" ? T.green : T.muted }} />
                            <span className="text-xs" style={{ color: s.status === "active" ? T.green : T.muted }}>
                              {s.status === "active" ? "Aktywny" : "Nieaktywny"}
                            </span>
                          </button>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1">
                            <button onClick={(e) => { e.stopPropagation(); openEdit(s); }} className="p-1.5 rounded-md hover:bg-white/5 transition-colors" title="Edytuj"><Edit3 size={14} style={{ color: T.blue }} /></button>
                            <button onClick={(e) => { e.stopPropagation(); setDeleteConfirm(s.id); }} className="p-1.5 rounded-md hover:bg-white/5 transition-colors" title="Usuń"><Trash2 size={14} style={{ color: T.red }} /></button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Delete confirm */}
            {deleteConfirm && (() => {
              const s = staff.find((x) => x.id === deleteConfirm);
              if (!s) return null;
              return (
                <div className="mx-4 mb-4 p-3 rounded-lg flex items-center justify-between" style={{ backgroundColor: "rgba(242,139,130,0.06)", border: "1px solid rgba(242,139,130,0.15)" }}>
                  <span className="text-xs" style={{ color: T.red }}>Usunąć „{s.name}" z zespołu?</span>
                  <div className="flex gap-2">
                    <button onClick={() => setDeleteConfirm(null)} className="text-xs px-3 py-1 rounded-lg" style={{ color: T.muted, backgroundColor: T.subtle }}>Anuluj</button>
                    <button onClick={() => remove(s.id)} className="text-xs px-3 py-1 rounded-lg font-medium" style={{ backgroundColor: "rgba(242,139,130,0.15)", color: T.red }}>Usuń</button>
                  </div>
                </div>
              );
            })()}
          </Card>

          {/* Detail panel */}
          {detail && (
            <Card className="w-full md:w-80 flex-shrink-0 p-5 space-y-5 self-start md:sticky md:top-24">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-widest" style={{ color: T.muted }}>Szczegóły</span>
                <button onClick={() => setDetailId(null)} className="p-1 rounded hover:bg-white/5"><X size={14} style={{ color: T.muted }} /></button>
              </div>
              <div className="flex items-center gap-3">
                {detail.avatar ? (
                  <img src={detail.avatar} alt={detail.name} className="w-12 h-12 rounded-full object-cover flex-shrink-0" />
                ) : (
                  <div className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0" style={{ backgroundColor: ROLE_META[detail.role].bg, color: ROLE_META[detail.role].color }}>
                    {detail.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium" style={{ color: T.cream }}>{detail.name}</p>
                  <p className="text-xs" style={{ color: T.muted }}>{detail.position}</p>
                </div>
              </div>
              <div className="space-y-3">
                {([
                  { icon: Mail, label: "Email", value: detail.email },
                  { icon: Phone, label: "Telefon", value: detail.phone },
                  { icon: Lock, label: "PIN logowania", value: showPins.has(detail.id) ? detail.pin : "••••••", action: () => togglePin(detail.id) },
                  { icon: UserCog, label: "Rola", value: ROLE_META[detail.role].label },
                  { icon: FileText, label: "Umowa", value: detail.contract },
                  { icon: Calendar, label: "Zatrudniony od", value: new Date(detail.hireDate).toLocaleDateString("pl-PL", { day: "numeric", month: "long", year: "numeric" }) },
                  { icon: Clock, label: "Staż", value: tenure(detail.hireDate) },
                  { icon: Activity, label: "Ostatnia aktywność", value: detail.lastActive },
                ] as { icon: typeof Mail; label: string; value: string; action?: () => void }[]).map((row) => (
                  <div key={row.label} className="flex items-start gap-3">
                    <row.icon size={14} className="mt-0.5 flex-shrink-0" style={{ color: T.muted }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] uppercase tracking-widest" style={{ color: T.muted }}>{row.label}</p>
                      <div className="flex items-center gap-2">
                        <p className="text-xs truncate" style={{ color: T.cream }}>{row.value}</p>
                        {row.action && (
                          <button onClick={row.action} className="text-[10px] hover:opacity-80" style={{ color: T.blue }}>
                            {showPins.has(detail.id) ? "ukryj" : "pokaż"}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {detail.notes && (
                  <div className="flex items-start gap-3">
                    <Info size={14} className="mt-0.5 flex-shrink-0" style={{ color: T.muted }} />
                    <div>
                      <p className="text-[10px] uppercase tracking-widest" style={{ color: T.muted }}>Uwagi</p>
                      <p className="text-xs" style={{ color: T.amber }}>{detail.notes}</p>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex gap-2 pt-2" style={{ borderTop: `1px solid ${T.border}` }}>
                <button onClick={() => openEdit(detail)} className="flex-1 py-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5" style={{ backgroundColor: T.subtle, color: T.blue, border: `1px solid ${T.border}` }}>
                  <Edit3 size={12} /> Edytuj
                </button>
                <button onClick={() => toggleStatus(detail.id)} className="flex-1 py-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5" style={{ backgroundColor: T.subtle, color: detail.status === "active" ? T.red : T.green, border: `1px solid ${T.border}` }}>
                  {detail.status === "active" ? <><Ban size={12} /> Dezaktywuj</> : <><CheckCircle size={12} /> Aktywuj</>}
                </button>
              </div>
            </Card>
          )}
        </div>
      ) : (
        <Card className="p-5">
          <p className="text-sm font-medium mb-4 flex items-center gap-2" style={{ color: T.cream }}>
            <Activity size={15} style={{ color: T.gold }} /> Ostatnia aktywność
          </p>
          <div className="space-y-1">
            {ACTIVITY_LOG.map((entry) => (
              <div key={entry.id} className="flex items-start gap-3 py-3 px-3 rounded-lg hover:bg-white/[0.02] transition-colors" style={{ borderBottom: `1px solid ${T.border}` }}>
                <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-[10px] font-medium" style={{ backgroundColor: T.subtle, color: T.muted, border: `1px solid ${T.border}` }}>
                  {entry.user.split(" ").map((n) => n[0]).join("")}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium" style={{ color: T.cream }}>{entry.user}</span>
                    <span className="text-xs" style={{ color: T.muted }}>·</span>
                    <span className="text-xs" style={{ color: T.muted }}>{entry.timestamp}</span>
                  </div>
                  <p className="text-xs mt-0.5" style={{ color: T.amber }}>{entry.action}</p>
                  <p className="text-xs mt-0.5 truncate" style={{ color: T.muted }}>{entry.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* ─── ACCESS CONTROL (always visible under team tab) ─── */}
      {tab === "team" && (
          <Card className="p-5">
            <p className="text-sm font-medium mb-4 flex items-center gap-2" style={{ color: T.cream }}>
              <Lock size={15} style={{ color: T.gold }} /> Kontrola dostępu
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm" style={{ color: T.text }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${T.border}` }}>
                    <th className="text-left py-2 px-3 text-xs uppercase tracking-wider font-medium" style={{ color: T.muted }}>Uprawnienie</th>
                    <th className="text-center py-2 px-3 text-xs uppercase tracking-wider font-medium" style={{ color: T.gold }}>Admin</th>
                    <th className="text-center py-2 px-3 text-xs uppercase tracking-wider font-medium" style={{ color: T.purple }}>Menedżer</th>
                    <th className="text-center py-2 px-3 text-xs uppercase tracking-wider font-medium" style={{ color: T.green }}>Obsługa</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { perm: "Panel admina", admin: true, manager: false, service: false },
                    { perm: "Panel menedżera", admin: true, manager: true, service: false },
                    { perm: "Edycja rezerwacji", admin: true, manager: true, service: false },
                    { perm: "Anulowanie rezerwacji", admin: true, manager: true, service: false },
                    { perm: "Zarządzanie wydarzeniami", admin: true, manager: false, service: false },
                    { perm: "Edycja menu", admin: true, manager: true, service: false },
                    { perm: "Grafik zmian", admin: true, manager: true, service: false },
                    { perm: "Edycja polityk", admin: true, manager: false, service: false },
                    { perm: "Zarządzanie zespołem", admin: true, manager: false, service: false },
                    { perm: "Podgląd zespołu (tylko odczyt)", admin: true, manager: true, service: false },
                    { perm: "Podgląd analityki", admin: true, manager: false, service: false },
                    { perm: "Dashboard kelnerski", admin: true, manager: true, service: true },
                    { perm: "Zmiana statusu stolika", admin: true, manager: true, service: true },
                    { perm: "Przyjmowanie zamówień", admin: true, manager: true, service: true },
                  ].map((row) => (
                    <tr key={row.perm} className="hover:bg-white/[0.02]" style={{ borderBottom: `1px solid ${T.border}` }}>
                      <td className="py-2.5 px-3 text-xs" style={{ color: T.text }}>{row.perm}</td>
                      {([row.admin, row.manager, row.service] as boolean[]).map((v, i) => (
                        <td key={i} className="py-2.5 px-3 text-center">
                        {v ? <CheckCircle size={14} style={{ color: T.green, margin: "0 auto" }} /> : <XCircle size={14} style={{ color: "rgba(243,239,234,0.12)", margin: "0 auto" }} />}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
      )}

      {/* ─── EDIT / ADD MODAL ─── */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}>
          <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl p-6" style={{ backgroundColor: T.card, border: `1px solid ${T.border}` }}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-light" style={{ color: T.cream, fontFamily: T.serif }}>
                {isNew ? "Nowy pracownik" : `Edytuj: ${editing.name}`}
              </h3>
              <button onClick={() => setEditing(null)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/5">
                <X size={16} style={{ color: T.muted }} />
              </button>
            </div>

            <div className="space-y-4">
              {/* Avatar */}
              <div className="flex items-center gap-4">
                {editing.avatar ? (
                  <img src={editing.avatar} alt="" className="w-16 h-16 rounded-full object-cover flex-shrink-0" />
                ) : (
                  <div className="w-16 h-16 rounded-full flex items-center justify-center text-lg font-medium flex-shrink-0" style={{ backgroundColor: ROLE_META[editing.role].bg, color: ROLE_META[editing.role].color }}>
                    {editing.name ? editing.name.split(" ").map((n) => n[0]).join("") : "?"}
                </div>
                )}
                <div className="flex-1">
                  <label className="text-[10px] uppercase tracking-widest block mb-1.5" style={{ color: T.muted }}>URL zdjęcia</label>
                  <div className="flex gap-2">
                    <input value={editing.avatar ?? ""} onChange={(e) => setEditing({ ...editing, avatar: e.target.value || undefined })}
                      placeholder="https://…"
                      className="flex-1 px-3 py-2 rounded-lg text-xs outline-none"
                      style={{ backgroundColor: T.subtle, color: T.cream, border: `1px solid ${T.border}` }} />
                    {editing.avatar && (
                      <button onClick={() => setEditing({ ...editing, avatar: undefined })} className="px-2 rounded-lg hover:bg-white/5" style={{ color: T.red }}>
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <InputField label="Imię i nazwisko" value={editing.name} onChange={(v) => setEditing({ ...editing, name: v })} placeholder="Jan Kowalski" />
                <div>
                  <label className="text-[10px] uppercase tracking-widest block mb-1.5" style={{ color: T.muted }}>Stanowisko</label>
                  <select value={editing.position} onChange={(e) => setEditing({ ...editing, position: e.target.value as StaffPosition })}
                    className="w-full px-3 py-2.5 rounded-lg text-sm outline-none appearance-none cursor-pointer"
                    style={{ backgroundColor: T.subtle, color: T.cream, border: `1px solid ${T.border}` }}>
                    {POSITIONS.map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
          </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <InputField label="Email" value={editing.email} onChange={(v) => setEditing({ ...editing, email: v })} type="email" placeholder="jan@lmd.fr" />
                <InputField label="Telefon" value={editing.phone} onChange={(v) => setEditing({ ...editing, phone: v })} type="tel" placeholder="+48 500 000 000" />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[10px] uppercase tracking-widest block mb-1.5" style={{ color: T.muted }}>Rola systemowa</label>
                  <select value={editing.role} onChange={(e) => setEditing({ ...editing, role: e.target.value as StaffRole })}
                    className="w-full px-3 py-2.5 rounded-lg text-sm outline-none appearance-none cursor-pointer"
                    style={{ backgroundColor: T.subtle, color: T.cream, border: `1px solid ${T.border}` }}>
                    <option value="service">Obsługa</option>
                    <option value="manager">Menedżer</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>
                <InputField label="PIN logowania (6 cyfr)" value={editing.pin} onChange={(v) => { if (/^\d{0,6}$/.test(v)) setEditing({ ...editing, pin: v }); }} placeholder="000000" />
                <InputField label="Data zatrudnienia" value={editing.hireDate} onChange={(v) => setEditing({ ...editing, hireDate: v })} type="date" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase tracking-widest block mb-1.5" style={{ color: T.muted }}>Typ umowy</label>
                  <select value={editing.contract} onChange={(e) => setEditing({ ...editing, contract: e.target.value as ContractType })}
                    className="w-full px-3 py-2.5 rounded-lg text-sm outline-none appearance-none cursor-pointer"
                    style={{ backgroundColor: T.subtle, color: T.cream, border: `1px solid ${T.border}` }}>
                    {CONTRACTS.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-widest block mb-1.5" style={{ color: T.muted }}>Status</label>
                  <select value={editing.status} onChange={(e) => setEditing({ ...editing, status: e.target.value as "active" | "inactive" })}
                    className="w-full px-3 py-2.5 rounded-lg text-sm outline-none appearance-none cursor-pointer"
                    style={{ backgroundColor: T.subtle, color: T.cream, border: `1px solid ${T.border}` }}>
                    <option value="active">Aktywny</option>
                    <option value="inactive">Nieaktywny</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-widest block mb-1.5" style={{ color: T.muted }}>Uwagi</label>
                <textarea value={editing.notes ?? ""} onChange={(e) => setEditing({ ...editing, notes: e.target.value || undefined })}
                  rows={2} placeholder="Opcjonalne uwagi…"
                  className="w-full px-3 py-2.5 rounded-lg text-sm outline-none resize-none"
                  style={{ backgroundColor: T.subtle, color: T.cream, border: `1px solid ${T.border}` }} />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 mt-6 pt-4" style={{ borderTop: `1px solid ${T.border}` }}>
              <BtnSecondary onClick={() => setEditing(null)}>Anuluj</BtnSecondary>
              <BtnPrimary onClick={save} disabled={!editing.name.trim() || !editing.email.trim() || editing.pin.length !== 6}>
                {isNew ? "Dodaj do zespołu" : "Zapisz zmiany"}
              </BtnPrimary>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   SECTION 7 ── ANALYTICS (merged Insights + Statistics)
══════════════════════════════════════════════════════════ */

interface TableRevenue {
  table: string;
  section: string;
  revenue: number;
  covers: number;
  avgBill: number;
  utilization: number;
  topDish: string;
}

const TABLE_REVENUE: TableRevenue[] = [
  { table: "S5", section: "Sala", revenue: 48200, covers: 186, avgBill: 259, utilization: 94, topDish: "Polędwica wołowa" },
  { table: "O2", section: "Okno", revenue: 42800, covers: 164, avgBill: 261, utilization: 91, topDish: "Tatar z tuńczyka" },
  { table: "S6", section: "Sala", revenue: 39600, covers: 152, avgBill: 260, utilization: 88, topDish: "Kaczka konfitowana" },
  { table: "B1", section: "Boks", revenue: 36400, covers: 128, avgBill: 284, utilization: 85, topDish: "Risotto z truflą" },
  { table: "O1", section: "Okno", revenue: 34200, covers: 138, avgBill: 248, utilization: 89, topDish: "Foie gras" },
  { table: "S3", section: "Sala", revenue: 31800, covers: 132, avgBill: 241, utilization: 82, topDish: "Żeberka jagnięce" },
  { table: "B2", section: "Boks", revenue: 30200, covers: 112, avgBill: 270, utilization: 78, topDish: "Polędwica wołowa" },
  { table: "O3", section: "Okno", revenue: 28400, covers: 118, avgBill: 241, utilization: 80, topDish: "Tatar z tuńczyka" },
  { table: "S1", section: "Sala", revenue: 26800, covers: 124, avgBill: 216, utilization: 76, topDish: "Ravioli z homarem" },
  { table: "S2", section: "Sala", revenue: 25200, covers: 116, avgBill: 217, utilization: 74, topDish: "Kaczka konfitowana" },
  { table: "B3", section: "Boks", revenue: 24600, covers: 98, avgBill: 251, utilization: 72, topDish: "Risotto z truflą" },
  { table: "O4", section: "Okno", revenue: 22400, covers: 102, avgBill: 220, utilization: 68, topDish: "Foie gras" },
  { table: "S4", section: "Sala", revenue: 8600, covers: 38, avgBill: 226, utilization: 24, topDish: "Żeberka jagnięce" },
];

const SECTION_REVENUE = [
  { section: "Okno", revenue: 127800, color: T.blue },
  { section: "Sala", revenue: 180200, color: T.gold },
  { section: "Boks", revenue: 91200, color: T.purple },
];

interface WaiterStats {
  id: string;
  name: string;
  revenue: number;
  covers: number;
  avgBill: number;
  tips: number;
  upsellRate: number;
  rating: number;
  topSell: string;
  shifts: number;
}

const WAITER_STATS: WaiterStats[] = [
  { id: "w1", name: "Jan Kowalski",      revenue: 124800, covers: 486, avgBill: 257, tips: 8940, upsellRate: 38, rating: 4.9, topSell: "Dobór win", shifts: 22 },
  { id: "w2", name: "Anna Nowak",        revenue: 108600, covers: 418, avgBill: 260, tips: 7220, upsellRate: 34, rating: 4.7, topSell: "Menu degustacyjne", shifts: 21 },
  { id: "w3", name: "Marek Wiśniewski",  revenue: 86400,  covers: 348, avgBill: 248, tips: 5680, upsellRate: 28, rating: 4.6, topSell: "Aperitif kolekcji szefa", shifts: 20 },
  { id: "w4", name: "Ewa Kamińska",      revenue: 79400,  covers: 316, avgBill: 251, tips: 5120, upsellRate: 26, rating: 4.5, topSell: "Deser szefa kuchni", shifts: 18 },
];

interface DishStats {
  name: string;
  category: string;
  orders: number;
  revenue: number;
  avgPrice: number;
  margin: number;
  trend: number;
}

const TOP_DISHES: DishStats[] = [
  { name: "Polędwica wołowa z sosem bordelaise", category: "Dania główne", orders: 284, revenue: 39760, avgPrice: 140, margin: 62, trend: 12 },
  { name: "Tatar z tuńczyka z awokado",          category: "Przystawki",   orders: 312, revenue: 28080, avgPrice: 90,  margin: 68, trend: 18 },
  { name: "Kaczka konfitowana z figami",          category: "Dania główne", orders: 246, revenue: 32160, avgPrice: 128, margin: 58, trend: 5 },
  { name: "Risotto z truflą i parmezanem",        category: "Dania główne", orders: 198, revenue: 25740, avgPrice: 130, margin: 64, trend: 8 },
  { name: "Foie gras z konfiturą z cebuli",       category: "Przystawki",   orders: 176, revenue: 21120, avgPrice: 120, margin: 72, trend: -3 },
  { name: "Ravioli z homarem",                    category: "Dania główne", orders: 164, revenue: 22960, avgPrice: 140, margin: 56, trend: 15 },
  { name: "Żeberka jagnięce prowansalskie",       category: "Dania główne", orders: 152, revenue: 20520, avgPrice: 135, margin: 60, trend: 6 },
  { name: "Crème brûlée klasyczna",               category: "Desery",       orders: 286, revenue: 11440, avgPrice: 40,  margin: 78, trend: 2 },
  { name: "Tarta Tatin z lodami waniliowymi",     category: "Desery",       orders: 198, revenue: 8910,  avgPrice: 45,  margin: 74, trend: 10 },
  { name: "Deser szefa kuchni (sezonowy)",         category: "Desery",       orders: 142, revenue: 8520,  avgPrice: 60,  margin: 70, trend: 22 },
];

interface DrinkStats {
  name: string;
  category: string;
  orders: number;
  revenue: number;
  avgPrice: number;
  margin: number;
  trend: number;
}

const TOP_DRINKS: DrinkStats[] = [
  { name: "Chablis Premier Cru",           category: "Wina białe",  orders: 186, revenue: 27900, avgPrice: 150, margin: 52, trend: 14 },
  { name: "Burgundy Pinot Noir (btl)",     category: "Wina czerwone", orders: 164, revenue: 29520, avgPrice: 180, margin: 48, trend: 8 },
  { name: "Champagne Brut (btl)",          category: "Szampany",    orders: 128, revenue: 32000, avgPrice: 250, margin: 45, trend: 12 },
  { name: "Dobór win do menu (×1 os.)",    category: "Dobór win",   orders: 312, revenue: 28080, avgPrice: 90,  margin: 65, trend: 22 },
  { name: "Negroni",                       category: "Koktajle",    orders: 198, revenue: 7920,  avgPrice: 40,  margin: 72, trend: 6 },
  { name: "Aperol Spritz",                 category: "Koktajle",    orders: 176, revenue: 6160,  avgPrice: 35,  margin: 74, trend: 18 },
  { name: "Espresso Martini",              category: "Koktajle",    orders: 142, revenue: 5680,  avgPrice: 40,  margin: 70, trend: 25 },
  { name: "Woda mineralna (btl)",          category: "Bezalkohol.", orders: 428, revenue: 6420,  avgPrice: 15,  margin: 82, trend: 0 },
  { name: "Calvados XO",                   category: "Digestify",   orders: 86,  revenue: 5160,  avgPrice: 60,  margin: 58, trend: 4 },
  { name: "Kolekcja aperitifów szefa",     category: "Koktajle",    orders: 94,  revenue: 7520,  avgPrice: 80,  margin: 66, trend: 30 },
];

const DISH_CATEGORIES = [
  { name: "Dania główne", value: 141140, color: T.gold },
  { name: "Przystawki",   value: 49200,  color: T.blue },
  { name: "Desery",       value: 28870,  color: T.purple },
  { name: "Zupy",         value: 12400,  color: T.green },
];

const DRINK_CATEGORIES = [
  { name: "Wina",       value: 89420, color: "#9B2335" },
  { name: "Szampany",   value: 32000, color: T.gold },
  { name: "Koktajle",   value: 27280, color: T.blue },
  { name: "Dobór win",  value: 28080, color: T.purple },
  { name: "Digestify",  value: 5160,  color: T.amber },
  { name: "Bezalkohol.", value: 6420, color: T.green },
];

const MONTHLY_TABLE_TREND = [
  { month: "Wrz", Okno: 18200, Sala: 24800, Boks: 12400 },
  { month: "Paź", Okno: 19800, Sala: 27200, Boks: 13600 },
  { month: "Lis", Okno: 20400, Sala: 28600, Boks: 14200 },
  { month: "Gru", Okno: 26800, Sala: 38400, Boks: 19200 },
  { month: "Sty", Okno: 18600, Sala: 25400, Boks: 13800 },
  { month: "Lut", Okno: 23400, Sala: 32600, Boks: 17400 },
];

/* ══════════════════════════════════════════════════════════
   MENU EDITOR SECTION
══════════════════════════════════════════════════════════ */
function MenuEditorSection() {
  const [items, setItems] = useState<AdminMenuItem[]>(INITIAL_MENU);
  const [activeCategory, setActiveCategory] = useState<MenuCategory | "Wszystkie">("Wszystkie");
  const [search, setSearch] = useState("");
  const [editingItem, setEditingItem] = useState<AdminMenuItem | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const filtered = items.filter((i) => {
    const matchCat = activeCategory === "Wszystkie" || i.category === activeCategory;
    const matchSearch = !search || i.name.toLowerCase().includes(search.toLowerCase()) || i.description.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const grouped = MENU_CATEGORIES.map((cat) => ({
    category: cat,
    items: filtered.filter((i) => i.category === cat),
  })).filter((g) => activeCategory === "Wszystkie" ? g.items.length > 0 : g.category === activeCategory);

  const stats = useMemo(() => ({
    total: items.length,
    active: items.filter((i) => i.isActive).length,
    avgPrice: Math.round(items.reduce((s, i) => s + i.price, 0) / items.length),
    avgMargin: items.filter((i) => i.cost).length > 0
      ? Math.round(items.filter((i) => i.cost).reduce((s, i) => s + ((i.price - (i.cost ?? 0)) / i.price) * 100, 0) / items.filter((i) => i.cost).length)
      : 0,
  }), [items]);

  const openNew = () => {
    setEditingItem({
      id: `m${Date.now()}`,
      name: "",
      price: 0,
      cost: 0,
      description: "",
      ingredients: [],
      category: activeCategory !== "Wszystkie" ? activeCategory : "Dania główne",
      isActive: true,
    });
    setIsNew(true);
  };

  const openEdit = (item: AdminMenuItem) => {
    setEditingItem({ ...item, ingredients: item.ingredients.map((i) => ({ ...i })) });
    setIsNew(false);
  };

  const saveItem = () => {
    if (!editingItem || !editingItem.name.trim()) return;
    if (isNew) {
      setItems((prev) => [...prev, editingItem]);
    } else {
      setItems((prev) => prev.map((i) => (i.id === editingItem.id ? editingItem : i)));
    }
    setEditingItem(null);
  };

  const deleteItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
    setShowDeleteConfirm(null);
  };

  const toggleActive = (id: string) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, isActive: !i.isActive } : i)));
  };

  const addIngredient = () => {
    if (!editingItem) return;
    setEditingItem({ ...editingItem, ingredients: [...editingItem.ingredients, { name: "" }] });
  };

  const updateIngredient = (idx: number, field: keyof Ingredient, value: string | boolean | undefined) => {
    if (!editingItem) return;
    const ings = editingItem.ingredients.map((ing, i) => (i === idx ? { ...ing, [field]: value } : ing));
    setEditingItem({ ...editingItem, ingredients: ings });
  };

  const removeIngredient = (idx: number) => {
    if (!editingItem) return;
    setEditingItem({ ...editingItem, ingredients: editingItem.ingredients.filter((_, i) => i !== idx) });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <SectionTitle sub={`${stats.total} pozycji · ${stats.active} aktywnych · śr. cena ${stats.avgPrice} zł · marża ${stats.avgMargin}%`}>
          Menu restauracji
        </SectionTitle>
        <BtnPrimary onClick={openNew}><Plus size={14} className="inline mr-1" />Dodaj pozycję</BtnPrimary>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {MENU_CATEGORIES.map((cat) => {
          const catItems = items.filter((i) => i.category === cat);
          const Icon = CATEGORY_ICONS[cat];
          return (
            <Card key={cat} className="p-4 cursor-pointer transition-all hover:scale-[1.01]" style={activeCategory === cat ? { border: `1px solid ${T.gold}40` } : undefined}>
              <div className="flex items-center gap-3" onClick={() => setActiveCategory(activeCategory === cat ? "Wszystkie" : cat)}>
                <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: T.gold + "15" }}>
                  <Icon size={16} style={{ color: T.gold }} />
                </div>
                <div>
                  <div className="text-lg font-light" style={{ color: T.cream }}>{catItems.length}</div>
                  <div className="text-[10px] uppercase tracking-widest" style={{ color: T.muted }}>{cat}</div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: T.muted }} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Szukaj po nazwie lub opisie…"
              className="w-full pl-9 pr-3 py-2 rounded-lg text-sm outline-none"
              style={{ backgroundColor: T.subtle, color: T.cream, border: `1px solid ${T.border}` }}
            />
          </div>
          <div className="flex gap-1.5 flex-wrap">
            <BtnSecondary small active={activeCategory === "Wszystkie"} onClick={() => setActiveCategory("Wszystkie")}>Wszystkie</BtnSecondary>
            {MENU_CATEGORIES.map((cat) => (
              <BtnSecondary key={cat} small active={activeCategory === cat} onClick={() => setActiveCategory(cat)}>{cat}</BtnSecondary>
            ))}
          </div>
        </div>
      </Card>

      {/* Menu items list */}
      {grouped.map((g) => (
        <div key={g.category}>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm font-medium" style={{ color: T.gold }}>{g.category}</span>
            <span className="text-xs" style={{ color: T.muted }}>({g.items.length})</span>
          </div>
          <div className="space-y-2">
            {g.items.map((item) => {
              const margin = item.cost ? Math.round(((item.price - item.cost) / item.price) * 100) : null;
              const allergens = item.ingredients.filter((i) => i.allergen).map((i) => i.allergen!);
              const hasAlcohol = item.ingredients.some((i) => i.alcohol);
              return (
                <Card key={item.id} className="p-4 transition-all hover:scale-[1.002]" style={{ opacity: item.isActive ? 1 : 0.5 }}>
                  <div className="flex items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="text-sm font-medium" style={{ color: T.cream }}>{item.name}</span>
                        {item.diet === "vegan" && (
                          <>
                            <Badge label="Wegan" color="#4CAF50" bg="rgba(76,175,80,0.1)" />
                            <Badge label="Wege" color="#8BC34A" bg="rgba(139,195,74,0.1)" />
                          </>
                        )}
                        {item.diet === "vegetarian" && <Badge label="Wege" color="#8BC34A" bg="rgba(139,195,74,0.1)" />}
                        {!item.isActive && <Badge label="Nieaktywne" color={T.red} bg="rgba(242,139,130,0.1)" />}
                        {item.isSeasonal && <Badge label="Sezonowe" color={T.amber} bg="rgba(246,191,96,0.1)" />}
                        {hasAlcohol && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded font-medium" style={{ backgroundColor: "rgba(179,157,219,0.1)", color: T.purple, border: `1px solid ${T.purple}25` }}>
                            Alkohol
                          </span>
                        )}
                      </div>
                      <p className="text-xs mb-2 line-clamp-1" style={{ color: T.muted }}>{item.description}</p>
                      {allergens.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {[...new Set(allergens)].map((a) => (
                            <span key={a} className="text-[10px] px-1.5 py-0.5 rounded-md font-medium" style={{ backgroundColor: (ALLERGEN_COLORS[a] ?? T.muted) + "18", color: ALLERGEN_COLORS[a] ?? T.muted }}>
                              {a}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-4 flex-shrink-0">
                      <div className="text-right">
                        <div className="text-sm font-semibold tabular-nums" style={{ color: T.cream }}>{item.price} zł</div>
                        {margin !== null && (
                          <div className="text-[10px] tabular-nums" style={{ color: margin >= 65 ? T.green : margin >= 50 ? T.amber : T.red }}>
                            marża {margin}%
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <button onClick={() => toggleActive(item.id)} className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:bg-white/5" title={item.isActive ? "Dezaktywuj" : "Aktywuj"}>
                          {item.isActive ? <Eye size={14} style={{ color: T.green }} /> : <XCircle size={14} style={{ color: T.red }} />}
                        </button>
                        <button onClick={() => openEdit(item)} className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:bg-white/5" title="Edytuj">
                          <Edit3 size={14} style={{ color: T.blue }} />
                        </button>
                        <button
                          onClick={() => setShowDeleteConfirm(item.id)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:bg-white/5"
                          title="Usuń"
                        >
                          <Trash2 size={14} style={{ color: T.red }} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Delete confirmation */}
                  {showDeleteConfirm === item.id && (
                    <div className="mt-3 p-3 rounded-lg flex items-center justify-between" style={{ backgroundColor: "rgba(242,139,130,0.06)", border: "1px solid rgba(242,139,130,0.15)" }}>
                      <span className="text-xs" style={{ color: T.red }}>Czy na pewno usunąć „{item.name}"?</span>
                      <div className="flex gap-2">
                        <button onClick={() => setShowDeleteConfirm(null)} className="text-xs px-3 py-1 rounded-lg" style={{ color: T.muted, backgroundColor: T.subtle }}>Anuluj</button>
                        <button onClick={() => deleteItem(item.id)} className="text-xs px-3 py-1 rounded-lg font-medium" style={{ backgroundColor: "rgba(242,139,130,0.15)", color: T.red }}>Usuń</button>
                      </div>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        </div>
      ))}

      {filtered.length === 0 && (
        <Card className="p-12 text-center">
          <Search size={32} style={{ color: T.muted, margin: "0 auto 12px" }} />
          <p className="text-sm" style={{ color: T.muted }}>Brak wyników dla podanych filtrów</p>
        </Card>
      )}

      {/* ─── EDIT / ADD MODAL ─── */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}>
          <div
            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl p-6"
            style={{ backgroundColor: T.card, border: `1px solid ${T.border}` }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-light" style={{ color: T.cream, fontFamily: T.serif }}>
                {isNew ? "Nowa pozycja menu" : `Edytuj: ${editingItem.name}`}
              </h3>
              <button onClick={() => setEditingItem(null)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/5">
                <X size={16} style={{ color: T.muted }} />
              </button>
            </div>

            <div className="space-y-4">
              {/* Name + Category */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase tracking-widest block mb-1.5" style={{ color: T.muted }}>Nazwa</label>
                  <input
                    value={editingItem.name}
                    onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
                    style={{ backgroundColor: T.subtle, color: T.cream, border: `1px solid ${T.border}` }}
                    placeholder="Nazwa dania…"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-widest block mb-1.5" style={{ color: T.muted }}>Kategoria</label>
                  <select
                    value={editingItem.category}
                    onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value as MenuCategory })}
                    className="w-full px-3 py-2.5 rounded-lg text-sm outline-none appearance-none cursor-pointer"
                    style={{ backgroundColor: T.subtle, color: T.cream, border: `1px solid ${T.border}` }}
                  >
                    {MENU_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="text-[10px] uppercase tracking-widest block mb-1.5" style={{ color: T.muted }}>Opis</label>
                <textarea
                  value={editingItem.description}
                  onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2.5 rounded-lg text-sm outline-none resize-none"
                  style={{ backgroundColor: T.subtle, color: T.cream, border: `1px solid ${T.border}` }}
                  placeholder="Krótki opis dania…"
                />
              </div>

              {/* Price + Cost + Flags */}
              <div className="grid grid-cols-4 gap-3">
                <div>
                  <label className="text-[10px] uppercase tracking-widest block mb-1.5" style={{ color: T.muted }}>Cena (zł)</label>
                  <input
                    type="number"
                    value={editingItem.price || ""}
                    onChange={(e) => setEditingItem({ ...editingItem, price: Number(e.target.value) })}
                    className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
                    style={{ backgroundColor: T.subtle, color: T.cream, border: `1px solid ${T.border}` }}
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-widest block mb-1.5" style={{ color: T.muted }}>Koszt (zł)</label>
                  <input
                    type="number"
                    value={editingItem.cost || ""}
                    onChange={(e) => setEditingItem({ ...editingItem, cost: Number(e.target.value) })}
                    className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
                    style={{ backgroundColor: T.subtle, color: T.cream, border: `1px solid ${T.border}` }}
                  />
                </div>
                <div className="flex items-end pb-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingItem.isActive}
                      onChange={() => setEditingItem({ ...editingItem, isActive: !editingItem.isActive })}
                      className="w-4 h-4 rounded accent-[#60C275]"
                    />
                    <span className="text-xs" style={{ color: T.text }}>Aktywne</span>
                  </label>
                </div>
                <div className="flex items-end pb-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingItem.isSeasonal ?? false}
                      onChange={() => setEditingItem({ ...editingItem, isSeasonal: !(editingItem.isSeasonal ?? false) })}
                      className="w-4 h-4 rounded accent-[#F6BF60]"
                    />
                    <span className="text-xs" style={{ color: T.text }}>Sezonowe</span>
                  </label>
                </div>
              </div>

              {/* Diet type */}
              <div>
                <label className="text-[10px] uppercase tracking-widest block mb-1.5" style={{ color: T.muted }}>Dieta</label>
                <div className="flex gap-2">
                  {([
                    { value: undefined, label: "Brak", color: T.muted },
                    { value: "vegetarian" as DietType, label: "Wege", color: "#8BC34A" },
                    { value: "vegan" as DietType, label: "Wegan", color: "#4CAF50" },
                  ] as const).map((opt) => (
                    <button
                      key={opt.label}
                      onClick={() => setEditingItem({ ...editingItem, diet: opt.value as DietType | undefined })}
                      className="px-3 py-2 rounded-lg text-xs font-medium transition-all"
                      style={{
                        backgroundColor: editingItem.diet === opt.value ? (opt.value ? `${opt.color}15` : T.subtle) : T.subtle,
                        color: editingItem.diet === opt.value ? (opt.value ? opt.color : T.cream) : T.muted,
                        border: editingItem.diet === opt.value ? `1px solid ${opt.value ? opt.color + "40" : T.border}` : `1px solid ${T.border}`,
                      }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Margin preview */}
              {editingItem.price > 0 && editingItem.cost && editingItem.cost > 0 && (
                <div className="p-3 rounded-lg" style={{ backgroundColor: T.subtle }}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs" style={{ color: T.muted }}>Marża</span>
                    <span className="text-sm font-semibold tabular-nums" style={{ color: ((editingItem.price - editingItem.cost) / editingItem.price) * 100 >= 65 ? T.green : T.amber }}>
                      {Math.round(((editingItem.price - editingItem.cost) / editingItem.price) * 100)}% · zysk {editingItem.price - editingItem.cost} zł
                    </span>
                  </div>
                </div>
              )}

              {/* Ingredients */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[10px] uppercase tracking-widest" style={{ color: T.muted }}>Składniki</label>
                  <button onClick={addIngredient} className="text-xs px-2 py-1 rounded-lg flex items-center gap-1 transition-colors hover:bg-white/5" style={{ color: T.gold }}>
                    <Plus size={12} /> Dodaj
                  </button>
                </div>
                <div className="space-y-2">
                  {editingItem.ingredients.map((ing, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <GripVertical size={12} style={{ color: T.muted, flexShrink: 0 }} />
                      <input
                        value={ing.name}
                        onChange={(e) => updateIngredient(idx, "name", e.target.value)}
                        placeholder="Nazwa składnika…"
                        className="flex-1 px-3 py-2 rounded-lg text-xs outline-none"
                        style={{ backgroundColor: T.subtle, color: T.cream, border: `1px solid ${T.border}` }}
                      />
                      <select
                        value={ing.allergen ?? ""}
                        onChange={(e) => updateIngredient(idx, "allergen", e.target.value || undefined)}
                        className="w-28 px-2 py-2 rounded-lg text-xs outline-none appearance-none cursor-pointer"
                        style={{ backgroundColor: T.subtle, color: ing.allergen ? (ALLERGEN_COLORS[ing.allergen] ?? T.cream) : T.muted, border: `1px solid ${T.border}` }}
                      >
                        <option value="">Brak alergenu</option>
                        {ALLERGENS_LIST.map((a) => <option key={a} value={a}>{a}</option>)}
                      </select>
                      <label className="flex items-center gap-1 cursor-pointer flex-shrink-0">
                        <input
                          type="checkbox"
                          checked={ing.alcohol ?? false}
                          onChange={(e) => updateIngredient(idx, "alcohol", e.target.checked || undefined)}
                          className="w-3.5 h-3.5 rounded accent-[#B39DDB]"
                        />
                        <span className="text-[10px]" style={{ color: T.purple }}>Alk.</span>
                      </label>
                      <button onClick={() => removeIngredient(idx)} className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white/5 flex-shrink-0">
                        <X size={12} style={{ color: T.red }} />
                      </button>
                    </div>
                  ))}
                  {editingItem.ingredients.length === 0 && (
                    <p className="text-xs text-center py-4" style={{ color: T.muted }}>Brak składników — kliknij „Dodaj" powyżej</p>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 mt-6 pt-4" style={{ borderTop: `1px solid ${T.border}` }}>
              <BtnSecondary onClick={() => setEditingItem(null)}>Anuluj</BtnSecondary>
              <BtnPrimary onClick={saveItem} disabled={!editingItem.name.trim() || editingItem.price <= 0}>
                {isNew ? "Dodaj do menu" : "Zapisz zmiany"}
              </BtnPrimary>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   SCHEDULE SECTION (admin)
══════════════════════════════════════════════════════════ */
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
const makeSchedKey = (staffId: string, date: string): ScheduleKey => `${staffId}_${date}`;

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

const ADMIN_STAFF_COLORS = ["#F6BF60", "#7AAFE8", "#60C275", "#F28B82", "#B39DDB", "#E8843A"];
const SCHED_STAFF = [
  { id: "s3", name: "Jan Kowalski", position: "Kelner/ka", avatar: "https://i.pravatar.cc/150?u=jan", color: ADMIN_STAFF_COLORS[0] },
  { id: "s4", name: "Anna Nowak", position: "Kelner/ka", avatar: "https://i.pravatar.cc/150?u=anna", color: ADMIN_STAFF_COLORS[1] },
  { id: "s5", name: "Marek Wiśniewski", position: "Barman/ka", avatar: "https://i.pravatar.cc/150?u=marek", color: ADMIN_STAFF_COLORS[2] },
  { id: "s6", name: "Ewa Kamińska", position: "Kelner/ka", avatar: "https://i.pravatar.cc/150?u=ewa", color: ADMIN_STAFF_COLORS[3] },
  { id: "s7", name: "Tomasz Zieliński", position: "Sommelier", avatar: "https://i.pravatar.cc/150?u=tomasz", color: ADMIN_STAFF_COLORS[4] },
  { id: "s2", name: "Magdalena Dąbrowska", position: "Menedżer", avatar: "https://i.pravatar.cc/128?img=25", color: ADMIN_STAFF_COLORS[5] },
];

function generateAdminSchedule(): Record<ScheduleKey, ShiftType> {
  const result: Record<ScheduleKey, ShiftType> = {};
  const shifts: ShiftType[] = ["morning", "evening", "full", "off"];
  for (const staff of SCHED_STAFF) {
    for (let w = -1; w <= 1; w++) {
      const days = getWeekDays(w);
      for (const day of days) {
        const r = Math.random();
        result[makeSchedKey(staff.id, day.date)] = r < 0.3 ? "morning" : r < 0.6 ? "evening" : r < 0.8 ? "full" : "off";
      }
    }
  }
  return result;
}

function AdminScheduleSection() {
  const [weekOffset, setWeekOffset] = useState(0);
  const [schedule, setSchedule] = useState<Record<ScheduleKey, ShiftType>>(generateAdminSchedule);
  const [editCell, setEditCell] = useState<{ staffId: string; date: string } | null>(null);

  const days = useMemo(() => getWeekDays(weekOffset), [weekOffset]);
  const isCurrentWeek = weekOffset === 0;

  const weekLabel = useMemo(() => {
    if (days.length === 0) return "";
    const s = new Date(days[0].date);
    const e = new Date(days[6].date);
    return `${s.getDate()} ${s.toLocaleDateString("pl-PL", { month: "short" })} – ${e.getDate()} ${e.toLocaleDateString("pl-PL", { month: "short", year: "numeric" })}`;
  }, [days]);

  const setShift = (staffId: string, date: string, shift: ShiftType) => {
    setSchedule((prev) => ({ ...prev, [makeSchedKey(staffId, date)]: shift }));
    setEditCell(null);
  };

  const daySummary = (date: string) => {
    let morning = 0, evening = 0;
    for (const s of SCHED_STAFF) {
      const sh = schedule[makeSchedKey(s.id, date)];
      if (sh === "morning") morning++;
      else if (sh === "evening") evening++;
      else if (sh === "full") { morning++; evening++; }
    }
    const total = SCHED_STAFF.filter((s) => { const sh = schedule[makeSchedKey(s.id, date)]; return sh && sh !== "off"; }).length;
    return { morning, evening, total };
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <SectionTitle sub="Planowanie tygodniowe personelu">Grafik zmian</SectionTitle>
        <div className="flex items-center gap-2">
          <button onClick={() => setWeekOffset((w) => w - 1)} className="p-2 rounded-lg transition-colors hover:bg-white/5" style={{ border: `1px solid ${T.border}`, color: T.muted }}><ChevronLeft size={16} /></button>
          <button onClick={() => setWeekOffset(0)} className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors hover:bg-white/5"
            style={{ border: isCurrentWeek ? "1px solid rgba(182,138,58,0.4)" : `1px solid ${T.border}`, color: isCurrentWeek ? T.gold : T.text, backgroundColor: isCurrentWeek ? "rgba(182,138,58,0.08)" : "transparent" }}>Dziś</button>
          <button onClick={() => setWeekOffset((w) => w + 1)} className="p-2 rounded-lg transition-colors hover:bg-white/5" style={{ border: `1px solid ${T.border}`, color: T.muted }}><ChevronRight size={16} /></button>
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
                        <span className="text-[9px] px-1 py-px rounded" style={{ backgroundColor: "rgba(246,191,96,0.12)", color: "#F6BF60" }}>☀ {summary.morning}</span>
                        <span className="text-[9px] px-1 py-px rounded" style={{ backgroundColor: "rgba(122,175,232,0.12)", color: "#7AAFE8" }}>🌙 {summary.evening}</span>
                      </div>
                      <div className="text-[9px] mt-0.5 font-medium flex items-center justify-center gap-1" style={{ color: summary.total > 0 ? T.cream : T.muted }}><Users size={9} /> Łącznie {summary.total}</div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {SCHED_STAFF.map((staff, idx) => (
                <tr key={staff.id} style={{ borderBottom: idx < SCHED_STAFF.length - 1 ? `1px solid ${T.border}` : undefined }}>
                  <td className="px-4 py-3 sticky left-0 z-10" style={{ backgroundColor: T.card, borderRight: `1px solid ${T.border}` }}>
                    <div className="flex items-center gap-3">
                      <img src={staff.avatar} alt="" className="w-7 h-7 rounded-full object-cover flex-shrink-0" />
                      <div className="min-w-0"><p className="text-xs font-medium truncate" style={{ color: T.cream }}>{staff.name}</p><p className="text-[10px]" style={{ color: T.muted }}>{staff.position}</p></div>
                    </div>
                  </td>
                  {days.map((d) => {
                    const shift = schedule[makeSchedKey(staff.id, d.date)] ?? "off";
                    const sc = SHIFT_COLORS[shift];
                    const isEditing = editCell?.staffId === staff.id && editCell?.date === d.date;
                    return (
                      <td key={d.date} className="px-1.5 py-2 text-center relative" style={{ backgroundColor: d.isToday ? "rgba(182,138,58,0.03)" : undefined }}>
                        {isEditing ? (
                          <div className="absolute inset-0 z-20 flex items-center justify-center" style={{ backgroundColor: "rgba(14,23,20,0.95)" }}>
                            <div className="flex flex-col gap-1 p-2 rounded-lg" style={{ backgroundColor: T.card, border: `1px solid ${T.border}`, boxShadow: "0 8px 24px rgba(0,0,0,0.4)" }}>
                              {(["morning", "evening", "full", "off"] as ShiftType[]).map((st) => { const stc = SHIFT_COLORS[st]; return (<button key={st} onClick={() => setShift(staff.id, d.date, st)} className="flex items-center gap-2 px-3 py-1.5 rounded-md text-[11px] font-medium transition-colors hover:opacity-80 text-left" style={{ backgroundColor: stc.bg, color: stc.text, border: `1px solid ${stc.border}` }}><span className="w-2 h-2 rounded-full" style={{ backgroundColor: stc.text }} />{SHIFT_LABELS[st]}<span className="text-[10px] ml-auto opacity-60">{SHIFT_HOURS[st]}</span></button>); })}
                              <button onClick={() => setEditCell(null)} className="text-[10px] mt-1 text-center" style={{ color: T.muted }}>Anuluj</button>
                            </div>
                          </div>
                        ) : (
                          <button onClick={() => setEditCell({ staffId: staff.id, date: d.date })} className="w-full px-2 py-1.5 rounded-md text-[11px] font-medium transition-all hover:scale-105 hover:shadow-md" style={{ backgroundColor: sc.bg, color: sc.text, border: `1px solid ${sc.border}` }} title={`${SHIFT_LABELS[shift]} (${SHIFT_HOURS[shift]})`}>{SHIFT_LABELS[shift]}</button>
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

      <div className="flex flex-wrap items-center gap-4 mt-2 px-1">
        <span className="text-[10px] uppercase tracking-wider" style={{ color: T.muted }}>Legenda:</span>
        {(["morning", "evening", "full", "off"] as ShiftType[]).map((st) => (<div key={st} className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded" style={{ backgroundColor: SHIFT_COLORS[st].bg, border: `1px solid ${SHIFT_COLORS[st].border}` }} /><span className="text-[11px]" style={{ color: SHIFT_COLORS[st].text }}>{SHIFT_LABELS[st]}</span><span className="text-[10px]" style={{ color: T.muted }}>({SHIFT_HOURS[st]})</span></div>))}
      </div>

      <div className="rounded-xl p-4 mt-2" style={{ backgroundColor: T.panel, border: `1px solid ${T.border}` }}>
        <h3 className="text-xs uppercase tracking-wider mb-3" style={{ color: T.muted }}>Podsumowanie tygodnia</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {SCHED_STAFF.map((s) => {
            let hours = 0;
            const shiftCount = days.filter((d) => { const sh = schedule[makeSchedKey(s.id, d.date)]; if (sh === "morning" || sh === "evening") { hours += 6; return true; } if (sh === "full") { hours += 13; return true; } return false; }).length;
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

function AnalyticsSection() {
  const [tab, setTab] = useState<"overview" | "tables" | "waiters" | "dishes" | "drinks">("overview");
  const totalRevenue = REVENUE_SPLIT.reduce((s, r) => s + r.value, 0);
  const totalTableRev = TABLE_REVENUE.reduce((s, t) => s + t.revenue, 0);
  const totalSectionRev = SECTION_REVENUE.reduce((s, r) => s + r.revenue, 0);
  const totalDishRev = TOP_DISHES.reduce((s, d) => s + d.revenue, 0);
  const totalDrinkRev = TOP_DRINKS.reduce((s, d) => s + d.revenue, 0);
  const totalDishCatRev = DISH_CATEGORIES.reduce((s, c) => s + c.value, 0);
  const totalDrinkCatRev = DRINK_CATEGORIES.reduce((s, c) => s + c.value, 0);

  const sortedTables = [...TABLE_REVENUE].sort((a, b) => b.revenue - a.revenue);
  const maxTableRev = sortedTables[0]?.revenue ?? 1;

  const sortedWaiters = [...WAITER_STATS].sort((a, b) => b.revenue - a.revenue);
  const maxWaiterRev = sortedWaiters[0]?.revenue ?? 1;

  const sortedDishes = [...TOP_DISHES].sort((a, b) => b.revenue - a.revenue);
  const maxDishRev = sortedDishes[0]?.revenue ?? 1;

  const sortedDrinks = [...TOP_DRINKS].sort((a, b) => b.revenue - a.revenue);
  const maxDrinkRev = sortedDrinks[0]?.revenue ?? 1;

  const sectionColor: Record<string, string> = { Okno: T.blue, Sala: T.gold, Boks: T.purple };

  return (
    <div className="space-y-6">
      <SectionTitle sub="Wydajność, przychody, trendy i optymalizacja operacyjna">
        Analityka
      </SectionTitle>

      {/* Tab switcher */}
      <div className="flex gap-2 flex-wrap">
        {([
          { id: "overview" as const, label: "Przegląd", icon: TrendingUp },
          { id: "tables" as const, label: "Stoliki", icon: Utensils },
          { id: "waiters" as const, label: "Kelnerzy", icon: Users },
          { id: "dishes" as const, label: "Potrawy", icon: ChefHat },
          { id: "drinks" as const, label: "Drinki", icon: Wine },
        ]).map((t) => (
          <BtnSecondary key={t.id} active={tab === t.id} onClick={() => setTab(t.id)}>
            <span className="flex items-center gap-2"><t.icon size={14} /> {t.label}</span>
          </BtnSecondary>
        ))}
      </div>

      {/* ── OVERVIEW TAB ── */}
      {tab === "overview" && (
        <div className="space-y-4">
      {/* Quick KPIs */}
      <div className="flex gap-4 flex-wrap">
        <KpiCard value="1h 52min" label="Śr. czas posiłku" change={{ value: -3, label: "vs poprzedni miesiąc" }} icon={Clock} accent={T.blue} />
        <KpiCard value="87%" label="Wykorzystanie sal" change={{ value: 5, label: "vs poprzedni miesiąc" }} icon={Utensils} accent={T.green} />
        <KpiCard value="4.2%" label="Wskaźnik no-show" change={{ value: -18, label: "vs poprzedni miesiąc" }} icon={XCircle} accent={T.red} />
        <KpiCard value="260 zł" label="Śr. rachunek / os." change={{ value: 7, label: "vs Q3 2025" }} icon={DollarSign} accent={T.gold} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Best performing time slots */}
        <Card className="p-5">
          <p className="text-sm font-medium mb-1" style={{ color: T.cream }}>Wydajność okien czasowych</p>
          <p className="text-xs mb-4" style={{ color: T.muted }}>Średnia liczba nakryć per slot w bieżącym miesiącu</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={TIME_SLOT_PERFORMANCE}>
              <XAxis dataKey="slot" tick={{ fill: T.muted, fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: T.muted, fontSize: 11 }} axisLine={false} tickLine={false} width={30} />
                  <ReTooltip cursor={false} contentStyle={{ backgroundColor: T.card, border: `1px solid ${T.border}`, borderRadius: 8, color: T.cream, fontSize: 12 }} />
              <Bar dataKey="avg" name="Śr. nakryć" fill={T.gold} radius={[4, 4, 0, 0]}>
                {TIME_SLOT_PERFORMANCE.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.avg > 30 ? T.gold : entry.avg > 20 ? T.gold + "80" : T.gold + "40"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <p className="text-xs mt-2 text-center" style={{ color: T.muted }}>
            Szczyt: <strong style={{ color: T.gold }}>19:30</strong> (śr. 38 nakryć) &nbsp;·&nbsp; Dołek: <strong style={{ color: T.muted }}>21:30</strong> (śr. 10)
          </p>
        </Card>

        {/* Revenue split */}
        <Card className="p-5">
          <p className="text-sm font-medium mb-1" style={{ color: T.cream }}>Podział przychodów (6 mies.)</p>
          <p className="text-xs mb-4" style={{ color: T.muted }}>Kolacje vs wydarzenia vs bar</p>
          <div className="flex items-center gap-6">
            <ResponsiveContainer width={180} height={180}>
              <PieChart>
                    <Pie data={REVENUE_SPLIT} dataKey="value" cx="50%" cy="50%" innerRadius={50} outerRadius={80} strokeWidth={0}>
                  {REVENUE_SPLIT.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-3 flex-1">
              {REVENUE_SPLIT.map((r) => (
                <div key={r.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: r.color }} />
                    <span className="text-sm" style={{ color: T.text }}>{r.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-medium tabular-nums" style={{ color: T.cream }}>{(r.value / 1000).toFixed(0)}k zł</span>
                    <span className="text-xs ml-2 tabular-nums" style={{ color: T.muted }}>({Math.round(r.value / totalRevenue * 100)}%)</span>
                  </div>
                </div>
              ))}
              <div className="h-px" style={{ backgroundColor: T.border }} />
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium" style={{ color: T.cream }}>Łącznie</span>
                <span className="text-sm font-medium tabular-nums" style={{ color: T.gold }}>{(totalRevenue / 1000).toFixed(0)}k zł</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Optimization suggestions */}
      <Card className="p-5">
        <p className="text-sm font-medium mb-4 flex items-center gap-2" style={{ color: T.cream }}>
          <TrendingUp size={15} style={{ color: T.gold }} /> Rekomendacje optymalizacyjne
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { title: "Przesuń happy hour na 18:00–18:30", desc: "Niskie obłożenie w tym oknie — zachęta cenowa mogłaby zwiększyć rezerwacje o ~15%.", accent: T.green },
                { title: "Podnieś limit VIP z 2 do 3 stolików", desc: "VIP generuje 2.3× wyższy średni rachunek. Rozważ stolik S5 jako dodatkowy VIP.", accent: T.gold },
            { title: "E-mail przypominający 4h przed wizytą", desc: "Obecny no-show 4.2% — automatyczny SMS/email mógłby obniżyć go o połowę.", accent: T.blue },
          ].map((tip, i) => (
            <div key={i} className="p-4 rounded-lg" style={{ backgroundColor: T.subtle, border: `1px solid ${T.border}` }}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-3" style={{ backgroundColor: tip.accent + "15" }}>
                <TrendingUp size={14} style={{ color: tip.accent }} />
              </div>
              <p className="text-sm font-medium mb-1.5" style={{ color: T.cream }}>{tip.title}</p>
              <p className="text-xs leading-relaxed" style={{ color: T.muted }}>{tip.desc}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Monthly comparison */}
      <Card className="p-5">
        <p className="text-sm font-medium mb-4" style={{ color: T.cream }}>Porównanie miesięczne</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm" style={{ color: T.text }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${T.border}` }}>
                {["Metryka", "Styczeń", "Luty", "Zmiana"].map((h) => (
                  <th key={h} className="text-left py-2.5 px-4 text-xs uppercase tracking-wider font-medium" style={{ color: T.muted }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { metric: "Rezerwacje", jan: "412", feb: "468", change: +13.6 },
                { metric: "Nakrycia",   jan: "1048", feb: "1192", change: +13.7 },
                { metric: "No-shows",   jan: "22", feb: "18", change: -18.2 },
                { metric: "Przychód kolacji", jan: "158 000 zł", feb: "218 000 zł", change: +36.8 },
                { metric: "Przychód wydarzeń", jan: "25 000 zł", feb: "75 000 zł", change: +200 },
                { metric: "Śr. rachunek/os.", jan: "242 zł", feb: "260 zł", change: +6.9 },
              ].map((row) => (
                <tr key={row.metric} className="hover:bg-white/[0.02]" style={{ borderBottom: `1px solid ${T.border}` }}>
                  <td className="py-2.5 px-4 font-medium" style={{ color: T.cream }}>{row.metric}</td>
                  <td className="py-2.5 px-4 tabular-nums">{row.jan}</td>
                  <td className="py-2.5 px-4 tabular-nums font-medium" style={{ color: T.cream }}>{row.feb}</td>
                  <td className="py-2.5 px-4">
                    <span className="flex items-center gap-1 text-xs" style={{ color: row.change >= 0 ? T.green : T.red }}>
                      {row.change >= 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                      {row.change >= 0 ? "+" : ""}{row.change}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
        </div>
      )}

      {/* ── TABLES TAB ── */}
      {tab === "tables" && (
        <div className="space-y-4">
          {/* Table KPIs */}
          <div className="flex gap-4 flex-wrap">
            <KpiCard value={`${(totalTableRev / 1000).toFixed(0)}k zł`} label="Przychód stolików" change={{ value: 14, label: "vs poprzedni miesiąc" }} icon={Utensils} accent={T.gold} />
            <KpiCard value={`${sortedTables[0]?.avgBill ?? 0} zł`} label="Najwyższy śr. rachunek" change={{ value: 6, label: `stolik ${[...TABLE_REVENUE].sort((a, b) => b.avgBill - a.avgBill)[0]?.table}`}} icon={Award} accent={T.green} />
            <KpiCard value={`${(totalDishRev / 1000).toFixed(0)}k zł`} label="Przychód kuchni" change={{ value: 11, label: "vs poprzedni miesiąc" }} icon={ChefHat} accent={T.blue} />
            <KpiCard value={`${(totalDrinkRev / 1000).toFixed(0)}k zł`} label="Przychód baru" change={{ value: 16, label: "vs poprzedni miesiąc" }} icon={Wine} accent={T.purple} />
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {/* Revenue per table */}
            <Card className="p-5">
              <p className="text-sm font-medium mb-1" style={{ color: T.cream }}>Przychód per stolik</p>
              <p className="text-xs mb-4" style={{ color: T.muted }}>Ranking — ostatnie 30 dni</p>
              <div className="space-y-2">
                {sortedTables.map((t, i) => (
                  <div key={t.table} className="flex items-center gap-3">
                    <span className="text-xs tabular-nums w-5 text-right" style={{ color: i < 3 ? T.gold : T.muted }}>
                      {i < 3 ? ["🥇", "🥈", "🥉"][i] : `${i + 1}.`}
                    </span>
                    <span className="text-sm w-8 font-medium" style={{ color: T.cream }}>{t.table}</span>
                    <div className="flex-1 h-5 rounded-md overflow-hidden relative" style={{ backgroundColor: T.subtle }}>
                      <div
                        className="h-full rounded-md transition-all duration-500"
                        style={{
                          width: `${(t.revenue / maxTableRev) * 100}%`,
                          backgroundColor: (sectionColor[t.section] ?? T.gold) + "50",
                          border: `1px solid ${(sectionColor[t.section] ?? T.gold)}40`,
                        }}
                      />
                      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] tabular-nums font-medium" style={{ color: T.cream }}>
                        {t.revenue.toLocaleString()} zł
                      </span>
                    </div>
                    <span className="text-[10px] w-14 text-right" style={{ color: T.muted }}>
                      {t.utilization}% obl.
                    </span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Section breakdown + trend */}
            <div className="space-y-4">
              {/* Pie */}
              <Card className="p-5">
                <p className="text-sm font-medium mb-1" style={{ color: T.cream }}>Przychód per sekcja</p>
                <p className="text-xs mb-4" style={{ color: T.muted }}>Okno vs Sala vs Boksy</p>
                <div className="flex items-center gap-6">
                  <ResponsiveContainer width={160} height={160}>
                    <PieChart>
                      <Pie data={SECTION_REVENUE} dataKey="revenue" cx="50%" cy="50%" innerRadius={45} outerRadius={72} strokeWidth={0}>
                        {SECTION_REVENUE.map((entry, index) => (
                          <Cell key={index} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-3 flex-1">
                    {SECTION_REVENUE.map((r) => (
                      <div key={r.section} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: r.color }} />
                          <span className="text-sm" style={{ color: T.text }}>{r.section}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-medium tabular-nums" style={{ color: T.cream }}>{(r.revenue / 1000).toFixed(0)}k zł</span>
                          <span className="text-xs ml-2 tabular-nums" style={{ color: T.muted }}>({Math.round(r.revenue / totalSectionRev * 100)}%)</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>

              {/* Trend */}
              <Card className="p-5">
                <p className="text-sm font-medium mb-1" style={{ color: T.cream }}>Trend przychodów per sekcja</p>
                <p className="text-xs mb-4" style={{ color: T.muted }}>Ostatnie 6 miesięcy</p>
                <ResponsiveContainer width="100%" height={180}>
                  <LineChart data={MONTHLY_TABLE_TREND}>
                    <XAxis dataKey="month" tick={{ fill: T.muted, fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: T.muted, fontSize: 11 }} axisLine={false} tickLine={false} width={35} tickFormatter={(v) => `${v / 1000}k`} />
                    <ReTooltip cursor={false} contentStyle={{ backgroundColor: T.card, border: `1px solid ${T.border}`, borderRadius: 8, color: T.cream, fontSize: 12 }} formatter={(v: number) => [`${v.toLocaleString()} zł`, ""]} />
                    <Line type="monotone" dataKey="Okno" stroke={T.blue} strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="Sala" stroke={T.gold} strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="Boks" stroke={T.purple} strokeWidth={2} dot={false} />
                    <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, color: T.muted }} />
                  </LineChart>
                </ResponsiveContainer>
              </Card>
            </div>
          </div>

          {/* Detailed table */}
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full text-sm" style={{ color: T.text }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${T.border}` }}>
                    {["Stolik", "Sekcja", "Przychód", "Nakryć", "Śr. rachunek", "Obłożenie", "Top danie", ""].map((h) => (
                      <th key={h} className="text-left py-3 px-4 text-xs uppercase tracking-wider font-medium" style={{ color: T.muted }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sortedTables.map((t, i) => (
                    <tr key={t.table} className="transition-colors hover:bg-white/[0.02]" style={{ borderBottom: `1px solid ${T.border}` }}>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          {i < 3 && <Crown size={12} style={{ color: T.gold }} />}
                          <span className="font-medium" style={{ color: T.cream }}>{t.table}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: (sectionColor[t.section] ?? T.gold) + "15", color: sectionColor[t.section] ?? T.gold }}>{t.section}</span>
                      </td>
                      <td className="py-3 px-4 tabular-nums font-medium" style={{ color: T.cream }}>{t.revenue.toLocaleString()} zł</td>
                      <td className="py-3 px-4 tabular-nums">{t.covers}</td>
                      <td className="py-3 px-4 tabular-nums" style={{ color: t.avgBill >= 260 ? T.green : T.text }}>{t.avgBill} zł</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: T.subtle }}>
                            <div className="h-full rounded-full" style={{ width: `${t.utilization}%`, backgroundColor: t.utilization >= 85 ? T.green : t.utilization >= 60 ? T.amber : T.red }} />
                          </div>
                          <span className="text-xs tabular-nums">{t.utilization}%</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-xs">{t.topDish}</td>
                      <td className="py-3 px-4">
                        <button className="p-1.5 rounded-md hover:bg-white/5 transition-colors" style={{ color: T.muted }}><Eye size={14} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* ── WAITERS TAB ── */}
      {tab === "waiters" && (
        <div className="space-y-4">
          {/* Waiter KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {sortedWaiters.map((w, i) => (
              <Card key={w.id} className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold" style={{ backgroundColor: i === 0 ? "rgba(182,138,58,0.15)" : T.subtle, color: i === 0 ? T.gold : T.text, border: `1px solid ${i === 0 ? T.gold + "30" : T.border}` }}>
                    {w.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  {i === 0 && <Medal size={18} style={{ color: T.gold }} />}
                </div>
                <p className="text-sm font-medium mb-0.5" style={{ color: T.cream }}>{w.name}</p>
                <p className="text-xs mb-3" style={{ color: T.muted }}>{w.shifts} zmian · {w.covers} nakryć</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span style={{ color: T.muted }}>Przychód</span>
                    <span className="tabular-nums font-medium" style={{ color: T.gold }}>{w.revenue.toLocaleString()} zł</span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: T.subtle }}>
                    <div className="h-full rounded-full" style={{ width: `${(w.revenue / maxWaiterRev) * 100}%`, backgroundColor: T.gold + "80" }} />
                  </div>
                  <div className="flex justify-between text-xs">
                    <span style={{ color: T.muted }}>Śr. rachunek</span>
                    <span className="tabular-nums" style={{ color: T.cream }}>{w.avgBill} zł</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span style={{ color: T.muted }}>Napiwki</span>
                    <span className="tabular-nums" style={{ color: T.green }}>{w.tips.toLocaleString()} zł</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span style={{ color: T.muted }}>Upsell rate</span>
                    <span className="tabular-nums" style={{ color: w.upsellRate >= 30 ? T.green : T.amber }}>{w.upsellRate}%</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span style={{ color: T.muted }}>Ocena</span>
                    <span className="tabular-nums flex items-center gap-1" style={{ color: T.gold }}>
                      <Star size={10} style={{ fill: T.gold }} /> {w.rating}
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Waiter comparison chart */}
          <Card className="p-5">
            <p className="text-sm font-medium mb-1" style={{ color: T.cream }}>Porównanie kelnerów</p>
            <p className="text-xs mb-4" style={{ color: T.muted }}>Przychód i napiwki — ostatnie 30 dni</p>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={sortedWaiters} barGap={4}>
                <XAxis dataKey="name" tick={{ fill: T.muted, fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => v.split(" ")[0]} />
                <YAxis tick={{ fill: T.muted, fontSize: 11 }} axisLine={false} tickLine={false} width={40} tickFormatter={(v) => `${v / 1000}k`} />
                <ReTooltip cursor={false} contentStyle={{ backgroundColor: T.card, border: `1px solid ${T.border}`, borderRadius: 8, color: T.cream, fontSize: 12 }} formatter={(v: number) => [`${v.toLocaleString()} zł`, ""]} />
                <Bar dataKey="revenue" name="Przychód" fill={T.gold} radius={[4, 4, 0, 0]} />
                <Bar dataKey="tips" name="Napiwki" fill={T.green} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Full table */}
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full text-sm" style={{ color: T.text }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${T.border}` }}>
                    {["Kelner", "Przychód", "Nakryć", "Śr. rachunek", "Napiwki", "Upsell", "Ocena", "Top sprzedaż"].map((h) => (
                      <th key={h} className="text-left py-3 px-4 text-xs uppercase tracking-wider font-medium" style={{ color: T.muted }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sortedWaiters.map((w, i) => (
                    <tr key={w.id} className="transition-colors hover:bg-white/[0.02]" style={{ borderBottom: `1px solid ${T.border}` }}>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-medium" style={{ backgroundColor: i === 0 ? "rgba(182,138,58,0.15)" : T.subtle, color: i === 0 ? T.gold : T.muted }}>
                            {w.name.split(" ").map((n) => n[0]).join("")}
                          </div>
                          <span className="font-medium" style={{ color: T.cream }}>{w.name}</span>
                          {i === 0 && <span className="text-[9px] px-1.5 py-0.5 rounded font-bold tracking-wider" style={{ backgroundColor: "rgba(182,138,58,0.15)", color: T.gold }}>TOP</span>}
                        </div>
                      </td>
                      <td className="py-3 px-4 tabular-nums font-medium" style={{ color: T.cream }}>{w.revenue.toLocaleString()} zł</td>
                      <td className="py-3 px-4 tabular-nums">{w.covers}</td>
                      <td className="py-3 px-4 tabular-nums">{w.avgBill} zł</td>
                      <td className="py-3 px-4 tabular-nums" style={{ color: T.green }}>{w.tips.toLocaleString()} zł</td>
                      <td className="py-3 px-4">
                        <span className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: w.upsellRate >= 30 ? "rgba(96,194,117,0.1)" : "rgba(246,191,96,0.1)", color: w.upsellRate >= 30 ? T.green : T.amber }}>{w.upsellRate}%</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="flex items-center gap-1 text-xs" style={{ color: T.gold }}><Star size={10} style={{ fill: T.gold }} /> {w.rating}</span>
                      </td>
                      <td className="py-3 px-4 text-xs">{w.topSell}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* ── DISHES TAB ── */}
      {tab === "dishes" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {/* Top dishes ranking */}
            <Card className="p-5">
              <p className="text-sm font-medium mb-1" style={{ color: T.cream }}>Top 10 potraw wg przychodu</p>
              <p className="text-xs mb-4" style={{ color: T.muted }}>Ostatnie 30 dni</p>
              <div className="space-y-2.5">
                {sortedDishes.slice(0, 10).map((d, i) => (
                  <div key={d.name} className="group">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-xs tabular-nums w-5 text-right font-medium" style={{ color: i < 3 ? T.gold : T.muted }}>
                        {i < 3 ? ["🥇", "🥈", "🥉"][i] : `${i + 1}.`}
                      </span>
                      <span className="text-sm flex-1 truncate" style={{ color: T.cream }}>{d.name}</span>
                      <span className="text-xs flex items-center gap-1" style={{ color: d.trend >= 0 ? T.green : T.red }}>
                        {d.trend >= 0 ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}{Math.abs(d.trend)}%
                      </span>
                    </div>
                    <div className="flex items-center gap-3 ml-8">
                      <div className="flex-1 h-3.5 rounded overflow-hidden relative" style={{ backgroundColor: T.subtle }}>
                        <div className="h-full rounded transition-all duration-500" style={{ width: `${(d.revenue / maxDishRev) * 100}%`, backgroundColor: T.gold + "40" }} />
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[9px] tabular-nums font-medium" style={{ color: T.cream }}>{d.revenue.toLocaleString()} zł</span>
                      </div>
                      <span className="text-[10px] tabular-nums w-16 text-right" style={{ color: T.muted }}>{d.orders} zamów.</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Category pie + margin leaders */}
            <div className="space-y-4">
              <Card className="p-5">
                <p className="text-sm font-medium mb-1" style={{ color: T.cream }}>Przychód wg kategorii</p>
                <p className="text-xs mb-4" style={{ color: T.muted }}>Podział potraw na kategorie</p>
                <div className="flex items-center gap-6">
                  <ResponsiveContainer width={160} height={160}>
                    <PieChart>
                      <Pie data={DISH_CATEGORIES} dataKey="value" cx="50%" cy="50%" innerRadius={45} outerRadius={72} strokeWidth={0}>
                        {DISH_CATEGORIES.map((entry, index) => (
                          <Cell key={index} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-3 flex-1">
                    {DISH_CATEGORIES.map((c) => (
                      <div key={c.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: c.color }} />
                          <span className="text-sm" style={{ color: T.text }}>{c.name}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-medium tabular-nums" style={{ color: T.cream }}>{(c.value / 1000).toFixed(0)}k zł</span>
                          <span className="text-xs ml-2 tabular-nums" style={{ color: T.muted }}>({Math.round(c.value / totalDishCatRev * 100)}%)</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>

              {/* High-margin dishes */}
              <Card className="p-5">
                <p className="text-sm font-medium mb-1 flex items-center gap-2" style={{ color: T.cream }}>
                  <Flame size={14} style={{ color: T.red }} /> Najwyższa marża
                </p>
                <p className="text-xs mb-4" style={{ color: T.muted }}>Potrawy z najwyższym % zysku</p>
                <div className="space-y-2">
                  {[...TOP_DISHES].sort((a, b) => b.margin - a.margin).slice(0, 5).map((d) => (
                    <div key={d.name} className="flex items-center justify-between py-2 px-3 rounded-lg" style={{ backgroundColor: T.subtle }}>
                      <div className="min-w-0 flex-1">
                        <span className="text-sm block truncate" style={{ color: T.cream }}>{d.name}</span>
                        <span className="text-xs" style={{ color: T.muted }}>{d.category} · {d.avgPrice} zł</span>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0 ml-3">
                        <div className="text-right">
                          <span className="text-sm font-medium tabular-nums block" style={{ color: T.green }}>{d.margin}%</span>
                          <span className="text-[10px] tabular-nums" style={{ color: T.muted }}>marża</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>

          {/* Dishes full table */}
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full text-sm" style={{ color: T.text }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${T.border}` }}>
                    {["Potrawa", "Kategoria", "Zamówienia", "Przychód", "Śr. cena", "Marża", "Trend"].map((h) => (
                      <th key={h} className="text-left py-3 px-4 text-xs uppercase tracking-wider font-medium" style={{ color: T.muted }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sortedDishes.map((d, i) => (
                    <tr key={d.name} className="transition-colors hover:bg-white/[0.02]" style={{ borderBottom: `1px solid ${T.border}` }}>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          {i < 3 && <Flame size={12} style={{ color: T.gold }} />}
                          <span className="font-medium truncate max-w-[200px]" style={{ color: T.cream }}>{d.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-xs">{d.category}</td>
                      <td className="py-3 px-4 tabular-nums">{d.orders}</td>
                      <td className="py-3 px-4 tabular-nums font-medium" style={{ color: T.cream }}>{d.revenue.toLocaleString()} zł</td>
                      <td className="py-3 px-4 tabular-nums">{d.avgPrice} zł</td>
                      <td className="py-3 px-4">
                        <span className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: d.margin >= 65 ? "rgba(96,194,117,0.1)" : "rgba(246,191,96,0.1)", color: d.margin >= 65 ? T.green : T.amber }}>{d.margin}%</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="flex items-center gap-1 text-xs" style={{ color: d.trend >= 0 ? T.green : T.red }}>
                          {d.trend >= 0 ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}{Math.abs(d.trend)}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* ── DRINKS TAB ── */}
      {tab === "drinks" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {/* Top drinks ranking */}
            <Card className="p-5">
              <p className="text-sm font-medium mb-1" style={{ color: T.cream }}>Top 10 drinków wg przychodu</p>
              <p className="text-xs mb-4" style={{ color: T.muted }}>Ostatnie 30 dni</p>
              <div className="space-y-2.5">
                {sortedDrinks.slice(0, 10).map((d, i) => (
                  <div key={d.name} className="group">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-xs tabular-nums w-5 text-right font-medium" style={{ color: i < 3 ? T.purple : T.muted }}>
                        {i < 3 ? ["🥇", "🥈", "🥉"][i] : `${i + 1}.`}
                      </span>
                      <span className="text-sm flex-1 truncate" style={{ color: T.cream }}>{d.name}</span>
                      <span className="text-xs flex items-center gap-1" style={{ color: d.trend >= 0 ? T.green : T.red }}>
                        {d.trend >= 0 ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}{Math.abs(d.trend)}%
                      </span>
                    </div>
                    <div className="flex items-center gap-3 ml-8">
                      <div className="flex-1 h-3.5 rounded overflow-hidden relative" style={{ backgroundColor: T.subtle }}>
                        <div className="h-full rounded transition-all duration-500" style={{ width: `${(d.revenue / maxDrinkRev) * 100}%`, backgroundColor: T.purple + "40" }} />
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[9px] tabular-nums font-medium" style={{ color: T.cream }}>{d.revenue.toLocaleString()} zł</span>
                      </div>
                      <span className="text-[10px] tabular-nums w-16 text-right" style={{ color: T.muted }}>{d.orders} zamów.</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Category breakdown + margin leaders */}
            <div className="space-y-4">
              <Card className="p-5">
                <p className="text-sm font-medium mb-1" style={{ color: T.cream }}>Przychód wg kategorii napojów</p>
                <p className="text-xs mb-4" style={{ color: T.muted }}>Wina, koktajle, szampany i inne</p>
                <div className="flex items-center gap-6">
                  <ResponsiveContainer width={160} height={160}>
                    <PieChart>
                      <Pie data={DRINK_CATEGORIES} dataKey="value" cx="50%" cy="50%" innerRadius={45} outerRadius={72} strokeWidth={0}>
                        {DRINK_CATEGORIES.map((entry, index) => (
                          <Cell key={index} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-2.5 flex-1">
                    {DRINK_CATEGORIES.map((c) => (
                      <div key={c.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: c.color }} />
                          <span className="text-sm" style={{ color: T.text }}>{c.name}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-medium tabular-nums" style={{ color: T.cream }}>{(c.value / 1000).toFixed(0)}k zł</span>
                          <span className="text-xs ml-2 tabular-nums" style={{ color: T.muted }}>({Math.round(c.value / totalDrinkCatRev * 100)}%)</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>

              {/* High-margin drinks */}
              <Card className="p-5">
                <p className="text-sm font-medium mb-1 flex items-center gap-2" style={{ color: T.cream }}>
                  <Flame size={14} style={{ color: T.red }} /> Najwyższa marża
                </p>
                <p className="text-xs mb-4" style={{ color: T.muted }}>Napoje z najwyższym % zysku</p>
                <div className="space-y-2">
                  {[...TOP_DRINKS].sort((a, b) => b.margin - a.margin).slice(0, 5).map((d) => (
                    <div key={d.name} className="flex items-center justify-between py-2 px-3 rounded-lg" style={{ backgroundColor: T.subtle }}>
                      <div className="min-w-0 flex-1">
                        <span className="text-sm block truncate" style={{ color: T.cream }}>{d.name}</span>
                        <span className="text-xs" style={{ color: T.muted }}>{d.category} · {d.avgPrice} zł</span>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0 ml-3">
                        <div className="text-right">
                          <span className="text-sm font-medium tabular-nums block" style={{ color: T.green }}>{d.margin}%</span>
                          <span className="text-[10px] tabular-nums" style={{ color: T.muted }}>marża</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>

          {/* Drinks full table */}
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full text-sm" style={{ color: T.text }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${T.border}` }}>
                    {["Napój", "Kategoria", "Zamówienia", "Przychód", "Śr. cena", "Marża", "Trend"].map((h) => (
                      <th key={h} className="text-left py-3 px-4 text-xs uppercase tracking-wider font-medium" style={{ color: T.muted }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sortedDrinks.map((d, i) => (
                    <tr key={d.name} className="transition-colors hover:bg-white/[0.02]" style={{ borderBottom: `1px solid ${T.border}` }}>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          {i < 3 && <Wine size={12} style={{ color: T.purple }} />}
                          <span className="font-medium truncate max-w-[200px]" style={{ color: T.cream }}>{d.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-xs">{d.category}</td>
                      <td className="py-3 px-4 tabular-nums">{d.orders}</td>
                      <td className="py-3 px-4 tabular-nums font-medium" style={{ color: T.cream }}>{d.revenue.toLocaleString()} zł</td>
                      <td className="py-3 px-4 tabular-nums">{d.avgPrice} zł</td>
                      <td className="py-3 px-4">
                        <span className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: d.margin >= 65 ? "rgba(96,194,117,0.1)" : "rgba(246,191,96,0.1)", color: d.margin >= 65 ? T.green : T.amber }}>{d.margin}%</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="flex items-center gap-1 text-xs" style={{ color: d.trend >= 0 ? T.green : T.red }}>
                          {d.trend >= 0 ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}{Math.abs(d.trend)}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   MAIN LAYOUT
══════════════════════════════════════════════════════════ */
export function AdminDashboardPage() {
  const nav = useNavigate();
  const [section, setSection] = useState<Section>("overview");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const renderSection = () => {
    switch (section) {
      case "overview":     return <OverviewSection />;
      case "reservations": return <ReservationsSection />;
      case "events":       return <EventsSection />;
      case "tables":       return <TablesSection />;
      case "menu":         return <MenuEditorSection />;
      case "schedule":     return <AdminScheduleSection />;
      case "policy":       return <PolicySection />;
      case "staff":        return <StaffSection />;
      case "analytics":    return <AnalyticsSection />;
    }
  };

  const sidebarNav = (mobile?: boolean) => (
    <nav className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto">
      {NAV_ITEMS.map((item) => {
        const active = section === item.id;
        const Icon = item.icon;
        return (
          <button
            key={item.id}
            onClick={() => { setSection(item.id); if (mobile) setMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 rounded-lg transition-all duration-150 ${!mobile && sidebarCollapsed ? "justify-center px-2 py-3" : "px-3 py-2.5"}`}
            style={{
              backgroundColor: active ? "rgba(182,138,58,0.12)" : "transparent",
              color: active ? T.gold : T.text,
              border: active ? "1px solid rgba(182,138,58,0.2)" : "1px solid transparent",
            }}
            title={!mobile && sidebarCollapsed ? item.label : undefined}
          >
            <Icon size={18} style={{ color: active ? T.gold : T.muted, flexShrink: 0 }} />
            {(mobile || !sidebarCollapsed) && <span className="text-sm font-medium truncate">{item.label}</span>}
          </button>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: T.dark, fontFamily: T.sans }}>

      {/* ─── MOBILE SIDEBAR OVERLAY ─── */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileMenuOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-64 flex flex-col" style={{ backgroundColor: T.card, borderRight: `1px solid ${T.border}` }}>
            <div className="flex items-center justify-between px-4 h-16 flex-shrink-0" style={{ borderBottom: `1px solid ${T.border}` }}>
              <div className="flex items-center gap-3">
                <div className="w-2 h-7 rounded-full flex-shrink-0" style={{ backgroundColor: T.gold }} />
                <div className="min-w-0">
                  <p className="text-sm font-light tracking-wider truncate" style={{ color: T.cream, fontFamily: T.serif, fontSize: "1rem" }}>La Maison Dorée</p>
                  <p className="text-[10px] uppercase tracking-widest" style={{ color: T.muted }}>Panel Admin</p>
                </div>
              </div>
              <button onClick={() => setMobileMenuOpen(false)} className="p-1.5 rounded-lg hover:bg-white/5"><X size={18} style={{ color: T.muted }} /></button>
            </div>
            {sidebarNav(true)}
          </aside>
        </div>
      )}

      {/* ─── DESKTOP SIDEBAR ─── */}
      <aside
        className="hidden md:flex flex-col flex-shrink-0 h-screen sticky top-0 transition-all duration-300"
        style={{
          width: sidebarCollapsed ? 64 : 220,
          backgroundColor: T.card,
          borderRight: `1px solid ${T.border}`,
        }}
      >
        <div className="flex items-center gap-3 px-4 h-16 flex-shrink-0" style={{ borderBottom: `1px solid ${T.border}` }}>
          <div className="w-2 h-7 rounded-full flex-shrink-0" style={{ backgroundColor: T.gold }} />
          {!sidebarCollapsed && (
            <div className="min-w-0">
              <p className="text-sm font-light tracking-wider truncate" style={{ color: T.cream, fontFamily: T.serif, fontSize: "1rem" }}>La Maison Dorée</p>
              <p className="text-[10px] uppercase tracking-widest" style={{ color: T.muted }}>Panel Admin</p>
            </div>
          )}
        </div>
        {sidebarNav()}
        <div className="px-2 py-3 flex-shrink-0" style={{ borderTop: `1px solid ${T.border}` }}>
          <button
            onClick={() => setSidebarCollapsed((v) => !v)}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-lg transition-colors hover:bg-white/5"
            style={{ color: T.muted }}
          >
            {sidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            {!sidebarCollapsed && <span className="text-xs">Zwiń</span>}
          </button>
        </div>
      </aside>

      {/* ─── MAIN CONTENT ─── */}
      <main className="flex-1 min-w-0 overflow-y-auto">
        <header
          className="sticky top-0 z-20 flex items-center justify-between px-4 md:px-6 lg:px-8 h-14 md:h-16"
          style={{ backgroundColor: T.dark + "F0", borderBottom: `1px solid ${T.border}`, backdropFilter: "blur(12px)" }}
        >
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
              return auth.name ? (
                <span className="text-xs hidden md:block" style={{ color: T.muted }}>{auth.name}</span>
              ) : null;
            })()}
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: "rgba(182,138,58,0.12)", border: "1px solid rgba(182,138,58,0.25)" }}>
              <UserCheck size={14} style={{ color: T.gold }} />
            </div>
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

        <div className="px-4 md:px-6 lg:px-8 py-4 md:py-6">
          {renderSection()}
        </div>
      </main>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        select option { background-color: #182522; color: #F3EFEA; }
      `}</style>
    </div>
  );
}
