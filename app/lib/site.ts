import { addCampaignTags } from "@/core";

/**
 * Links ClearQR shows in the page. They are plain links: nothing is fetched, and the page
 * sends no data anywhere. Values are fixed at build time.
 */
export const DEFAULT_CONTACT_URL = "https://cscloud.digital/start/";

const OUR_TAGS = { source: "clearqr", medium: "app" } as const;

/** An https address, or null. Anything else (empty, http, junk, credentials in the address) is ignored. */
export function cleanHttpsUrl(v: string | undefined | null): string | null {
  const s = (v ?? "").trim();
  if (!s) return null;
  try {
    const u = new URL(s);
    if (u.protocol !== "https:" || u.username || u.password || !u.hostname) return null;
    return s;
  } catch {
    return null;
  }
}

/** The tip link with our campaign tags, or null so the tip card stays hidden. */
export function tipLink(raw: string | undefined | null = process.env.NEXT_PUBLIC_CLEARQR_TIP_URL): string | null {
  const url = cleanHttpsUrl(raw);
  return url ? addCampaignTags(url, { ...OUR_TAGS, campaign: "tip" }) : null;
}

/** The "set it up for me" link with our campaign tags. */
export function setupLink(raw: string | undefined | null = process.env.NEXT_PUBLIC_CLEARQR_CONTACT_URL): string {
  const url = cleanHttpsUrl(raw) ?? DEFAULT_CONTACT_URL;
  return addCampaignTags(url, { ...OUR_TAGS, campaign: "setup-help" });
}
