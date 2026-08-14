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

  const event = notification.event;
  const payment = notification.object;

  switch (event) {
    case "payment.succeeded": {
      console.log("[yookassa] payment succeeded", {
        id: payment?.id,
        amount: payment?.amount?.value,
        plan: payment?.metadata?.plan,
        email: payment?.metadata?.email,
        name: payment?.metadata?.name,
      });
      // Здесь подключается отправка расчёта на email клиента.
      break;
    }
    case "payment.canceled": {
      console.log("[yookassa] payment canceled", { id: payment?.id });
      break;
    }
    case "refund.succeeded": {
      console.log("[yookassa] refund succeeded", { id: payment?.id });
      break;
    }
    default: {
      console.log("[yookassa] unhandled event", event);
    }
  }

  // ЮKassa считает уведомление доставленным при любом ответе 200.
  return NextResponse.json({ received: true }, { status: 200 });
}

export async function GET() {
  return NextResponse.json({ status: "ok" }, { status: 200 });
}
