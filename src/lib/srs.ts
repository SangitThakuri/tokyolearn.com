export interface SRSItem {
  id: string;
  type: "vocab" | "kanji" | "grammar";
  front: string;
  back: string;
  level: string;
  nextReview: number;
  interval: number;
  ease: number;
  repetitions: number;
}

const STORAGE_KEY = "tokyolearn-srs";

export function getSRSData(): SRSItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as SRSItem[]) : [];
  } catch {
    return [];
  }
}

export function saveSRSData(items: SRSItem[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function getDueItems(): SRSItem[] {
  const now = Date.now();
  return getSRSData().filter((item) => item.nextReview <= now);
}

export function addItemToSRS(item: SRSItem): void {
  const items = getSRSData();
  const existing = items.findIndex((i) => i.id === item.id);
  if (existing !== -1) {
    items[existing] = item;
  } else {
    items.push(item);
  }
  saveSRSData(items);
}

export function updateItemQuality(id: string, quality: number): SRSItem | null {
  const items = getSRSData();
  const index = items.findIndex((i) => i.id === id);
  if (index === -1) return null;
  items[index] = calculateNextReview(quality, items[index]);
  saveSRSData(items);
  updateStreak();
  return items[index];
}

function clampEase(ease: number): number {
  return Math.max(1.3, ease);
}

const STREAK_KEY = "tokyolearn-srs-streak";
const LAST_REVIEW_KEY = "tokyolearn-srs-last-review";

export function getCurrentStreak(): number {
  if (typeof window === "undefined") return 0;
  try {
    const raw = localStorage.getItem(STREAK_KEY);
    return raw ? Number(raw) : 0;
  } catch {
    return 0;
  }
}

export function cardsReviewedToday(): number {
  if (typeof window === "undefined") return 0;
  try {
    const lastRaw = localStorage.getItem(LAST_REVIEW_KEY);
    if (!lastRaw) return 0;
    const today = new Date().toDateString();
    const lastDate = new Date(lastRaw).toDateString();
    if (today !== lastDate) return 0;
    return getSRSData().filter((c) => c.nextReview > Date.now()).length;
  } catch {
    return 0;
  }
}

function updateStreak(): void {
  if (typeof window === "undefined") return;
  const today = new Date().toDateString();
  const lastRaw = localStorage.getItem(LAST_REVIEW_KEY);
  let streak = getCurrentStreak();
  if (!lastRaw) {
    streak = 1;
  } else {
    const lastDate = new Date(lastRaw).toDateString();
    const diff =
      (new Date(today).getTime() - new Date(lastDate).getTime()) /
      (1000 * 60 * 60 * 24);
    if (diff === 1) {
      streak += 1;
    } else if (diff > 1) {
      streak = 1;
    }
  }
  localStorage.setItem(STREAK_KEY, String(streak));
  localStorage.setItem(LAST_REVIEW_KEY, today);
}

export function calculateNextReview(quality: number, item: SRSItem): SRSItem {
  const now = Date.now();
  let { interval, ease, repetitions } = item;

  if (quality < 3) {
    repetitions = 0;
    interval = 1;
    ease = clampEase(ease - 0.2);
  } else {
    ease = clampEase(ease + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)));
    if (repetitions === 0) {
      interval = 1;
    } else if (repetitions === 1) {
      interval = 6;
    } else {
      interval = Math.round(interval * ease);
    }
    repetitions += 1;
  }

  return {
    ...item,
    interval,
    ease,
    repetitions,
    nextReview: now + interval * 24 * 60 * 60 * 1000,
  };
}
