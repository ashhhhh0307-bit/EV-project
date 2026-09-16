export function rentalDays(startAt: Date, endAt: Date) {
  return Math.max(1, Math.ceil((endAt.getTime() - startAt.getTime()) / 86_400_000));
}

export function rentalTotalCents(dailyRateCents: number, startAt: Date, endAt: Date) {
  return rentalDays(startAt, endAt) * dailyRateCents;
}

export function isNearbyListing(city: string, pickupLocation: string) {
  const left = city.trim().toLowerCase();
  const right = pickupLocation.trim().toLowerCase();
  return Boolean(left && right && (right.includes(left) || left.includes(right)));
}
