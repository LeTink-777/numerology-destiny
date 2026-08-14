import { BookOpen, Briefcase, Heart, Layers, Star, Quote } from "lucide-react";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import Hero from "@/components/Hero";

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
    <main className="min-h-screen bg-cream">
      <SiteNav />
      <Hero />

      {/* Секция 1 — что такое число судьбы */}
      <section className="bg-cream-dark">
        <div className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
          <div className="grid gap-10 md:grid-cols-[0.9fr_1.1fr] md:gap-20">
            <div>
              <div className="flex items-center gap-3 text-navy">
                <BookOpen size={20} aria-hidden="true" />
                <p className="eyebrow">Основы</p>
              </div>
              <h2 className="font-display mt-4 text-[34px] font-light leading-[1.15] text-navy md:text-[46px]">
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
                <Quote
                  size={22}
                  aria-hidden="true"
                  className="mb-3 text-gold"
                />
                Числа — это язык, на котором вселенная говорит с каждым из нас
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* Секция 2 — три числа */}
      <section className="bg-cream">
        <div className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
          <div className="flex items-center gap-3 text-navy">
            <Layers size={20} aria-hidden="true" />
            <p className="eyebrow">Структура расчёта</p>
          </div>
          <h2 className="font-display mt-4 max-w-[16ch] text-[34px] font-light leading-[1.15] text-navy md:text-[46px]">
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

      {/* Секция 3 — социальное доказательство */}
      <section className="bg-cream-dark">
        <div className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
          <div className="text-center">
            <p className="eyebrow">Отзывы</p>
            <p className="font-display mt-4 text-[34px] font-light leading-tight text-navy md:text-[46px]">
              23 847 человек уже узнали своё число
            </p>
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
