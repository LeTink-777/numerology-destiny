import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import { SITE_URL } from "@/lib/site";

const cormorant = Cormorant_Garamond({
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Нумерология по дате рождения — Число судьбы бесплатно",
  description:
    "Узнайте своё число судьбы, души и денег по дате рождения. Персональный нумерологический расчёт онлайн — бесплатно и мгновенно.",
  keywords: [
    "нумерология по дате рождения",
    "число судьбы",
    "нумерология онлайн бесплатно",
    "число судьбы по дате рождения",
    "нумерологический расчёт",
    "число имени нумерология",
    "нумерология имя и дата рождения",
    "число денег нумерология",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: SITE_URL,
    siteName: "Нумерология",
    title: "Нумерология по дате рождения — Число судьбы бесплатно",
    description:
      "Узнайте своё число судьбы, души и денег по дате рождения. Персональный нумерологический расчёт онлайн — бесплатно и мгновенно.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Нумерология по дате рождения — Число судьбы бесплатно",
    description:
      "Узнайте своё число судьбы, души и денег по дате рождения. Персональный нумерологический расчёт онлайн — бесплатно и мгновенно.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#FAF8F3",
  width: "device-width",
  initialScale: 1,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Нумерология — расчёт числа судьбы",
  applicationCategory: "LifestyleApplication",
  operatingSystem: "Web",
  url: SITE_URL,
  inLanguage: "ru-RU",
  description:
    "Онлайн-расчёт числа судьбы, числа души, числа личности и числа денег по дате рождения и имени.",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "RUB",
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.8",
    ratingCount: "23847",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru" className={`${cormorant.variable} ${inter.variable}`}>
      <body>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
