export type TrialUser = {
  id: number;
  name: string;
  phone: string;
  start_date: string; // YYYY-MM-DD
  days: number;
};

const DAY = 24 * 60 * 60 * 1000;
const STORAGE_KEY = "fusix_trials";

export const toISO = (d: Date) => {
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
};

const parseLocal = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, (m || 1) - 1, d || 1);
};

export const getEndDate = (t: TrialUser) => {
  const s = parseLocal(t.start_date);
  return new Date(s.getFullYear(), s.getMonth(), s.getDate() + t.days);
};

export const getDaysLeft = (t: TrialUser) => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((getEndDate(t).getTime() - today.getTime()) / DAY);
};

export const formatDate = (d: Date) =>
  d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });

export const formatISODate = (iso: string) => formatDate(parseLocal(iso));

const daysAgo = (n: number) => {
  const d = new Date();
  return toISO(new Date(d.getFullYear(), d.getMonth(), d.getDate() - n));
};

const DEFAULT_TRIALS: TrialUser[] = [
  { id: 1, name: "Ahmed Khan", phone: "0300-1234567", start_date: daysAgo(2), days: 3 },
  { id: 2, name: "Sara Traders", phone: "0301-2345678", start_date: daysAgo(1), days: 7 },
  { id: 3, name: "Kamran Mart", phone: "0302-3456789", start_date: daysAgo(3), days: 3 },
  { id: 4, name: "Hina Store", phone: "0303-4567890", start_date: daysAgo(5), days: 14 },
  { id: 5, name: "Faisal Autos", phone: "0304-5678901", start_date: daysAgo(6), days: 7 },
];

export const loadTrials = (): TrialUser[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as TrialUser[];
  } catch {
    /* ignore */
  }
  return DEFAULT_TRIALS;
};

export const saveTrials = (list: TrialUser[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {
    /* ignore */
  }
};

export const waLink = (phone: string, text: string) => {
  let digits = phone.replace(/\D/g, "");
  if (digits.startsWith("0")) digits = "92" + digits.slice(1);
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
};