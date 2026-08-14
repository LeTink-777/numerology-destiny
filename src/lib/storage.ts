import { STORAGE_KEYS } from "./site";

export type NumerologyData = {
  name: string;
  birthDate: string;
  email: string;
};

export function saveNumerologyData(data: NumerologyData): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEYS.data, JSON.stringify(data));
    dataCache = { raw: JSON.stringify(data), value: data };
  } catch {
    /* localStorage может быть недоступен — расчёт от этого не ломается */
  }
}

function parseData(raw: string | null): NumerologyData | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<NumerologyData>;
    if (!parsed?.name || !parsed?.birthDate) return null;
    return {
      name: String(parsed.name),
      birthDate: String(parsed.birthDate),
      email: String(parsed.email ?? ""),
    };
  } catch {
    return null;
  }
}

export function readNumerologyData(): NumerologyData | null {
  if (typeof window === "undefined") return null;
  try {
    return parseData(window.localStorage.getItem(STORAGE_KEYS.data));
  } catch {
    return null;
  }
}

/**
 * Кэш нужен, чтобы useSyncExternalStore получал стабильную ссылку
 * и не уходил в бесконечный цикл перерисовок.
 */
let dataCache: { raw: string | null; value: NumerologyData | null } = {
  raw: null,
  value: null,
};

export function getNumerologyDataSnapshot(): NumerologyData | null {
  if (typeof window === "undefined") return null;

  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(STORAGE_KEYS.data);
  } catch {
    return null;
  }

  if (raw !== dataCache.raw) {
    dataCache = { raw, value: parseData(raw) };
  }

  return dataCache.value;
}

const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;

let deadlineCache: number | null = null;

/** Возвращает момент окончания 24-часового таймера, фиксируя старт в localStorage. */
export function getTimerDeadline(): number | null {
  if (typeof window === "undefined") return null;
  if (deadlineCache !== null) return deadlineCache;

  const now = Date.now();

  try {
    const raw = window.localStorage.getItem(STORAGE_KEYS.timerStart);
    let start = raw ? Number(raw) : NaN;

    if (!Number.isFinite(start) || start <= 0 || now - start > TWENTY_FOUR_HOURS) {
      start = now;
      window.localStorage.setItem(STORAGE_KEYS.timerStart, String(start));
    }

    deadlineCache = start + TWENTY_FOUR_HOURS;
  } catch {
    deadlineCache = now + TWENTY_FOUR_HOURS;
  }

  return deadlineCache;
}

let spotsCache: number | null = null;

/** Счётчик оставшихся мест: инициализируется значением 2–4 и убывает до 2. */
export function getSpotsLeft(): number | null {
  if (typeof window === "undefined") return null;
  if (spotsCache !== null) return spotsCache;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEYS.spots);
    let spots = raw ? Number(raw) : NaN;

    if (!Number.isFinite(spots) || spots < 2 || spots > 4) {
      spots = 2 + Math.floor(Math.random() * 3);
    } else if (spots > 2) {
      spots -= 1;
    }

    window.localStorage.setItem(STORAGE_KEYS.spots, String(spots));
    spotsCache = spots;
  } catch {
    spotsCache = 3;
  }

  return spotsCache;
}
