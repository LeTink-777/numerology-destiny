export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://numerology-destiny.vercel.app";

export const OWNER = {
  fullName: "Евдокимов Даниил Владимирович",
  inn: "381928138362",
  status: "Плательщик налога на профессиональный доход (самозанятый)",
  email: "danyavdkmvv3@gmail.com",
  telegram: "@dvdkmv",
};

export const STORAGE_KEYS = {
  data: "numerology_data",
  timerStart: "num_timer_start",
  spots: "num_spots",
} as const;

export type PlanId = "basic" | "full" | "premium" | "upsell";

export const PLANS: Record<
  PlanId,
  { id: PlanId; title: string; price: number; oldPrice: number; hours: number }
> = {
  basic: { id: "basic", title: "Базовый расчёт", price: 290, oldPrice: 890, hours: 24 },
  full: { id: "full", title: "Полный портрет", price: 590, oldPrice: 2790, hours: 12 },
  premium: {
    id: "premium",
    title: "Портрет + Консультация",
    price: 1190,
    oldPrice: 4900,
    hours: 6,
  },
  upsell: {
    id: "upsell",
    title: "Аудио разбор (дополнение)",
    price: 490,
    oldPrice: 1490,
    hours: 24,
  },
};

export function isPlanId(value: unknown): value is PlanId {
  return typeof value === "string" && value in PLANS;
}

/** Разряды разделяются неразрывным пробелом: 2 790, 23 847. */
export function formatPrice(value: number): string {
  return String(value).replace(/\B(?=(\d{3})+(?!\d))/g, "\u00a0");
}
