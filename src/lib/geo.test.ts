import { describe, expect, it } from "vitest";
import { haversineKm, nearestPostcode, normalisePostcode, storesWithinRadius } from "./geo";

describe("geo", () => {
  it("normalises AU postcodes", () => {
    expect(normalisePostcode("2905")).toBe("2905");
    expect(normalisePostcode("29")).toBeNull();
  });

  it("finds stores near Calwell 2905", () => {
    const origin = { lat: -35.431169, lng: 149.111041 };
    const within = storesWithinRadius(
      origin,
      [
        { name: "Calwell", lat: -35.43462747, lng: 149.1144501 },
        { name: "Sydney", lat: -33.87, lng: 151.21 },
      ],
      20,
    );
    expect(within.map((s) => s.name)).toEqual(["Calwell"]);
  });

  it("picks the nearest postcode", () => {
    const hit = nearestPostcode(-35.43, 149.11, [
      { postcode: "2000", lat: -33.87, lng: 151.21 },
      { postcode: "2905", lat: -35.431, lng: 149.111 },
    ]);
    expect(hit?.postcode).toBe("2905");
  });

  it("Canberra to Sydney is hundreds of km", () => {
    expect(haversineKm(-35.28, 149.13, -33.87, 151.21)).toBeGreaterThan(200);
  });
});
