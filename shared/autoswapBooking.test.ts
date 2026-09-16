import { describe, expect, it } from "vitest";
import { isNearbyListing, rentalDays, rentalTotalCents } from "./autoswapBooking";

describe("AutoSwap booking helpers", () => {
  const start = new Date("2026-09-16T10:00:00Z");
  const end = new Date("2026-09-18T10:00:00Z");

  it("calculates inclusive rental days and total", () => {
    expect(rentalDays(start, end)).toBe(2);
    expect(rentalTotalCents(240000, start, end)).toBe(480000);
  });

  it("matches a saved listing to a nearby pickup city", () => {
    expect(isNearbyListing("Bengaluru", "Indiranagar, Bengaluru")).toBe(true);
    expect(isNearbyListing("Bengaluru", "Chennai")).toBe(false);
  });
});
