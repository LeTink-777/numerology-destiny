import { NextResponse } from "next/server";
import { isPlanId, PLANS, SITE_URL, type PlanId } from "@/lib/site";
import { createPayment, isPaymentsConfigured } from "@/lib/yukassa";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DESCRIPTIONS: Record<PlanId, string> = {
  basic: "Базовый нумерологический расчёт",
  full: "Полный нумерологический портрет",
  premium: "Нумерологический портрет + аудио разбор",
  upsell: "Аудио разбор нумерологического портрета",
};

type UserData = {
  name?: unknown;
  email?: unknown;
  birthDate?: unknown;
};

type CheckoutBody = {
  plan?: unknown;
  userData?: UserData;
  // Поля верхнего уровня поддерживаются для обратной совместимости.
  name?: unknown;
  email?: unknown;
  birthDate?: unknown;
};

function text(value: unknown, max = 200): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

/**
 * Хосты, на которые разрешено возвращать покупателя после оплаты.
 * Origin приходит из запроса, поэтому доверять ему без проверки нельзя:
 * иначе ЮKassa увела бы покупателя на произвольный адрес.
 */
const ALLOWED_RETURN_HOSTS = new Set([
  "moe-chislo.ru",
  "www.moe-chislo.ru",
  "numerology-destiny.vercel.app",
  new URL(SITE_URL).hostname,
]);

function originFrom(request: Request): string {
  const headerOrigin = request.headers.get("origin");
  if (!headerOrigin) return SITE_URL;

  try {
    const origin = new URL(headerOrigin);
    if (origin.protocol === "https:" && ALLOWED_RETURN_HOSTS.has(origin.hostname)) {
      return origin.origin;
    }
    // Локальная разработка: http://localhost:3000 остаётся рабочим.
    if (
      process.env.NODE_ENV !== "production" &&
      (origin.hostname === "localhost" || origin.hostname === "127.0.0.1")
    ) {
      return origin.origin;
    }
  } catch {
    // Некорректный Origin — молча используем канонический адрес.
  }

  return SITE_URL;
}

export async function POST(request: Request) {
  if (!isPaymentsConfigured()) {
    return NextResponse.json(
      { error: "Оплата временно недоступна. Платёжный ключ не настроен." },
      { status: 503 }
    );
  }

  let body: CheckoutBody;
  try {
    body = (await request.json()) as CheckoutBody;
  } catch {
    return NextResponse.json({ error: "Некорректный запрос" }, { status: 400 });
  }

  if (!isPlanId(body.plan)) {
    return NextResponse.json({ error: "Неизвестный тариф" }, { status: 400 });
  }

  const plan = PLANS[body.plan];
  const userData = body.userData ?? {};
  const name = text(userData.name ?? body.name, 120);
  const email = text(userData.email ?? body.email, 200);
  const birthDate = text(userData.birthDate ?? body.birthDate, 20);

  const orderId = crypto.randomUUID();
  const returnUrl = `${originFrom(request)}/thank-you?plan=${plan.id}&order=${orderId}`;

  try {
    const payment = await createPayment(
      plan.price,
      orderId,
      DESCRIPTIONS[plan.id],
      returnUrl,
      {
        email: email || undefined,
        metadata: { plan: plan.id, name, email, birthDate },
      }
    );

    return NextResponse.json({
      orderId,
      paymentId: payment.id,
      confirmationUrl: payment.confirmationUrl,
    });
  } catch (cause) {
    console.error("[checkout] payment creation failed", {
      plan: plan.id,
      message: cause instanceof Error ? cause.message : "unknown",
    });
    return NextResponse.json(
      { error: "Не удалось создать платёж. Попробуйте ещё раз." },
      { status: 502 }
    );
  }
}
