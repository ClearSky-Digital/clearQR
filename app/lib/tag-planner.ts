/** The planner on the "Count your scans" page. It builds words only: no address field, nothing sent or stored. */
import { CAMPAIGN_PRESETS } from "./forms";

export const PLACES: string[] = [...CAMPAIGN_PRESETS.map((p) => p.label), "Other"];
export const EXAMPLE_NAMES = ["open-house", "fall-fair", "pickup-promo", "first-week", "spring-sale", "grand-opening"] as const;
export const MAX_TAG = 100;

export type PlanRow = { place: string; copies: number | null; campaign: string };

export function tooLong(name: string): boolean {
  return name.length > MAX_TAG;
}

/** One row per ticked place, in the order of PLACES. `copies` is blank until a number is typed. */
export function planRows(ticked: Record<string, boolean>, copies: Record<string, string>, campaign: string): PlanRow[] {
  const name = campaign.trim();
  return PLACES.filter((p) => ticked[p]).map((p) => {
    const n = Number.parseInt(copies[p] ?? "", 10);
    return { place: p, copies: Number.isFinite(n) && n > 0 ? n : null, campaign: name };
  });
}

export function rowText(r: PlanRow): string {
  const head = r.copies ? `${r.place}, ${r.copies} copies.` : `${r.place}.`;
  const fill = r.campaign
    ? ` In ClearQR, fill the source and medium pair, then the campaign: ${r.campaign}. Content: leave blank or add a word. Check this row in analytics: Session campaign = ${r.campaign}.`
    : " In ClearQR, fill the source and medium pair. Campaign and content are optional.";
  return head + fill;
}

export function listText(rows: PlanRow[]): string {
  return rows.map(rowText).join("\n");
}
