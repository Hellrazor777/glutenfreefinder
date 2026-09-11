export const DEFAULT_STOCKCODE = "6067883";
export const DEFAULT_RADIUS_KM = 20;
export const RADIUS_OPTIONS = [20, 50, 100] as const;
export const FRESHNESS_MINUTES = 120;
export const COMMENT_MAX = 280;
export const CONTACT_UA =
  "GFF/1.0 (+https://www.glutenfreefinder.online; contact@glutenfreefinder.online)";
export const BMC_HREF = "https://www.buymeacoffee.com/glutenfreefinder";
export const BMC_IMG =
  "https://img.buymeacoffee.com/button-api/?text=Buy me a slice of cake&emoji=🍰&slug=glutenfreefinder&button_colour=FFDD00&font_colour=000000&font_family=Poppins&outline_colour=000000&coffee_colour=ffffff";

export const SIGHTING_LEVELS = ["plenty", "a_few", "one_left", "none"] as const;
export type SightingLevel = (typeof SIGHTING_LEVELS)[number];
export type WwStockStatus = "in_stock" | "out_of_stock" | "unknown";

export const SIGHTING_LABELS: Record<SightingLevel, string> = {
  plenty: "Plenty",
  a_few: "A Few",
  one_left: "One Left",
  none: "None",
};

export const colors = {
  parchment: "#F6EFE2",
  cream: "#FFF8EE",
  ink: "#2A1810",
  chocolate: "#5A3214",
  cocoa: "#3D2416",
  gold: "#C9922A",
  sage: "#3F6B45",
  brick: "#A33B32",
  stone: "#7A7067",
  wwBg: "#F3E6D0",
  shopperBg: "#FFFDF8",
  shopperBorder: "#C9922A",
};
