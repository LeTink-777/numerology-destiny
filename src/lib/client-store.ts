"use client";

import { useSyncExternalStore } from "react";

const noopSubscribe = () => () => {};

/**
 * Читает значение из браузерного хранилища без рассинхрона при гидратации.
 * getSnapshot обязан возвращать стабильную ссылку между вызовами.
 */
export function useClientSnapshot<T>(getSnapshot: () => T | null): T | null {
  return useSyncExternalStore(
    noopSubscribe,
    getSnapshot,
    () => null
  );
}

function subscribeToSecond(onChange: () => void) {
  const id = setInterval(onChange, 1000);
  return () => clearInterval(id);
}

function nowInSeconds(): number {
  return Math.floor(Date.now() / 1000);
}

/** Текущее время в секундах; 0 до окончания гидратации. */
export function useNowSeconds(): number {
  return useSyncExternalStore(subscribeToSecond, nowInSeconds, () => 0);
}
