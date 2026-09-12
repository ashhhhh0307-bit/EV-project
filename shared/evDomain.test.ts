import { describe, expect, it } from "vitest";
import { hasValidBatteryCapacities, isValidVin, registrationCompleteness } from "./evDomain";

describe("EV domain rules", () => {
  it("accepts a 17-character VIN without ambiguous characters", () => {
    expect(isValidVin("YS3D7N3M8SA1426AA")).toBe(true);
    expect(isValidVin("YS3D7N3M8SA1426AI")).toBe(false);
    expect(isValidVin("too-short")).toBe(false);
  });

  it("keeps usable battery capacity below the nominal pack capacity", () => {
    expect(hasValidBatteryCapacities(100, 94)).toBe(true);
    expect(hasValidBatteryCapacities(100, 104)).toBe(false);
    expect(hasValidBatteryCapacities(undefined, undefined)).toBe(true);
  });

  it("scores a complete draft at 100 and an incomplete draft lower", () => {
    expect(registrationCompleteness({
      ownerName: "Arjun Rao",
      email: "arjun.rao@example.com",
      manufacturer: "Polestar",
      model: "Polestar 4",
      modelYear: 2025,
      vin: "YS3D7N3M8SA1426AA",
      batteryCapacity: 100,
      usableCapacity: 94,
      requiredDocuments: 2,
      uploadedDocuments: 2,
    })).toBe(100);

    expect(registrationCompleteness({ ownerName: "Arjun Rao", email: "arjun.rao@example.com" })).toBe(25);
  });
});
