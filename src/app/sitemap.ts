import type { MetadataRoute } from "next";
import { getAllArticles } from "@/lib/articles";
import { getAllLabs } from "@/lib/labs";
import { getPublishedCourses } from "@/lib/courses";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [articles, labs, courses] = await Promise.all([
    getAllArticles(),
    getAllLabs(),
    getPublishedCourses(),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteUrl, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/labs`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${siteUrl}/articles`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${siteUrl}/learn`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${siteUrl}/contact`, changeFrequency: "monthly", priority: 0.5 },
  ];

  const articleRoutes: MetadataRoute.Sitemap = articles.map((a) => ({
    url: `${siteUrl}/articles/${a.slug}`,
    lastModified: a.date,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const labRoutes: MetadataRoute.Sitemap = labs.map((l) => ({
    url: `${siteUrl}/labs/${l.slug}`,
    lastModified: l.date,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const courseRoutes: MetadataRoute.Sitemap = courses.map((c) => ({
    url: `${siteUrl}/learn/${c.slug}`,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...articleRoutes, ...labRoutes, ...courseRoutes];
}
