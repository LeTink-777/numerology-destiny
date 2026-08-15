import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      // /blog and /blog/* stay indexable; only the paid-flow pages are closed.
      allow: ["/", "/blog"],
      disallow: ["/api/", "/result", "/thank-you"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
