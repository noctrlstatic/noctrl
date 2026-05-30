const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://noctrl.it";

export default function sitemap() {
  const routes = [
    { url: "", lastModified: "2026-05-29", changeFrequency: "weekly", priority: 1.0 },
    { url: "/chi-siamo", lastModified: "2026-05-29", changeFrequency: "monthly", priority: 0.7 },
    { url: "/spedizioni", lastModified: "2026-05-29", changeFrequency: "monthly", priority: 0.6 },
    { url: "/privacy", lastModified: "2026-05-29", changeFrequency: "monthly", priority: 0.5 },
    { url: "/termini", lastModified: "2026-05-29", changeFrequency: "monthly", priority: 0.5 },
  ];

  return routes.map((route) => ({
    url: `${SITE_URL}${route.url}`,
    lastModified: route.lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
