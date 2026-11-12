import type { MetadataRoute } from "next";
import { getAllWords, getAllSpotlights } from "@/lib/content";
import { EXAM_CONFIG, SITE } from "@/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE.url;
  const pages: MetadataRoute.Sitemap = [
    { url: `${base}/`, changeFrequency: "daily", priority: 1 },
    { url: `${base}/words`, changeFrequency: "daily", priority: 0.8 },
    { url: `${base}/spotlights`, changeFrequency: "daily", priority: 0.8 },
    ...EXAM_CONFIG.map((e) => ({ url: `${base}${e.href}`, changeFrequency: "weekly" as const, priority: 0.9 })),
  ];
  const lessons = getAllSpotlights().map((s) => ({ url: `${base}/spotlights/${s.slug}`, lastModified: s.date || undefined, priority: 0.7 }));
  const words = getAllWords()
    .slice(0, 45000)
    .map((w) => ({ url: `${base}/words/${w.slug}`, lastModified: w.dateAdded || undefined, priority: 0.6 }));
  return [...pages, ...lessons, ...words];
}
