import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
