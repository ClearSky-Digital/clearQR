import type { MetadataRoute } from "next";
import { canonicalUrl, readyGuides } from "./lib/pages";

export const dynamic = "force-static";

/** The generator and every guide that has real copy. A page still on the placeholder is left out. */
export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: canonicalUrl("") }, ...readyGuides().map((g) => ({ url: canonicalUrl(g.slug) }))];
}
