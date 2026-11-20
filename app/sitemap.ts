import type { MetadataRoute } from "next";
import { canonicalUrl, readyGuides } from "./lib/pages";

export const dynamic = "force-static";

/** The home, the generator and every guide that has real copy. A page still on the placeholder is left out. */
export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: canonicalUrl("") }, { url: canonicalUrl("make") }, ...readyGuides().map((g) => ({ url: canonicalUrl(g.slug) }))];
}
