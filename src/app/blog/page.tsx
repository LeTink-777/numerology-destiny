import type { Metadata } from "next";
import Link from "next/link";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import { BLOG_POSTS } from "@/lib/blog-posts";

export const metadata: Metadata = {
  title: "Блог о нумерологии — расчёты по дате рождения и расшифровки",
  description:
    "Статьи о нумерологии по дате рождения: как рассчитать число судьбы, что означают числа от 1 до 9, квадрат Пифагора, совместимость и прогноз на год.",
  alternates: { canonical: "/blog" },
  robots: { index: true, follow: true },
};

export default function BlogIndexPage() {
  return (
    <main className="min-h-screen bg-cream">
      <SiteNav />

      <div className="mx-auto max-w-[760px] px-5 pb-24 pt-16 md:px-8 md:pt-20">
        <p className="eyebrow">Блог</p>
        <h1 className="font-display mt-4 text-[36px] font-light leading-[1.1] text-navy md:text-[48px]">
          Нумерология: расчёты и расшифровки
        </h1>
        <p className="mt-4 text-[16px] leading-[1.7] text-slate">
          Как считать числа по дате рождения, что они означают и как соотносить их
          между собой.
        </p>

        <hr className="rule-gold mt-10" />

        <ul className="mt-10 grid gap-5">
          {BLOG_POSTS.map((post) => (
            <li key={post.slug}>
              <Link
                href={`/blog/${post.slug}`}
                className="block border border-navy bg-cream-dark p-6 transition-colors hover:border-gold md:p-7"
              >
                <h2 className="font-display text-[22px] font-normal leading-tight text-navy">
                  {post.title}
                </h2>
                <p className="mt-3 text-[15px] leading-[1.7] text-slate">
                  {post.description}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <SiteFooter />
    </main>
  );
}
