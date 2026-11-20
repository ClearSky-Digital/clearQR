import type { Metadata } from "next";
import { canonicalUrl, guideBySlug, isPlaceholderPage } from "./pages";

/** Title, description and canonical for one guide. A page with no copy yet is marked noindex. */
export function guideMetadata(slug: string): Metadata {
  const g = guideBySlug(slug);
  return {
    title: g.title,
    description: g.description,
    alternates: { canonical: canonicalUrl(slug) },
    robots: isPlaceholderPage(slug) ? { index: false, follow: false } : undefined,
  };
}
