import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";

const WATCH_KEY = "gff.watch";

export type Watch = { wwStoreId: string; stockcode: string };

export async function listWatches(): Promise<Watch[]> {
  const raw = await AsyncStorage.getItem(WATCH_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as Watch[];
  } catch {
    return [];
  }
}

export async function addWatch(watch: Watch): Promise<{ ok: boolean; reason?: string }> {
  if (Platform.OS === "web") {
    const next = [...(await listWatches()).filter((w) => w.wwStoreId !== watch.wwStoreId), watch];
    await AsyncStorage.setItem(WATCH_KEY, JSON.stringify(next));
    return { ok: false, reason: "web" };
  }
  const existing = await Notifications.getPermissionsAsync();
  let status = existing.status;
  if (status !== "granted") {
    const asked = await Notifications.requestPermissionsAsync();
    status = asked.status;
  }
  if (status !== "granted") return { ok: false, reason: "denied" };
  const next = [...(await listWatches()).filter((w) => w.wwStoreId !== watch.wwStoreId), watch];
  await AsyncStorage.setItem(WATCH_KEY, JSON.stringify(next));
  return { ok: true };
}

export async function notifyIfBackInStock(watches: Watch[], inStockIds: string[]) {
  if (Platform.OS === "web") return;
  for (const watch of watches) {
    if (!inStockIds.includes(watch.wwStoreId)) continue;
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "GFF",
        body: "That product is back in stock at a store you watch.",
      },
      trigger: null,
    });
  }
}
