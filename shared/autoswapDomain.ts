export type MatchRequest = {
  requestedVehicleType: "car" | "bike" | "any";
  fuelPreference: "ev" | "petrol" | "diesel" | "any";
  pickupLocation: string;
  emergencyDelivery: number;
};

export type MatchVehicle = {
  vehicleType: "car" | "bike";
  fuelType: "ev" | "petrol" | "diesel";
  city: string;
  status: string;
};

export function scoreVehicleMatch(request: MatchRequest, vehicle: MatchVehicle): number {
  if (vehicle.status !== "available") return -1;
  let score = 0;
  if (request.requestedVehicleType === "any" || request.requestedVehicleType === vehicle.vehicleType) score += 40;
  if (request.fuelPreference === "any" || request.fuelPreference === vehicle.fuelType) score += 30;
  if (request.pickupLocation.toLowerCase().includes(vehicle.city.toLowerCase()) || vehicle.city.toLowerCase().includes(request.pickupLocation.toLowerCase())) score += 25;
  if (request.emergencyDelivery === 1) score += 5;
  return score;
}

export function rankVehicleMatches<T extends MatchVehicle>(request: MatchRequest, vehicles: T[]): T[] {
  return vehicles.filter((vehicle) => scoreVehicleMatch(request, vehicle) >= 0).sort((a, b) => scoreVehicleMatch(request, b) - scoreVehicleMatch(request, a));
}
