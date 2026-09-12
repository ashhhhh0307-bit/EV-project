export type RegistrationDraft = {
  ownerName?: string;
  email?: string;
  manufacturer?: string;
  model?: string;
  modelYear?: number;
  vin?: string;
  batteryCapacity?: number;
  usableCapacity?: number;
  requiredDocuments?: number;
  uploadedDocuments?: number;
};

/** Basic VIN shape validation; excludes the ambiguous I/O/Q characters. */
export function isValidVin(value: string): boolean {
  return /^[A-HJ-NPR-Z0-9]{17}$/i.test(value.trim());
}

/** Battery usable capacity cannot exceed the pack's nominal capacity. */
export function hasValidBatteryCapacities(capacity?: number, usableCapacity?: number): boolean {
  if (capacity == null || usableCapacity == null) return true;
  return capacity > 0 && usableCapacity > 0 && usableCapacity <= capacity;
}

/** Return a 0–100 completeness score for the five-step registration flow. */
export function registrationCompleteness(draft: RegistrationDraft): number {
  const checks = [
    Boolean(draft.ownerName && draft.email),
    Boolean(draft.manufacturer && draft.model && draft.modelYear && isValidVin(draft.vin ?? "")),
    Boolean(draft.batteryCapacity && hasValidBatteryCapacities(draft.batteryCapacity, draft.usableCapacity)),
    (draft.requiredDocuments ?? 0) > 0 && (draft.uploadedDocuments ?? 0) >= (draft.requiredDocuments ?? 0),
  ];
  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
}
