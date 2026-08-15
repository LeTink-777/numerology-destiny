import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Генератор PDF читает эти шрифты с диска во время запроса. Их никто не
  // импортирует, поэтому трассировка файлов не увидит зависимость и роуты
  // уедут в деплой без шрифтов — вся кириллица превратится в мусор.
  outputFileTracingIncludes: {
    "/api/webhook": ["./public/fonts/**"],
    "/api/generate-pdf": ["./public/fonts/**"],
  },

  async redirects() {
    return [
      // Канонический адрес — www. Апекс отдаём 308-редиректом,
      // чтобы не плодить дубли страниц в индексе.
      {
        source: "/:path*",
        has: [{ type: "host", value: "moe-chislo.ru" }],
        destination: "https://www.moe-chislo.ru/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
