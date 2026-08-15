import {
  calculateNumerology,
  formatBirthDate,
  getDestinyDescription,
  getMoneyDescription,
  getPersonalityDescription,
  getSoulDescription,
  reduceNumber,
} from "@/lib/numerology";
import { isPlanId, type PlanId } from "@/lib/site";
import type { PdfSection } from "@/lib/pdf-generator";

/**
 * Собирает разделы отчёта для PDF в письме, PDF по кнопке и открытого
 * результата на /thank-you — чтобы все три источника всегда совпадали.
 *
 * Числа судьбы, души, личности и денег берутся из src/lib/numerology.ts.
 * Прогноз считается как персональный год: сумма дня и месяца рождения с
 * текущим годом, свёрнутая до однозначного числа. Это стандартный расчёт, а
 * не произвольный текст, поэтому он меняется вместе с датой рождения и годом.
 */

/** Тексты персонального года, 1–9. */
const PERSONAL_YEAR_TEXT: Record<number, string> = {
  1: "Персональный год 1 — начало нового девятилетнего цикла. Всё, что вы заложите в ближайшие месяцы, будет определять следующие девять лет, поэтому год плохо подходит для того, чтобы ждать. Решения, принятые сейчас, обходятся дешевле, чем те же решения через два года.",
  2: "Персональный год 2 — год терпения и партнёрства. Быстрых результатов не будет, и это не про вашу неэффективность: посеянное в прошлом году только укореняется. Главные события придут через людей, а не через ваш собственный напор.",
  3: "Персональный год 3 — год выражения и видимости. Вас будут замечать, звать и предлагать больше обычного, а любые проекты, связанные с речью, текстом и творчеством, идут легче. Риск года — распылиться на всё сразу и не закончить ничего.",
  4: "Персональный год 4 — год фундамента и дисциплины. Придётся много работать без быстрой отдачи: вы строите основание, на котором будете стоять дальше. То, что вы наладите в этом году в быту, финансах и здоровье, останется с вами надолго.",
  5: "Персональный год 5 — год перемен и свободы. Возможны переезд, смена работы, новые связи; удерживать старое в этом году особенно тяжело. Год щедр на возможности, но требует не хвататься за все сразу.",
  6: "Персональный год 6 — год дома, семьи и ответственности. На первый план выходят близкие, отношения и обязательства, и от части своих планов придётся отступить. Это также лучший год цикла для того, чтобы оформить союз или наладить дом.",
  7: "Персональный год 7 — год внутренней работы и анализа. Внешние результаты замедляются, зато становится ясно, что вы делали не так предыдущие шесть лет. Год для учёбы, тишины и пересборки, а не для громких стартов.",
  8: "Персональный год 8 — год результата и денег. Цикл выходит на пик: приходят отдача, признание и возможность заметно увеличить доход. Всё, что было выстроено честно, окупается; всё, что держалось на самообмане, в этом году ломается.",
  9: "Персональный год 9 — год завершения. Уходит то, что закончилось: работа, отношения, привычки, целые версии себя. Не начинайте в этом году крупное — освободите место, следующий год откроет новый цикл.",
};

export type NumerologyInput = {
  name: string;
  birthDate: string;
};

/**
 * Персональный год: день + месяц рождения + текущий год, свёрнутые до
 * однозначного числа. Мастер-числа здесь не применяются — цикл всегда 1–9.
 */
function personalYear(birthDate: string, year: number): number {
  const [, month, day] = birthDate.split("-").map(Number);
  const digits = (value: number) =>
    String(value)
      .split("")
      .reduce((sum, digit) => sum + Number(digit), 0);

  return reduceNumber(digits(day || 1) + digits(month || 1) + digits(year), false);
}

/**
 * Базовый тариф покрывает три числа портрета; полный и премиум добавляют
 * деньги и прогноз. Это соответствует списку на карточках тарифов.
 */
function sectionCountForPlan(plan: PlanId): number {
  return plan === "basic" ? 3 : 5;
}

export function generateResultSections(
  input: NumerologyInput,
  plan: string | null | undefined,
  now: Date = new Date()
): PdfSection[] {
  const resolvedPlan: PlanId = isPlanId(plan) ? plan : "full";
  const result = calculateNumerology(input.name, input.birthDate);
  const year = now.getFullYear();
  const yearNumber = personalYear(input.birthDate, year);

  const all: PdfSection[] = [
    {
      title: `Число судьбы — ${result.destinyNumber}`,
      content: getDestinyDescription(result.destinyNumber),
    },
    {
      title: `Число души — ${result.soulNumber}`,
      content: getSoulDescription(result.soulNumber),
    },
    {
      title: `Число личности — ${result.personalityNumber}`,
      content: getPersonalityDescription(result.personalityNumber),
    },
    {
      title: `Число денег — ${result.moneyNumber}`,
      content: getMoneyDescription(result.moneyNumber),
    },
    {
      title: `Прогноз на ${year} год — персональный год ${yearNumber}`,
      content: PERSONAL_YEAR_TEXT[yearNumber],
    },
  ];

  return all.slice(0, sectionCountForPlan(resolvedPlan));
}

/** Читает данные покупателя из metadata ЮKassa — там всё приходит строками. */
export function inputFromMetadata(
  metadata: Record<string, string>
): NumerologyInput | null {
  const name = metadata.name;
  const birthDate = metadata.birthDate;
  if (!name || !birthDate) return null;
  return { name, birthDate };
}

/** Строка под заголовком отчёта: имя и дата рождения. */
export function buildSubtitle(input: NumerologyInput): string {
  return `${input.name} · ${formatBirthDate(input.birthDate)}`;
}
