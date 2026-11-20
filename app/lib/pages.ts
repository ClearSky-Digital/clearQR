import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * The guide pages of the site. The head words here are working words: deskWork's final title, description and
 * headline replace them at each page's copy gate. A page whose body file still holds the placeholder is kept
 * out of the sitemap and the navigation and is marked noindex, and a release build refuses it.
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_CLEARQR_SITE_URL || "https://clearqr.app").replace(/\/+$/, "");

export type ArtKind = "count" | "expire" | "compare" | "change";

export interface Guide {
  slug: string;
  nav: string;
  title: string;
  description: string;
  h1: string;
  lead: string;
  art: ArtKind;
}

export const GUIDES: readonly Guide[] = [
  {
    slug: "count-your-scans",
    nav: "Count your scans",
    title: "QR code tracking with your own analytics",
    description: "Add campaign tags to a QR code and read the visits each printed piece brings in your own analytics.",
    h1: "QR code tracking for a flyer: which one brought people in?",
    lead: "ClearQR tracks nothing; your own analytics counts.",
    art: "count",
  },
  {
    slug: "do-qr-codes-expire",
    nav: "Do QR codes expire?",
    title: "Do QR codes expire?",
    description: "When a QR code stops working, and what keeps one working.",
    h1: "Do QR codes expire?",
    lead: "A plain code keeps working. Here is what can change that.",
    art: "expire",
  },
  {
    slug: "static-vs-dynamic",
    nav: "Static vs dynamic",
    title: "Static vs dynamic QR code",
    description: "The difference between a code that holds its address and one that holds a short address forwarded for you.",
    h1: "Static vs dynamic QR code: what is inside the square?",
    lead: "The square holds an address. What happens after the scan is the difference.",
    art: "compare",
  },
  {
    slug: "changeable-code",
    nav: "Change a code later",
    title: "Make a QR code you can change yourself",
    description: "Put a short address on your own domain in the code, and send it wherever you like later.",
    h1: "Make a QR code you can change yourself",
    lead: "Print one code and decide later where it goes, using your own web address.",
    art: "change",
  },
];

export function guideBySlug(slug: string): Guide {
  const g = GUIDES.find((x) => x.slug === slug);
  if (!g) throw new Error(`No guide named ${slug}`);
  return g;
}

/** The address a page has on the public site (no base path: the site lives at the root of its own domain). */
export function canonicalUrl(slug: string): string {
  return slug ? `${SITE_URL}/${slug}/` : `${SITE_URL}/`;
}

/** True while the page's body file still uses the placeholder. Read from the source at build time. */
export function isPlaceholderPage(slug: string, root: string = process.cwd()): boolean {
  const file = join(root, "app", "content", `${slug}.tsx`);
  if (!existsSync(file)) return true;
  return readFileSync(file, "utf8").includes("<Placeholder");
}

/** The guides that have real copy. These are the only ones in the navigation and the sitemap. */
export function readyGuides(root: string = process.cwd()): Guide[] {
  return GUIDES.filter((g) => !isPlaceholderPage(g.slug, root));
}
