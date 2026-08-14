import { NextResponse } from "next/server";
import { isPlanId, PLANS, SITE_URL } from "@/lib/site";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const YOOKASSA_API = "https://api.yookassa.ru/v3/payments";
const SHOP_ID = process.env.YUKASSA_SHOP_ID || "1333494";

type CheckoutBody = {
  plan?: unknown;
  name?: unknown;
  email?: unknown;
};

function originFrom(request: Request): string {
  const headerOrigin = request.headers.get("origin");
  if (headerOrigin) return headerOrigin.replace(/\/$/, "");
  return SITE_URL;
}

export async function POST(request: Request) {
  const secretKey = process.env.YUKASSA_SECRET_KEY;

  if (!secretKey) {
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
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const origin = originFrom(request);

  const payload = {
    amount: {
      value: plan.price.toFixed(2),
      currency: "RUB",
    },
    capture: true,
    confirmation: {
      type: "redirect",
      return_url: `${origin}/thank-you?plan=${plan.id}`,
    },
    description: `Нумерологический расчёт — ${plan.title}`,
    metadata: {
      plan: plan.id,
      name,
      email,
    },
    ...(email
      ? {
          receipt: {
            customer: { email },
            items: [
              {
                description: `Нумерологический расчёт — ${plan.title}`,
                quantity: "1.00",
                amount: { value: plan.price.toFixed(2), currency: "RUB" },
                vat_code: 1,
                payment_mode: "full_payment",
                payment_subject: "service",
              },
            ],
          },
        }
      : {}),
  };

  try {
    const response = await fetch(YOOKASSA_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Idempotence-Key": crypto.randomUUID(),
        Authorization: `Basic ${Buffer.from(`${SHOP_ID}:${secretKey}`).toString("base64")}`,
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    const result = (await response.json()) as {
      id?: string;
      confirmation?: { confirmation_url?: string };
      description?: string;
    };

    if (!response.ok || !result.confirmation?.confirmation_url) {
      console.error("YooKassa payment error", response.status, result);
      return NextResponse.json(
        { error: "Платёжная система отклонила запрос. Попробуйте позже." },
        { status: 502 }
      );
    }

    return NextResponse.json({
      paymentId: result.id,
      confirmationUrl: result.confirmation.confirmation_url,
    });
  } catch (cause) {
    console.error("YooKassa request failed", cause);
    return NextResponse.json(
      { error: "Не удалось связаться с платёжной системой." },
      { status: 502 }
    );
  }
}
