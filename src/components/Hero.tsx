"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Clock, Lock, Shield } from "lucide-react";
import SacredGeometry from "./SacredGeometry";
import { saveNumerologyData } from "@/lib/storage";

const COUNT_DURATION_MS = 2000;
const COUNT_STEP_MS = 110;

export default function Hero() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tick, setTick] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;

    saveNumerologyData({ name: name.trim(), birthDate, email: email.trim() });
    setIsSubmitting(true);

    intervalRef.current = setInterval(
      () => setTick((value) => value + 1),
      COUNT_STEP_MS
    );

    timeoutRef.current = setTimeout(() => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      router.push("/result");
    }, COUNT_DURATION_MS);
  }

  const heroGlyph = isSubmitting ? String((tick % 9) + 1) : "?";

  return (
    <section className="relative overflow-hidden bg-cream">
      <div className="mx-auto max-w-6xl px-5 pb-4 pt-14 md:px-8 md:pb-10 md:pt-24">
        <div className="grid items-center gap-10 md:grid-cols-[1.15fr_0.85fr] md:gap-16">
          {/* Левая колонка — текст */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <p className="eyebrow">Персональный расчёт</p>

            <h1 className="font-display mt-5 text-[38px] font-light leading-[1.08] text-navy md:text-[64px]">
              Ваше число судьбы —<br />
              всё что нужно знать<br />
              о себе
            </h1>

            <p className="mt-6 max-w-[520px] text-[17px] leading-[1.7] text-slate">
              Введите дату рождения и имя — получите расчёт числа судьбы, денег и
              отношений прямо сейчас
            </p>
          </motion.div>

          {/* Правая колонка — крупный типографический знак */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
            className="relative flex items-center justify-center"
          >
            <SacredGeometry className="pointer-events-none absolute inset-0 m-auto h-[320px] w-[320px] opacity-[0.06] md:h-[440px] md:w-[440px]" />

            <div className="relative w-full max-w-[320px]">
              <hr className="rule-gold" />
              <div className="flex h-[170px] items-center justify-center md:h-[240px]">
                <motion.span
                  key={heroGlyph}
                  initial={{ opacity: 0.35 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.18 }}
                  className="display-number hero-number block"
                >
                  {heroGlyph}
                </motion.span>
              </div>
              <hr className="rule-gold" />
              <p className="eyebrow eyebrow-muted mt-4 text-center">
                {isSubmitting ? "Идёт расчёт" : "Ваше число"}
              </p>
            </div>
          </motion.div>
        </div>

        {/* Форма */}
        <div className="mx-auto mt-14 w-full max-w-[520px] md:mt-20">
          <hr className="rule" />

          <form onSubmit={handleSubmit} className="pt-8">
            <div className="flex flex-col gap-5">
              <div>
                <label htmlFor="name" className="field-label">
                  Имя
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  autoComplete="given-name"
                  placeholder="Ваше имя"
                  aria-label="Ваше имя"
                  aria-required="true"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className="field-input mt-2"
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label htmlFor="birthDate" className="field-label">
                  Дата рождения
                </label>
                <input
                  id="birthDate"
                  name="birthDate"
                  type="date"
                  required
                  min="1920-01-01"
                  max="2020-12-31"
                  aria-label="Дата рождения"
                  aria-required="true"
                  value={birthDate}
                  onChange={(event) => setBirthDate(event.target.value)}
                  className="field-input mt-2"
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label htmlFor="email" className="field-label">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="Email для получения полного расчёта"
                  aria-label="Email для получения полного расчёта"
                  aria-required="true"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="field-input mt-2"
                  disabled={isSubmitting}
                />
              </div>

              <button
                type="submit"
                className="btn-primary mt-2"
                disabled={isSubmitting}
                aria-label="Рассчитать число судьбы по дате рождения и имени"
              >
                {isSubmitting ? "Рассчитываем…" : "Рассчитать число судьбы"}
              </button>
            </div>
          </form>

          <ul className="mt-6 flex flex-col items-center gap-3 text-[13px] text-muted sm:flex-row sm:justify-center sm:gap-6">
            <li className="flex items-center gap-2">
              <Shield size={14} aria-hidden="true" />
              Бесплатно и без регистрации
            </li>
            <li className="flex items-center gap-2">
              <Clock size={14} aria-hidden="true" />
              Результат за 30 секунд
            </li>
            <li className="flex items-center gap-2">
              <Lock size={14} aria-hidden="true" />
              Данные защищены
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
