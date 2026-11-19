export type StylePreset = {
  dotColor: string;
  cornerColor: string;
  backgroundColor: string;
  dotShape: "square" | "rounded" | "dot";
  cornerStyle: "square" | "rounded" | "circle";
  quietZone: number;
  errorCorrection: "L" | "M" | "Q" | "H";
};

/** Ready-made looks. Every preset keeps strong contrast so it scans. */
export const PRESETS = {
  classic: {
    label: "Classic",
    dotColor: "#000000",
    cornerColor: "#000000",
    backgroundColor: "#FFFFFF",
    dotShape: "square",
    cornerStyle: "square",
    quietZone: 4,
    errorCorrection: "M",
  },
  sky: {
    label: "Sky",
    dotColor: "#1879A3",
    cornerColor: "#145F80",
    backgroundColor: "#FFFFFF",
    dotShape: "rounded",
    cornerStyle: "rounded",
    quietZone: 4,
    errorCorrection: "Q",
  },
  sunset: {
    label: "Sunset",
    dotColor: "#1C1F26",
    cornerColor: "#C25E12",
    backgroundColor: "#FFF8F0",
    dotShape: "dot",
    cornerStyle: "circle",
    quietZone: 4,
    errorCorrection: "Q",
  },
  soft: {
    label: "Soft",
    dotColor: "#25272E",
    cornerColor: "#1879A3",
    backgroundColor: "#EAF6FC",
    dotShape: "rounded",
    cornerStyle: "rounded",
    quietZone: 4,
    errorCorrection: "M",
  },
  dots: {
    label: "Dots",
    dotColor: "#145F80",
    cornerColor: "#145F80",
    backgroundColor: "#FFFFFF",
    dotShape: "dot",
    cornerStyle: "circle",
    quietZone: 4,
    errorCorrection: "Q",
  },
  ink: {
    label: "Ink",
    dotColor: "#1C1F26",
    cornerColor: "#1C1F26",
    backgroundColor: "#FFFFFF",
    dotShape: "rounded",
    cornerStyle: "square",
    quietZone: 4,
    errorCorrection: "M",
  },
} as const satisfies Record<string, StylePreset & { label: string }>;

export type PresetName = keyof typeof PRESETS;
export const PRESET_NAMES = Object.keys(PRESETS) as [PresetName, ...PresetName[]];
