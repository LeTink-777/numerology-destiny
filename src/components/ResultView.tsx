"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Lock } from "lucide-react";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import PricingCards from "@/components/PricingCards";
import { useClientSnapshot } from "@/lib/client-store";
import { getNumerologyDataSnapshot, readNumerologyData } from "@/lib/storage";
import {
  calculateNumerology,
  formatBirthDate,
  getDestinyDescription,
  getMoneyDescription,
  getPersonalityDescription,
  getSoulDescription,
  shortDescription,
} from "@/lib/numerology";

export default function ResultView() {
  const router = useRouter();
  const data = useClientSnapshot(getNumerologyDataSnapshot);

  // Без сохранённых данных считать нечего — возвращаем на форму.
  useEffect(() => {
    if (!readNumerologyData()) {
      router.replace("/");
    }
  }, [router]);

  const numbers = useMemo(
    () => (data ? calculateNumerology(data.name, data.birthDate) : null),
    [data]
  );

  if (!data || !numbers) {
    return (
      <main className="min-h-screen bg-card">
        <SiteNav />
        <div className="mx-auto flex max-w-6xl items-center justify-center px-5 py-32">
          <p className="text-[14px] text-muted">Загружаем ваш расчёт…</p>
        </div>
      </main>
    );
  }

  const { destinyNumber, soulNumber, personalityNumber, moneyNumber } = numbers;

  return (
    <main className="min-h-screen bg-card">
      <SiteNav />

      <div className="mx-auto max-w-6xl px-5 pb-24 pt-14 md:px-8 md:pt-20">
        {/* Заголовок */}
        <motion.header
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <p className="eyebrow">Ваш расчёт готов</p>
          <h1 className="font-display mt-4 text-[34px] font-light leading-[1.1] text-navy md:text-[52px]">
            {data.name}, ваш нумерологический портрет
          </h1>
          <p className="mt-4 text-[14px] text-muted">
            Дата рождения: {formatBirthDate(data.birthDate)}
          </p>
        </motion.header>

        <hr className="rule mt-10" />

        {/* Бесплатно — число судьбы */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-14 md:mt-20"
        >
          <p className="eyebrow text-center">Число судьбы</p>

          <hr className="rule-gold mt-6" />
          <div className="py-4 text-center md:py-6">
            <span className="display-number block">{destinyNumber}</span>
          </div>
          <hr className="rule-gold" />

          <p className="mx-auto mt-8 max-w-[680px] text-center text-[17px] leading-[1.75] text-slate">
            {getDestinyDescription(destinyNumber)}
          </p>
        </motion.section>

        {/* Бесплатно — число души */}
        <section className="editorial-card mx-auto mt-16 max-w-[760px] p-8 md:mt-20 md:p-12">
          <div className="flex flex-col items-center gap-6 md:flex-row md:items-center md:gap-12">
            <div className="text-center md:text-left">
              <p className="eyebrow">Число души</p>
              <span className="display-number display-number-sm mt-2 block">
                {soulNumber}
              </span>
            </div>
            <p className="text-[16px] leading-[1.75] text-slate md:border-l md:border-line md:pl-12">
              {shortDescription(getSoulDescription(soulNumber), 2)}
            </p>
          </div>
        </section>

        {/* Разделитель платной части */}
        <div className="mt-20 flex items-center gap-5 md:mt-24">
          <hr className="rule-gold flex-1" />
          <span className="shrink-0 text-[12px] uppercase tracking-[0.16em] text-muted">
            — Платная часть —
          </span>
          <hr className="rule-gold flex-1" />
        </div>

        {/* Закрытая часть */}
        <div className="relative mt-12">
          <div className="locked grid gap-6 md:grid-cols-2 md:gap-8" aria-hidden="true">
            <article className="editorial-card p-8 text-center">
              <p className="eyebrow">Число личности</p>
              <span className="display-number display-number-sm mt-2 block">
                {personalityNumber}
              </span>
              <p className="mt-4 text-[15px] leading-[1.7] text-slate">
                {shortDescription(getPersonalityDescription(personalityNumber), 2)}
              </p>
            </article>

            <article className="editorial-card p-8 text-center">
              <p className="eyebrow">Число денег</p>
              <span className="display-number display-number-sm mt-2 block">
                {moneyNumber}
              </span>
              <p className="mt-4 text-[15px] leading-[1.7] text-slate">
                {shortDescription(getMoneyDescription(moneyNumber), 2)}
              </p>
            </article>
          </div>
        </div>

        {/* CTA под размытием */}
        <div className="mt-10 flex flex-col items-center text-center">
          <Lock size={20} aria-hidden="true" className="text-gold" />
          <p className="font-display mt-4 text-[28px] font-normal leading-tight text-navy md:text-[34px]">
            Откройте число личности и число денег
          </p>
          <p className="mt-3 max-w-[520px] text-[15px] leading-[1.7] text-slate">
            Узнайте как вас видят другие и ваш финансовый код
          </p>
        </div>

        <PricingCards
          name={data.name}
          email={data.email}
          birthDate={data.birthDate}
        />
      </div>

      <SiteFooter />
    </main>
  );
}
