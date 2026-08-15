"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle, Download, Headphones } from "lucide-react";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import { useClientSnapshot } from "@/lib/client-store";
import { getNumerologyDataSnapshot, readPendingOrder } from "@/lib/storage";
import { isPlanId, PLANS, formatPrice } from "@/lib/site";
import { generateResultSections } from "@/lib/result-sections";

export default function ThankYouView() {
  const searchParams = useSearchParams();
  const data = useClientSnapshot(getNumerologyDataSnapshot);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [paymentId, setPaymentId] = useState<string | null>(null);
  const [storedPlan, setStoredPlan] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  useEffect(() => {
    const pending = readPendingOrder();
    if (pending) {
      setPaymentId(pending.paymentId);
      setStoredPlan(pending.plan);
    }
  }, []);

  const planParam = searchParams.get("plan");
  const planId = isPlanId(planParam) ? planParam : isPlanId(storedPlan) ? storedPlan : "full";
  const plan = PLANS[planId];
  const name = data?.name?.trim() || "Спасибо";
  const email = data?.email?.trim();

  // Тот же построитель, что использует PDF в письме — страница и вложение
  // всегда показывают одно и то же.
  const sections = useMemo(
    () =>
      data?.name && data?.birthDate
        ? generateResultSections({ name: data.name, birthDate: data.birthDate }, planId)
        : [],
    [data?.name, data?.birthDate, planId]
  );

  async function handleDownloadPDF() {
    if (!paymentId) {
      setDownloadError(
        "Не нашли номер платежа в этом браузере. Портрет отправлен вам на почту."
      );
      return;
    }

    setDownloading(true);
    setDownloadError(null);

    try {
      const response = await fetch("/api/generate-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentId }),
      });

      if (!response.ok) throw new Error(`PDF request failed with ${response.status}`);

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "numerologiya.pdf";
      document.body.appendChild(link);
      link.click();
      link.remove();
      // Немедленный revoke в некоторых браузерах отменяет загрузку.
      window.setTimeout(() => URL.revokeObjectURL(url), 10_000);
    } catch {
      setDownloadError("Не удалось скачать PDF. Он также отправлен вам на почту.");
    } finally {
      setDownloading(false);
    }
  }

  async function handleUpsell() {
    if (pending) return;
    setPending(true);
    setError(null);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan: "upsell",
          userData: {
            name: data?.name ?? "",
            email: data?.email ?? "",
            birthDate: data?.birthDate ?? "",
          },
        }),
      });

      const payload = (await response.json()) as {
        confirmationUrl?: string;
        error?: string;
      };

      if (!response.ok || !payload.confirmationUrl) {
        throw new Error(payload.error || "Не удалось создать платёж");
      }

      window.location.assign(payload.confirmationUrl);
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Не удалось создать платёж. Попробуйте ещё раз."
      );
      setPending(false);
    }
  }

  return (
    <main className="min-h-screen bg-cream">
      <SiteNav />

      <div className="mx-auto max-w-[720px] px-5 pb-24 pt-20 text-center md:px-8 md:pt-28">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex justify-center text-gold"
        >
          <CheckCircle size={64} aria-hidden="true" strokeWidth={1} />
        </motion.div>

        <h1 className="font-display mt-8 text-[34px] font-light leading-[1.15] text-navy md:text-[46px]">
          Оплата прошла успешно!
        </h1>

        <p className="mt-5 text-[17px] leading-[1.7] text-slate">
          {name === "Спасибо" ? "Ваш" : `${name}, ваш`} нумерологический портрет
          готов — он открыт ниже. Копия отправлена на{" "}
          <span className="text-navy">{email || "указанный вами email"}</span>.
        </p>

        <div className="mt-9">
          <button
            type="button"
            onClick={handleDownloadPDF}
            disabled={downloading}
            className="btn-primary mx-auto inline-flex items-center justify-center gap-2.5 md:max-w-[280px]"
          >
            <Download size={18} aria-hidden="true" />
            {downloading ? "Готовим PDF…" : "Скачать PDF"}
          </button>

          {downloadError ? (
            <p className="mt-4 text-[14px] text-gold" role="alert">
              {downloadError}
            </p>
          ) : null}
        </div>

        {sections.length > 0 ? (
          <section className="mt-14 text-left" aria-label="Ваш расчёт">
            <ul className="grid gap-5">
              {sections.map((section) => (
                <li key={section.title} className="border border-navy bg-cream-dark p-7">
                  <h2 className="font-display text-[22px] font-normal leading-tight text-navy">
                    {section.title}
                  </h2>
                  <p className="mt-3 text-[15px] leading-[1.7] whitespace-pre-line text-slate">
                    {section.content}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <hr className="rule-gold mx-auto mt-12 max-w-[320px]" />

        {/* Мягкий апселл */}
        <section className="mt-12 border border-navy bg-cream-dark p-8 text-left md:p-10">
          <div className="flex items-center gap-3 text-navy">
            <Headphones size={20} aria-hidden="true" />
            <p className="eyebrow">Дополнение</p>
          </div>

          <p className="font-display mt-4 text-[26px] font-normal leading-tight text-navy md:text-[30px]">
            Добавить аудио разбор? Только для новых клиентов — {formatPrice(490)} ₽
          </p>

          <p className="mt-3 text-[15px] leading-[1.7] text-slate">
            Пятнадцать минут голосом: разбор вашей комбинации чисел и ответ на один
            личный вопрос.
          </p>

          <button
            type="button"
            onClick={handleUpsell}
            disabled={pending}
            aria-label="Добавить аудио разбор за 490 рублей"
            className="btn-primary mt-7 md:max-w-[280px]"
          >
            {pending ? "Переходим к оплате…" : "Добавить разбор"}
          </button>

          {error ? (
            <p className="mt-4 text-[14px] text-gold" role="alert">
              {error}
            </p>
          ) : null}
        </section>
      </div>

      <SiteFooter />
    </main>
  );
}
