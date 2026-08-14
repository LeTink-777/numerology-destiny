import Link from "next/link";
import { OWNER } from "@/lib/site";

export default function SiteFooter() {
  return (
    <footer className="border-t border-line bg-cream-dark">
      <div className="mx-auto max-w-6xl px-5 py-12 md:px-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="max-w-md">
            <p className="font-display text-[24px] leading-none text-navy">Нумерология</p>
            <p className="mt-3 text-[13px] leading-relaxed text-muted">
              Материалы сайта носят развлекательно-познавательный характер и не заменяют
              консультацию специалиста.
            </p>
          </div>

          <div className="flex flex-col gap-2 text-[13px] text-slate">
            <Link href="/privacy" className="transition-colors hover:text-gold">
              Политика конфиденциальности
            </Link>
            <Link href="/offer" className="transition-colors hover:text-gold">
              Публичная оферта
            </Link>
            <a
              href={`mailto:${OWNER.email}`}
              className="transition-colors hover:text-gold"
            >
              {OWNER.email}
            </a>
          </div>
        </div>

        <hr className="rule mt-10" />

        <p className="mt-6 text-[12px] leading-relaxed text-muted">
          {OWNER.fullName}. ИНН {OWNER.inn}. {OWNER.status}. Telegram {OWNER.telegram}.
        </p>
      </div>
    </footer>
  );
}
