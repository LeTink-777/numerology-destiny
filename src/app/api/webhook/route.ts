import { NextResponse } from "next/server";
import { generatePDF } from "@/lib/pdf-generator";
import { sendResultEmail } from "@/lib/email";
import {
  buildSubtitle,
  generateResultSections,
  inputFromMetadata,
} from "@/lib/result-sections";
import { SITE_NAME } from "@/lib/site-name";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Уведомления ЮKassa об оплате.
 *
 * ЮKassa ничего не подписывает — единственная доступная проверка это адрес
 * отправителя, поэтому запросы с других адресов отклоняются. Без этого любой,
 * кто знает URL, мог бы отправить событие «succeeded» и заставить нас
 * бесплатно сформировать и отправить платный отчёт на произвольный адрес.
 *
 * Документация: https://yookassa.ru/developers/using-api/webhooks
 */

/** Опубликованные адреса, с которых приходят уведомления ЮKassa. */
const ALLOWED_CIDRS = [
  "185.71.76.0/27",
  "185.71.77.0/27",
  "77.75.153.0/25",
  "77.75.156.11/32",
  "77.75.156.35/32",
  "77.75.154.128/25",
  "2a02:5180::/32",
];

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

function ipToLong(ip: string): number | null {
  const parts = ip.split(".");
  if (parts.length !== 4) return null;

  let result = 0;
  for (const part of parts) {
    const octet = Number(part);
    if (!Number.isInteger(octet) || octet < 0 || octet > 255) return null;
    result = result * 256 + octet;
  }
  return result;
}

function isIpv4InCidr(ip: string, cidr: string): boolean {
  const [range, bitsRaw] = cidr.split("/");
  const bits = Number(bitsRaw);
  const ipLong = ipToLong(ip);
  const rangeLong = ipToLong(range);

  if (ipLong === null || rangeLong === null || !Number.isInteger(bits)) return false;

  // Маска /0 сдвинула бы на 32 бита, что в JS не делает ничего — обрабатываем явно.
  const mask = bits === 0 ? 0 : (-1 << (32 - bits)) >>> 0;
  return (ipLong & mask) === (rangeLong & mask);
}

function isAllowed(ip: string): boolean {
  if (!ip) return false;

  // Для IPv6 достаточно проверки префикса — блок опубликован один.
  if (ip.includes(":")) {
    return ip.toLowerCase().startsWith("2a02:5180:");
  }

  return ALLOWED_CIDRS.filter((cidr) => !cidr.includes(":")).some((cidr) =>
    isIpv4InCidr(ip, cidr)
  );
}

function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip")?.trim() ?? "";
}

export async function POST(request: Request) {
  const ip = clientIp(request);

  if (!isAllowed(ip)) {
    console.warn("[yookassa] уведомление с неизвестного адреса отклонено", { ip });
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

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

    await deliverReport(payment.metadata ?? {}, payment.id ?? null, orderId);
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

/**
 * Защита от повторной отправки одного и того же отчёта.
 *
 * ЮKassa повторяет уведомление, пока не получит 200, поэтому доставка,
 * завершившаяся после медленного ответа, ушла бы покупателю дважды. Множество
 * живёт в памяти инстанса и покрывает только повторы, попавшие на тот же
 * прогретый процесс — надёжное решение это запись заказа в базе, которой у
 * проекта пока нет.
 */
const delivered = new Set<string>();

async function deliverReport(
  metadata: Record<string, string>,
  paymentId: string | null,
  orderId: string
): Promise<void> {
  const key = paymentId ?? orderId;

  if (delivered.has(key)) {
    console.log("[yookassa] отчёт уже отправлен, пропускаем", { orderId, paymentId });
    return;
  }

  const email = metadata.email;
  const input = inputFromMetadata(metadata);

  if (!email || !input) {
    console.error("[yookassa] недостаточно данных для отправки отчёта", {
      orderId,
      paymentId,
      hasEmail: Boolean(email),
      hasInput: Boolean(input),
    });
    return;
  }

  try {
    const sections = generateResultSections(input, metadata.plan);

    const pdfBuffer = await generatePDF({
      title: "Ваш нумерологический портрет",
      userName: input.name,
      subtitle: buildSubtitle(input),
      sections,
      siteName: SITE_NAME,
    });

    await sendResultEmail({
      to: email,
      subject: "Ваш нумерологический портрет готов",
      userName: input.name,
      resultHtml: sections
        .map(
          (section) =>
            `<h3 style="color:#C9963A;font-size:17px;margin:24px 0 8px;">${section.title}</h3>` +
            `<p style="font-size:15px;line-height:1.6;margin:0;">${section.content}</p>`
        )
        .join(""),
      pdfBuffer,
      fileName: "numerologiya.pdf",
      siteName: SITE_NAME,
    });

    delivered.add(key);

    console.log("[yookassa] отчёт отправлен", { orderId, paymentId, to: email });
  } catch (error) {
    // Ошибку намеренно не пробрасываем: ответ всё равно 200. Ответ не-200
    // заставит ЮKassa повторять уведомление часами, а сбой здесь относится к
    // доставке, а не к платежу — деньги уже приняты в любом случае.
    console.error("[yookassa] не удалось отправить отчёт", {
      orderId,
      paymentId,
      error: error instanceof Error ? error.message : String(error),
    });
  }
}
