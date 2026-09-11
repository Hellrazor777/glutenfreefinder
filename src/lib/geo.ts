const EARTH_KM = 6371;

export function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_KM * Math.asin(Math.min(1, Math.sqrt(a)));
}

export function normalisePostcode(raw: string): string | null {
  const digits = raw.replace(/\s+/g, "");
  return /^\d{4}$/.test(digits) ? digits : null;
}

export function nearestPostcode<T extends { lat: number; lng: number; postcode: string }>(
  lat: number,
  lng: number,
  postcodes: T[],
): T | null {
  if (!postcodes.length) return null;
  let best = postcodes[0];
  let bestKm = haversineKm(lat, lng, best.lat, best.lng);
  for (const row of postcodes) {
    const km = haversineKm(lat, lng, row.lat, row.lng);
    if (km < bestKm) {
      best = row;
      bestKm = km;
    }
  }
  return best;
}

export function storesWithinRadius<T extends { lat: number; lng: number }>(
  origin: { lat: number; lng: number },
  stores: T[],
  radiusKm: number,
): Array<T & { distanceKm: number }> {
  return stores
    .map((store) => ({
      ...store,
      distanceKm: haversineKm(origin.lat, origin.lng, store.lat, store.lng),
    }))
    .filter((store) => store.distanceKm <= radiusKm + 1e-9)
    .sort((a, b) => a.distanceKm - b.distanceKm);
}
