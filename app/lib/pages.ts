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
  /** Hero lines under the headline, when the copy has more than the lead, and the jump button that follows them. */
  lines?: string[];
  jump?: { label: string; to: string };
  art: ArtKind;
}

export const GUIDES: readonly Guide[] = [
  {
    slug: "count-your-scans",
    nav: "Count your scans",
    title: "QR Code Tracking With Your Own Analytics: Count Flyer Scans",
    description:
      "Track QR code scans with your own Google Analytics. Give each flyer its own tag, then see which one brought visits. Your analytics does the counting.",
    h1: "QR code tracking for a flyer: which one brought people in?",
    lead: "ClearQR tracks nothing; your own analytics counts.",
    lines: [
      "ClearQR tracks nothing; your own analytics counts.",
      "If your page has Google Analytics, the numbers show up there as visits from each piece of paper.",
    ],
    jump: { label: "Follow the bakery", to: "#bakery" },
    art: "count",
  },
  {
    slug: "do-qr-codes-expire",
    nav: "Do QR codes expire?",
    title: "Do QR Codes Expire? What Stops a Printed Code",
    description:
      "Do QR codes expire? A code that holds its own address keeps working while it can be read and the page it opens is still there.",
    h1: "Do QR codes expire? Only when something around them stops.",
    lead: "A code that holds its own address keeps working while the print stays readable and its page stays up.",
    lines: [
      "A code that holds its own address keeps working while the print stays readable and its page stays up.",
      "Three things can stop one: the print, the page it opens, or a service holding it for you.",
    ],
    jump: { label: "Check my code", to: "#check" },
    art: "expire",
  },
  {
    slug: "static-vs-dynamic",
    nav: "Static vs dynamic",
    title: "Static vs Dynamic QR Code: What Is Inside the Square",
    description:
      "Static vs dynamic QR code: see what the square holds and what you can change after printing, then pick the one that fits your page.",
    h1: "Static vs dynamic QR code: what is inside the square?",
    lead: "A QR code holds either the page address itself or a short address that a middle step forwards.",
    lines: [
      "A QR code holds either the page address itself or a short address that a middle step forwards.",
      "The next section opens the square and shows who holds each part.",
    ],
    jump: { label: "See inside", to: "#inside" },
    art: "compare",
  },
  {
    slug: "changeable-code",
    nav: "Change a code later",
    title: "Change QR Code Destination Without Reprinting",
    description:
      "Change QR code destination without reprinting: put a short address on your own domain, then change where that address forwards. ClearQR makes the square.",
    h1: "Change where a QR code goes without reprinting it",
    lead: "The printed square holds a short address on your own domain, and to change the destination you change where that address forwards.",
    lines: [
      "The printed square holds a short address on your own domain, and to change the destination you change where that address forwards.",
      "ClearQR makes the square; your own domain does the forwarding.",
    ],
    jump: { label: "How to set it up", to: "#setup" },
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
