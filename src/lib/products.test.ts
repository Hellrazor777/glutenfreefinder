import { describe, expect, it } from "vitest";
import { filterProducts } from "./products";

describe("product combobox filter", () => {
  const products = [
    { stockcode: "6067883", name: "Woolworths Free From Gluten Chocolate Mud Cake", size: "600g" },
    { stockcode: "1", name: "Other loaf" },
  ];
  it("filters by typed text", () => {
    expect(filterProducts(products, "mud").map((p) => p.stockcode)).toEqual(["6067883"]);
    expect(filterProducts(products, "6067883")).toHaveLength(1);
  });
});
