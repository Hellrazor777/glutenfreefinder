import { describe, expect, it } from "vitest";
import { checkedLabel, resolveWwStock } from "./observations";

describe("timestamps and staleness", () => {
  const now = new Date("2026-09-11T12:00:00.000Z");

  it("labels checked N min ago", () => {
    expect(checkedLabel("2026-09-11T11:47:00.000Z", now)).toBe("checked 13 min ago");
  });

  it("flips past 120 minutes to Unknown", () => {
    const result = resolveWwStock({
      inStock: true,
      observedAt: "2026-09-11T09:00:00.000Z",
      now,
      freshnessMinutes: 120,
    });
    expect(result.status).toBe("unknown");
    expect(result.stale).toBe(true);
  });

  it("keeps In Stock while fresh", () => {
    expect(
      resolveWwStock({
        inStock: true,
        observedAt: "2026-09-11T11:00:00.000Z",
        now,
      }).status,
    ).toBe("in_stock");
  });
});
