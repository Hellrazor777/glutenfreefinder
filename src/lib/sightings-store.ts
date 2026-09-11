import AsyncStorage from "@react-native-async-storage/async-storage";
import type { SightingRow } from "./types";

const KEY = "gff.sightings";

export async function loadSightings(): Promise<SightingRow[]> {
  const raw = await AsyncStorage.getItem(KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as SightingRow[];
  } catch {
    return [];
  }
}

export async function saveSighting(row: SightingRow): Promise<SightingRow[]> {
  const all = await loadSightings();
  const next = [row, ...all];
  await AsyncStorage.setItem(KEY, JSON.stringify(next));
  return next;
}

export function latestSighting(
  rows: SightingRow[],
  wwStoreId: string,
  stockcode: string,
): SightingRow | undefined {
  return rows.find((r) => r.wwStoreId === wwStoreId && r.stockcode === stockcode);
}
