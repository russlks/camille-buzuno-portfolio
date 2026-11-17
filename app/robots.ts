import type { MetadataRoute } from "next";

const SITE_URL = "https://www.camillebuzuno.com";

/* robots.txt — открыт весь сайт, кроме служебных страниц:
   тестовой страницы русалки и экранов после оплаты Stripe. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/water-mermaid-preview",
        "/commercial/success",
        "/commercial/cancelled",
        "/api/",
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
