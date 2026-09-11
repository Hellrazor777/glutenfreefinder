import * as Location from "expo-location";
import { nearestPostcode, normalisePostcode } from "./geo";
import type { PostcodeRow } from "./types";

/** Only call from a postcode-field tap/focus — never on app load. */
export async function postcodeFromTap(postcodes: PostcodeRow[]): Promise<string | null> {
  const current = await Location.getForegroundPermissionsAsync();
  let status = current.status;
  if (status !== "granted") {
    const asked = await Location.requestForegroundPermissionsAsync();
    status = asked.status;
  }
  if (status !== "granted") return null;
  const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
  const places = await Location.reverseGeocodeAsync({
    latitude: pos.coords.latitude,
    longitude: pos.coords.longitude,
  });
  const fromGeo = normalisePostcode(places[0]?.postalCode ?? "");
  if (fromGeo) return fromGeo;
  const nearest = nearestPostcode(pos.coords.latitude, pos.coords.longitude, postcodes);
  return nearest?.postcode ?? null;
}
