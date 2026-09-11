import { FRESHNESS_MINUTES, type WwStockStatus } from "./constants";

export function minutesAgo(iso: string | null | undefined, now = new Date()): number | null {
  if (!iso) return null;
  const then = new Date(iso);
  if (Number.isNaN(then.getTime())) return null;
  return Math.max(0, Math.round((now.getTime() - then.getTime()) / 60_000));
}

export function checkedLabel(iso: string | null | undefined, now = new Date()): string {
  const mins = minutesAgo(iso, now);
  if (mins === null) return "not checked yet";
  if (mins < 1) return "checked just now";
  if (mins === 1) return "checked 1 min ago";
  if (mins < 60) return `checked ${mins} min ago`;
  const hours = Math.round(mins / 60);
  return hours === 1 ? "checked 1 hr ago" : `checked ${hours} hr ago`;
}

export function resolveWwStock(opts: {
  inStock: boolean | null | undefined;
  observedAt: string | null | undefined;
  now?: Date;
  freshnessMinutes?: number;
}): { status: WwStockStatus; lastChecked: string | null; stale: boolean; label: string } {
  const freshness = opts.freshnessMinutes ?? FRESHNESS_MINUTES;
  const label = checkedLabel(opts.observedAt, opts.now);
  if (opts.inStock === null || opts.inStock === undefined || !opts.observedAt) {
    return { status: "unknown", lastChecked: null, stale: false, label };
  }
  const mins = minutesAgo(opts.observedAt, opts.now);
  const stale = mins !== null && mins > freshness;
  if (stale) {
    return { status: "unknown", lastChecked: opts.observedAt, stale: true, label };
  }
  return {
    status: opts.inStock ? "in_stock" : "out_of_stock",
    lastChecked: opts.observedAt,
    stale: false,
    label,
  };
}

export function wwStatusText(status: WwStockStatus): string {
  if (status === "in_stock") return "In Stock";
  if (status === "out_of_stock") return "Out of Stock";
  return "Unknown";
}
