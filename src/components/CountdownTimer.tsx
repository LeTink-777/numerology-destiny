"use client";

import { useClientSnapshot, useNowSeconds } from "@/lib/client-store";
import { getTimerDeadline } from "@/lib/storage";

function pad(value: number): string {
  return String(value).padStart(2, "0");
}

function format(secondsLeft: number): string {
  const total = Math.max(0, secondsLeft);
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

export default function CountdownTimer() {
  const deadline = useClientSnapshot(getTimerDeadline);
  const now = useNowSeconds();

  const label =
    deadline && now ? format(Math.floor(deadline / 1000) - now) : "—:—:—";

  return (
    <p className="text-[13px] text-slate">
      Цена вырастет через{" "}
      <span className="font-medium tabular-nums text-navy">{label}</span>
    </p>
  );
}
