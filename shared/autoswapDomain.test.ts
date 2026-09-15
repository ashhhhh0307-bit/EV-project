import { describe, expect, it } from "vitest";
import { rankVehicleMatches, scoreVehicleMatch } from "./autoswapDomain";

describe("AutoSwap vehicle matching", () => {
  it("scores compatible available vehicles above unavailable vehicles", () => {
    const request = { requestedVehicleType: "car" as const, fuelPreference: "ev" as const, pickupLocation: "Bengaluru", emergencyDelivery: 1 };
    expect(scoreVehicleMatch(request, { vehicleType: "car", fuelType: "ev", city: "Bengaluru", status: "available" })).toBe(100);
    expect(scoreVehicleMatch(request, { vehicleType: "car", fuelType: "ev", city: "Bengaluru", status: "rented" })).toBe(-1);
  });

  it("ranks a same-city, same-fuel vehicle first", () => {
    const request = { requestedVehicleType: "any" as const, fuelPreference: "any" as const, pickupLocation: "Pune", emergencyDelivery: 0 };
    const vehicles = [
      { id: 1, vehicleType: "car" as const, fuelType: "petrol" as const, city: "Bengaluru", status: "available" },
      { id: 2, vehicleType: "bike" as const, fuelType: "ev" as const, city: "Pune", status: "available" },
    ];
    expect(rankVehicleMatches(request, vehicles).map((vehicle) => vehicle.id)).toEqual([2, 1]);
  });
});
