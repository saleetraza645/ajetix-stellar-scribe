import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { projects } from "@/lib/portfolio-data";

<<<<<<< HEAD
const SITE_URL = (import.meta.env.VITE_SITE_URL || "https://ajetix.com").replace(/\/$/, "");
=======
const BASE_URL = ""; // relative — resolves to whichever domain serves it
>>>>>>> a25318459c6d5f0d463fa1ed2c0fa7553a6d1ef2

interface SitemapEntry {
  path: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const entries: SitemapEntry[] = [
          { path: "/", changefreq: "weekly", priority: "1.0" },
          { path: "/about", changefreq: "monthly", priority: "0.8" },
          { path: "/services", changefreq: "monthly", priority: "0.9" },
          { path: "/process", changefreq: "monthly", priority: "0.7" },
          { path: "/portfolio", changefreq: "weekly", priority: "0.9" },
          { path: "/contact", changefreq: "yearly", priority: "0.8" },
          ...projects.map((p) => ({
            path: `/portfolio/${p.slug}`,
            changefreq: "monthly" as const,
            priority: "0.6",
          })),
        ];

        const urls = entries.map((e) =>
          [
            `  <url>`,
<<<<<<< HEAD
            `    <loc>${SITE_URL}${e.path}</loc>`,
            `    <lastmod>${new Date().toISOString().slice(0, 10)}</lastmod>`,
=======
            `    <loc>${BASE_URL}${e.path}</loc>`,
>>>>>>> a25318459c6d5f0d463fa1ed2c0fa7553a6d1ef2
            e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
            e.priority ? `    <priority>${e.priority}</priority>` : null,
            `  </url>`,
          ].filter(Boolean).join("\n"),
        );

        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...urls,
          `</urlset>`,
        ].join("\n");

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});