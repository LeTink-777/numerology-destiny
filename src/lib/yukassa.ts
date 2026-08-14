import "server-only";

/**
 * Клиент ЮKassa поверх официального REST API (api.yookassa.ru/v3).
 * Секретный ключ читается только на сервере и никогда не попадает в бандл.
 */

const YOOKASSA_API = "https://api.yookassa.ru/v3/payments";

export const SHOP_ID =
  process.env.NEXT_PUBLIC_YUKASSA_SHOP_ID || process.env.YUKASSA_SHOP_ID || "1333494";

export function isPaymentsConfigured(): boolean {
  return Boolean(process.env.YUKASSA_SECRET_KEY && SHOP_ID);
}

export type CreatePaymentResult = {
  id: string;
  status: string;
  confirmationUrl: string;
};

export type CreatePaymentOptions = {
  /** Email покупателя — нужен для формирования чека. */
  email?: string;
  /** Произвольные данные, возвращаются в вебхуке. */
  metadata?: Record<string, string>;
};

function authHeader(secretKey: string): string {
  return `Basic ${Buffer.from(`${SHOP_ID}:${secretKey}`).toString("base64")}`;
}

/**
 * Создаёт платёж и возвращает ссылку на страницу оплаты.
 *
 * @param amount    сумма в рублях
 * @param orderId   идентификатор заказа (уходит в metadata и Idempotence-Key)
 * @param description  описание платежа для чека и личного кабинета
 * @param returnUrl адрес, куда ЮKassa вернёт покупателя после оплаты
 */
export async function createPayment(
  amount: number,
  orderId: string,
  description: string,
  returnUrl: string,
  options: CreatePaymentOptions = {}
): Promise<CreatePaymentResult> {
  const secretKey = process.env.YUKASSA_SECRET_KEY;

  if (!secretKey) {
    throw new Error("YUKASSA_SECRET_KEY не задан");
  }

  const value = amount.toFixed(2);
  const { email, metadata } = options;

  const payload = {
    amount: { value, currency: "RUB" },
    capture: true,
    payment_method_data: { type: "bank_card" },
    confirmation: {
      type: "redirect",
      return_url: returnUrl,
    },
    description,
    metadata: { orderId, ...metadata },
    ...(email
      ? {
          receipt: {
            customer: { email },
            items: [
              {
                description,
                quantity: "1.00",
                amount: { value, currency: "RUB" },
                vat_code: 1,
                payment_mode: "full_payment",
                payment_subject: "service",
              },
            ],
          },
        }
      : {}),
  };

  const response = await fetch(YOOKASSA_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Idempotence-Key": orderId,
      Authorization: authHeader(secretKey),
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  const result = (await response.json()) as {
    id?: string;
    status?: string;
    confirmation?: { confirmation_url?: string };
    description?: string;
    code?: string;
  };

  if (!response.ok || !result.confirmation?.confirmation_url || !result.id) {
    // Ответ ЮKassa не содержит секретов, но и в лог отдаём только код и статус.
    console.error("[yookassa] createPayment failed", {
      httpStatus: response.status,
      code: result.code,
      description: result.description,
    });
    throw new Error("Платёжная система отклонила запрос");
  }

  return {
    id: result.id,
    status: result.status ?? "pending",
    confirmationUrl: result.confirmation.confirmation_url,
  };
}
