"use client";

import { useState } from "react";
import { Check, RotateCcw, Shield, Users, X } from "lucide-react";
import CountdownTimer from "./CountdownTimer";
import { useClientSnapshot } from "@/lib/client-store";
import { getSpotsLeft } from "@/lib/storage";
import { formatPrice, PLANS, type PlanId } from "@/lib/site";

type Feature = { text: string; included: boolean };

type Plan = {
  id: PlanId;
  label?: string;
  badge?: string;
  title: string;
  oldPrice: number;
  price: number;
  features: Feature[];
  highlighted?: boolean;
};

const PLAN_CARDS: Plan[] = [
  {
    id: "basic",
    label: "Старт",
    title: "Базовый расчёт",
    oldPrice: PLANS.basic.oldPrice,
    price: PLANS.basic.price,
    features: [
      { text: "Число судьбы (уже открыто)", included: true },
      { text: "Число личности", included: true },
      { text: "PDF 8 страниц", included: true },
      { text: "Email за 24 часа", included: true },
      { text: "Число денег", included: false },
      { text: "Персональный прогноз", included: false },
    ],
  },
  {
    id: "full",
    badge: "Выбор 79% покупателей",
    title: "Полный портрет",
    oldPrice: PLANS.full.oldPrice,
    price: PLANS.full.price,
    highlighted: true,
    features: [
      { text: "Все 4 числа расшифрованы", included: true },
      { text: "Число денег и финансовый код", included: true },
      { text: "Совместимость с партнёром", included: true },
      { text: "Прогноз на 2026–2027", included: true },
      { text: "PDF 20+ страниц", included: true },
      { text: "Email за 12 часов", included: true },
    ],
  },
  {
    id: "premium",
    label: "Максимум",
    title: "Портрет + Консультация",
    oldPrice: PLANS.premium.oldPrice,
    price: PLANS.premium.price,
    features: [
      { text: "Всё из полного портрета", included: true },
      { text: "Аудио разбор 15 минут", included: true },
      { text: "Ответ на 1 личный вопрос", included: true },
      { text: "PDF + аудиофайл", included: true },
      { text: "Готово за 6 часов", included: true },
    ],
  },
];

type Props = {
  name: string;
  email: string;
};

export default function PricingCards({ name, email }: Props) {
  const spots = useClientSnapshot(getSpotsLeft);
  const [pendingPlan, setPendingPlan] = useState<PlanId | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleCheckout(plan: PlanId) {
    if (pendingPlan) return;
    setPendingPlan(plan);
    setError(null);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, name, email }),
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
      setPendingPlan(null);
    }
  }

  return (
    <section className="mt-16 md:mt-24">
      <div className="text-center">
        <p className="eyebrow">Тарифы</p>
        <h2 className="font-display mt-4 text-[32px] font-light leading-tight text-navy md:text-[44px]">
          Выберите глубину расчёта
        </h2>
      </div>

      <div className="mt-12 grid gap-6 md:mt-14 md:grid-cols-3 md:items-start md:gap-7">
        {PLAN_CARDS.map((plan) => {
          const isPending = pendingPlan === plan.id;

          return (
            <article
              key={plan.id}
              className={[
                "editorial-card relative flex flex-col p-7 md:p-8",
                plan.highlighted
                  ? "order-first border-2 border-gold pt-16 md:order-none md:-mt-4 md:pt-16"
                  : "",
              ].join(" ")}
            >
              {plan.badge ? (
                <p className="absolute left-0 top-0 bg-gold px-4 py-2 text-[11px] font-medium uppercase tracking-[0.16em] text-navy">
                  {plan.badge}
                </p>
              ) : null}

              {plan.label ? (
                <p className="eyebrow eyebrow-muted">{plan.label}</p>
              ) : (
                <p className="eyebrow">Рекомендуем</p>
              )}

              <h3 className="font-display mt-3 text-[28px] font-normal leading-tight text-navy">
                {plan.title}
              </h3>

              <div className="mt-5 flex items-baseline gap-3">
                <span className="text-[15px] text-muted line-through">
                  {formatPrice(plan.oldPrice)} ₽
                </span>
                <span className="font-display text-[44px] font-normal leading-none text-navy">
                  {formatPrice(plan.price)} ₽
                </span>
              </div>

              <hr className="rule my-6" />

              <ul className="flex flex-1 flex-col gap-3">
                {plan.features.map((feature) => (
                  <li
                    key={feature.text}
                    className={[
                      "flex items-start gap-3 text-[14px] leading-snug",
                      feature.included ? "text-slate" : "text-muted",
                    ].join(" ")}
                  >
                    <span className="mt-[2px] shrink-0">
                      {feature.included ? (
                        <Check size={16} aria-hidden="true" className="text-gold" />
                      ) : (
                        <X size={16} aria-hidden="true" className="text-muted" />
                      )}
                    </span>
                    {feature.text}
                  </li>
                ))}
              </ul>

              <div className="mt-7">
                {plan.id === "full" ? <CountdownTimer /> : null}

                {plan.id === "basic" ? (
                  <p className="text-[13px] text-slate">Осталось 9 мест</p>
                ) : null}

                {plan.id === "premium" ? (
                  <p className="text-[13px] text-slate">
                    Осталось {spots ?? "…"} мест
                  </p>
                ) : null}

                <button
                  type="button"
                  onClick={() => handleCheckout(plan.id)}
                  disabled={isPending}
                  className={`${plan.highlighted ? "btn-primary" : "btn-outline"} mt-4`}
                >
                  {isPending
                    ? "Переходим к оплате…"
                    : `Получить за ${formatPrice(plan.price)} ₽`}
                </button>
              </div>
            </article>
          );
        })}
      </div>

      {error ? (
        <p className="mt-6 text-center text-[14px] text-gold" role="alert">
          {error}
        </p>
      ) : null}

      <ul className="mt-10 flex flex-col items-center gap-3 text-[13px] text-muted sm:flex-row sm:justify-center sm:gap-7">
        <li className="flex items-center gap-2">
          <Shield size={16} aria-hidden="true" />
          Безопасная оплата ЮKassa
        </li>
        <li className="flex items-center gap-2">
          <RotateCcw size={16} aria-hidden="true" />
          Возврат за 3 дня
        </li>
        <li className="flex items-center gap-2">
          <Users size={16} aria-hidden="true" />
          23 847 расчётов выполнено
        </li>
      </ul>
    </section>
  );
}
