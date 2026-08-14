import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type YooKassaNotification = {
  type?: string;
  event?: string;
  object?: {
    id?: string;
    status?: string;
    paid?: boolean;
    amount?: { value?: string; currency?: string };
    description?: string;
    metadata?: Record<string, string>;
  };
};

export async function POST(request: Request) {
  let notification: YooKassaNotification;

  try {
    notification = (await request.json()) as YooKassaNotification;
  } catch {
    return NextResponse.json({ error: "Некорректный формат" }, { status: 400 });
  }

  const payment = notification.object;
  const orderId = payment?.metadata?.orderId ?? payment?.id ?? "unknown";
  const email = payment?.metadata?.email ?? "";

  if (payment?.status === "succeeded") {
    console.log("[yookassa] payment succeeded", {
      orderId,
      email,
      paymentId: payment.id,
      plan: payment.metadata?.plan,
      amount: payment.amount?.value,
    });
    // Здесь подключается отправка готового расчёта на email покупателя.
  } else {
    console.log("[yookassa] notification", {
      event: notification.event,
      status: payment?.status,
      orderId,
    });
  }

  // ЮKassa считает уведомление доставленным при любом ответе 200.
  return NextResponse.json({ received: true }, { status: 200 });
}

export async function GET() {
  return NextResponse.json({ status: "ok" }, { status: 200 });
}
