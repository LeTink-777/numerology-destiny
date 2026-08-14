import { Suspense } from "react";
import type { Metadata } from "next";
import ThankYouView from "@/components/ThankYouView";

export const metadata: Metadata = {
  title: "Заказ принят",
  robots: { index: false, follow: false },
};

export default function ThankYouPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-cream">
          <p className="text-[14px] text-muted">Загружаем…</p>
        </main>
      }
    >
      <ThankYouView />
    </Suspense>
  );
}
