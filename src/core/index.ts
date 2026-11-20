export * from "./schema";
export * from "./presets";
export { buildPayload, escapeText, escapeWifi, foldLine } from "./payload";
export { renderSvg, effectiveEcc } from "./render";
export { verify } from "./verify";
export type { Rasterizer, Pixels, VerifyResult } from "./verify";
export { addCampaignTags, applyCampaign, campaignSchema } from "./tracking";
export type { Campaign } from "./tracking";
