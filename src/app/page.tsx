import type { Metadata } from "next";
import {
  BookOpen,
  Briefcase,
  ChevronDown,
  Heart,
  HelpCircle,
  Layers,
  Star,
  Quote,
} from "lucide-react";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import Hero from "@/components/Hero";
import { FAQ_ITEMS, HOME_SCHEMAS, KEYWORDS, SITE_DESCRIPTION, SITE_TITLE } from "@/lib/seo";

export const metadata: Metadata = {
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  keywords: KEYWORDS,
  alternates: { canonical: "/" },
};

const THREE_NUMBERS = [
  {
    icon: Star,
    title: "Число судьбы",
    text: "Ваш главный жизненный путь — направление, по которому вы движетесь, даже когда сворачиваете. Оно рассчитывается по дате рождения и не меняется никогда.",
  },
  {
    icon: Heart,
    title: "Число души",
    text: "То, что движет вами изнутри: настоящие мотивы, потребности в близости, причины ваших выборов в отношениях. Считается по гласным вашего имени.",
  },
  {
    icon: Briefcase,
    title: "Число личности",
    text: "Как вас видит мир: первое впечатление, репутация, профессиональная роль. Считается по согласным имени и часто расходится с тем, как вы видите себя сами.",
  },
];

const TESTIMONIALS = [
  {
    quote: "Про деньги попало в точку. Даже не ожидала такой точности.",
    author: "Анна, 31 год",
  },
  {
    quote: "Наконец понял почему всегда выбираю не тех людей.",
    author: "Михаил, 28 лет",
  },
  {
    quote: "Число отношений описало мои проблемы лучше любого психолога.",
    author: "Екатерина, 35 лет",
  },
];

export default function Home() {
  return (
    <main
      className="min-h-screen bg-cream"
      itemScope
      itemType="https://schema.org/WebApplication"
    >
      <meta itemProp="name" content="Нумерологический калькулятор" />
      <meta itemProp="applicationCategory" content="LifestyleApplication" />
      <meta itemProp="operatingSystem" content="Web" />

      {HOME_SCHEMAS.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      <SiteNav />
      <Hero />

      {/* Секция 1 — что такое число судьбы */}
      <section className="bg-cream-dark" aria-labelledby="about-destiny">
        <div className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
          <div className="grid gap-10 md:grid-cols-[0.9fr_1.1fr] md:gap-20">
            <div>
              <div className="flex items-center gap-3 text-navy">
                <BookOpen size={20} aria-hidden="true" />
                <p className="eyebrow">Основы</p>
              </div>
              <h2
                id="about-destiny"
                className="font-display mt-4 text-[34px] font-light leading-[1.15] text-navy md:text-[46px]"
              >
                Что такое число судьбы
              </h2>
            </div>

            <div className="prose-editorial">
              <p>
                Число судьбы получают из полной даты рождения: все её цифры складывают и
                сводят к одному разряду. Это единственное число в нумерологии, которое
                нельзя изменить, — оно задано в момент, когда вы появились на свет, и
                описывает не характер, а маршрут: какие задачи будут возвращаться к вам
                снова и снова, пока вы их не решите.
              </p>
              <p className="mt-5">
                Нумерологи называют его «числом пути», потому что оно объясняет
                повторяющиеся сюжеты — почему одни люди всю жизнь начинают заново, другие
                строят одно дело десятилетиями, а третьи оказываются нужны всем, кроме
                себя. Отдельно стоят мастер-числа 11, 22 и 33: они не сводятся дальше и
                означают повышенное напряжение задачи.
              </p>

              <hr className="rule-gold my-10" />

              <blockquote className="pull-quote">
                <Quote size={22} aria-hidden="true" className="mb-3 text-gold" />
                Числа — это язык, на котором вселенная говорит с каждым из нас
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* Секция 2 — три числа */}
      <section className="bg-cream" aria-labelledby="three-numbers">
        <div className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
          <div className="flex items-center gap-3 text-navy">
            <Layers size={20} aria-hidden="true" />
            <p className="eyebrow">Структура расчёта</p>
          </div>
          <h2
            id="three-numbers"
            className="font-display mt-4 max-w-[16ch] text-[34px] font-light leading-[1.15] text-navy md:text-[46px]"
          >
            Три числа которые определяют вашу жизнь
          </h2>

          <div className="mt-12 grid gap-6 md:mt-16 md:grid-cols-3 md:gap-8">
            {THREE_NUMBERS.map((item) => {
              const Icon = item.icon;
              return (
                <article
                  key={item.title}
                  className="editorial-card border-t-[3px] border-t-gold p-7 md:p-8"
                >
                  <Icon size={20} aria-hidden="true" className="text-gold" />
                  <h3 className="font-display mt-5 text-[26px] font-normal leading-tight text-navy">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-[15px] leading-[1.7] text-slate">{item.text}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Секция 3 — вопросы и ответы */}
      <section
        className="bg-cream-dark"
        aria-labelledby="faq-heading"
        itemScope
        itemType="https://schema.org/FAQPage"
      >
        <div className="mx-auto max-w-[860px] px-5 py-20 md:px-8 md:py-28">
          <div className="flex items-center gap-3 text-navy">
            <HelpCircle size={20} aria-hidden="true" />
            <p className="eyebrow">Вопросы и ответы</p>
          </div>
          <h2
            id="faq-heading"
            className="font-display mt-4 text-[34px] font-light leading-[1.15] text-navy md:text-[46px]"
          >
            Частые вопросы о числе судьбы
          </h2>

          <div className="mt-12">
            {FAQ_ITEMS.map((item) => (
              <details
                key={item.question}
                className="faq-item group border-t border-line"
                itemScope
                itemProp="mainEntity"
                itemType="https://schema.org/Question"
              >
                <summary
                  className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 text-left [&::-webkit-details-marker]:hidden"
                  aria-label={item.question}
                >
                  <h3
                    className="font-display text-[22px] font-normal leading-snug text-navy md:text-[26px]"
                    itemProp="name"
                  >
                    {item.question}
                  </h3>
                  <ChevronDown
                    size={20}
                    aria-hidden="true"
                    className="shrink-0 text-gold transition-transform duration-300 group-open:rotate-180"
                  />
                </summary>
                <div
                  itemScope
                  itemProp="acceptedAnswer"
                  itemType="https://schema.org/Answer"
                >
                  <p
                    className="max-w-[70ch] pb-7 text-[16px] leading-[1.75] text-slate"
                    itemProp="text"
                  >
                    {item.answer}
                  </p>
                </div>
              </details>
            ))}
            <hr className="rule" />
          </div>
        </div>
      </section>

      {/* Секция 4 — социальное доказательство */}
      <section className="bg-cream" aria-labelledby="social-proof">
        <div className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
          <div className="text-center">
            <p className="eyebrow">Отзывы</p>
            <h2
              id="social-proof"
              className="font-display mt-4 text-[34px] font-light leading-tight text-navy md:text-[46px]"
            >
              23 847 человек уже узнали своё число
            </h2>
          </div>

          <hr className="rule-gold mx-auto mt-12 max-w-3xl" />

          <div className="mt-12 grid gap-8 md:grid-cols-3 md:gap-10">
            {TESTIMONIALS.map((item) => (
              <figure key={item.author}>
                <blockquote className="font-display text-[22px] font-normal italic leading-[1.4] text-navy md:text-[24px]">
                  «{item.quote}»
                </blockquote>
                <figcaption className="mt-4 text-[13px] tracking-[0.06em] text-muted">
                  — {item.author}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
