import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import { BLOG_POSTS, getPostBySlug } from "@/lib/blog-posts";
import { renderArticle } from "@/lib/blog-render";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) return {};

  return {
    title: post.title,
    description: post.description,
    keywords: post.keywords,
    alternates: { canonical: `/blog/${post.slug}` },
    robots: { index: true, follow: true },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) notFound();

  return (
    <main className="min-h-screen bg-cream">
      <SiteNav />

      <article className="mx-auto max-w-[760px] px-5 pb-24 pt-16 md:px-8 md:pt-20">
        <Link href="/blog" className="eyebrow">
          ← Все статьи
        </Link>
        <h1 className="font-display mt-4 text-[34px] font-light leading-[1.12] text-navy md:text-[44px]">
          {post.title}
        </h1>

        <hr className="rule-gold mt-10" />

        <div className="legal-body mt-8">{renderArticle(post.content)}</div>

        <aside className="mt-14 border border-navy bg-cream-dark p-8 md:p-10">
          <p className="eyebrow">Расчёт</p>
          <h2 className="font-display mt-4 text-[26px] font-normal leading-tight text-navy md:text-[30px]">
            Рассчитайте свои числа по дате рождения
          </h2>
          <p className="mt-3 text-[15px] leading-[1.7] text-slate">
            Числа судьбы, души, личности и денег считаются мгновенно и бесплатно.
            Полная расшифровка с прогнозом на год приходит в PDF на почту.
          </p>
          <Link href="/" className="btn-primary mt-7 inline-flex md:max-w-[280px]">
            Рассчитать бесплатно
          </Link>
        </aside>
      </article>

      <SiteFooter />
    </main>
  );
}
