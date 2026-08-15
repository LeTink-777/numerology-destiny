import Link from "next/link";

export default function SiteNav() {
  return (
    <header className="border-b border-line bg-cream">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 md:px-8">
        <Link
          href="/"
          className="font-display text-[24px] font-medium leading-none text-navy md:text-[27px]"
        >
          Нумерология
        </Link>
        <nav className="flex items-center gap-5">
          <Link
            href="/blog"
            className="text-[13px] text-navy transition-colors hover:text-gold md:text-[14px]"
          >
            Блог
          </Link>
          <span className="text-[12px] tracking-[0.08em] text-muted md:text-[13px]">
            Персональный расчёт
          </span>
        </nav>
      </div>
    </header>
  );
}
