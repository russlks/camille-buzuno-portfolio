import type { MetadataRoute } from "next";
import { WORKS } from "./lib/works";

const SITE_URL = "https://www.camillebuzuno.com";

/* sitemap.xml — собирается сам: страницы сайта + каждая работа из
   data/artworks.ts. Новая работа появится здесь без правок этого файла. */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const pages = [
    { path: "", priority: 1 },
    { path: "/works", priority: 0.9 },
    { path: "/artist-statement", priority: 0.7 },
    { path: "/about", priority: 0.7 },
    { path: "/cv", priority: 0.6 },
    { path: "/exhibitions", priority: 0.6 },
    { path: "/commercial", priority: 0.7 },
    { path: "/shop", priority: 0.7 },
    { path: "/contact", priority: 0.6 },
    { path: "/privacy", priority: 0.2 },
    { path: "/terms", priority: 0.2 },
  ];

  return [
    ...pages.map((p) => ({
      url: `${SITE_URL}${p.path}`,
      lastModified: now,
      priority: p.priority,
    })),
    ...WORKS.map((w) => ({
      url: `${SITE_URL}/works/${w.slug}`,
      lastModified: now,
      priority: 0.8,
    })),
  ];
}
