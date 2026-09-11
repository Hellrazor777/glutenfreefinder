import { useMemo, useState } from "react";
import { Alert, Pressable, ScrollView, Text, View } from "react-native";
import { Image } from "expo-image";
import { SafeAreaView } from "react-native-safe-area-context";
import { Footer } from "../src/components/Footer";
import { PostcodeField } from "../src/components/PostcodeField";
import { ProductCombobox } from "../src/components/ProductCombobox";
import { SearchForm } from "../src/components/SearchForm";
import { StoreRow } from "../src/components/StoreRow";
import {
  DEFAULT_RADIUS_KM,
  DEFAULT_STOCKCODE,
  RADIUS_OPTIONS,
  SIGHTING_LABELS,
  colors,
  type SightingLevel,
} from "../src/lib/constants";
import { normalisePostcode, storesWithinRadius } from "../src/lib/geo";
import { layout } from "../src/lib/layout";
import { postcodeFromTap } from "../src/lib/location";
import { addWatch } from "../src/lib/notify";
import { resolveWwStock } from "../src/lib/observations";
import { latestSighting, loadSightings, saveSighting } from "../src/lib/sightings-store";
import type { ObservationRow, PostcodeRow, SightingRow, StoreRow as Store } from "../src/lib/types";
import observationsJson from "../src/data/observations.json";
import postcodesJson from "../src/data/postcodes.json";
import productsJson from "../src/data/products.json";
import storesJson from "../src/data/stores.json";

const postcodes = postcodesJson as PostcodeRow[];
const stores = storesJson as Store[];
const products = productsJson as { stockcode: string; name: string; brand?: string; size?: string }[];
const seedObservations = observationsJson as ObservationRow[];

export default function HomeScreen() {
  const [postcode, setPostcode] = useState("");
  const [radiusKm, setRadiusKm] = useState<(typeof RADIUS_OPTIONS)[number]>(DEFAULT_RADIUS_KM);
  const [stockcode, setStockcode] = useState(DEFAULT_STOCKCODE);
  const [submitted, setSubmitted] = useState<string | null>(null);
  const [sightings, setSightings] = useState<SightingRow[]>([]);
  const [notice, setNotice] = useState<string | null>(null);

  const validPostcode = normalisePostcode(postcode);
  const origin = useMemo(
    () => postcodes.find((p) => p.postcode === validPostcode) ?? null,
    [validPostcode],
  );

  async function onPostcodeFocused() {
    const filled = await postcodeFromTap(postcodes).catch(() => null);
    if (filled) setPostcode(filled);
  }

  function onSubmit() {
    if (!validPostcode) return;
    setSubmitted(validPostcode);
    loadSightings().then(setSightings).catch(() => undefined);
  }

  const nearby =
    submitted && origin
      ? storesWithinRadius(origin, stores, radiusKm)
      : [];

  return (
    <SafeAreaView style={layout.page}>
      <ScrollView contentContainerStyle={[layout.shell, { paddingTop: 12, paddingBottom: 40 }]}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 16 }}>
          <Image source={require("../assets/gff-logo.png")} style={{ width: 44, height: 44 }} />
          <Text style={{ fontSize: 22, fontWeight: "800", letterSpacing: 1, color: colors.cocoa }}>GFF</Text>
        </View>

        <Text
          accessibilityRole="header"
          style={{ fontSize: 32, lineHeight: 38, fontWeight: "700", color: colors.cocoa, marginBottom: 16 }}
        >
          Find gluten-free stock
        </Text>

        <SearchForm onSubmit={onSubmit}>
          <PostcodeField value={postcode} onChange={setPostcode} onFocused={onPostcodeFocused} />
          <Pressable
            accessibilityRole="button"
            onPress={onSubmit}
            disabled={!validPostcode}
            style={[layout.button, !validPostcode ? { opacity: 0.5 } : null]}
          >
            <Text style={layout.buttonLabel}>Find stores</Text>
          </Pressable>
          <ProductCombobox
            products={products}
            value={stockcode}
            onChange={setStockcode}
            disabled={!validPostcode}
          />
          <View style={{ flexDirection: "row", gap: 8, width: "100%" }}>
            {RADIUS_OPTIONS.map((km) => (
              <Pressable
                key={km}
                onPress={() => setRadiusKm(km)}
                style={{
                  flex: 1,
                  minHeight: 44,
                  borderRadius: 999,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: radiusKm === km ? colors.cocoa : "#fff",
                  borderWidth: 1,
                  borderColor: "rgba(201,146,42,0.35)",
                }}
              >
                <Text style={{ color: radiusKm === km ? colors.cream : colors.chocolate }}>{km} km</Text>
              </Pressable>
            ))}
          </View>
        </SearchForm>

        {submitted && origin ? (
          <View style={{ marginTop: 20, width: "100%" }}>
            <Text style={{ fontSize: 20, fontWeight: "700", color: colors.cocoa, marginBottom: 12 }}>
              {origin.locality}, {origin.state} {submitted}
            </Text>
            {nearby.map((store) => {
              const obs = seedObservations.find(
                (o) => o.wwStoreId === store.wwStoreId && o.stockcode === stockcode,
              );
              const ww = resolveWwStock({ inStock: obs?.inStock, observedAt: obs?.observedAt });
              const sight = latestSighting(sightings, store.wwStoreId, stockcode);
              return (
                <StoreRow
                  key={store.wwStoreId}
                  name={store.name}
                  address={[store.address, store.suburb, store.state, store.postcode].filter(Boolean).join(", ")}
                  distanceKm={store.distanceKm}
                  ww={ww}
                  community={
                    sight
                      ? {
                          label: SIGHTING_LABELS[sight.level as SightingLevel] ?? sight.level,
                          sightedAt: new Date(sight.sightedAt).toLocaleString("en-AU"),
                          comment: sight.comment,
                        }
                      : null
                  }
                  onSighting={async (level, comment) => {
                    const next = await saveSighting({
                      wwStoreId: store.wwStoreId,
                      stockcode,
                      level,
                      comment: comment.trim() || null,
                      sightedAt: new Date().toISOString(),
                    });
                    setSightings(next);
                  }}
                  onNotify={async () => {
                    const result = await addWatch({ wwStoreId: store.wwStoreId, stockcode });
                    if (result.reason === "web") {
                      Alert.alert(
                        "GFF",
                        "Stock alerts use push on the Android app. Your watch was saved in this browser.",
                      );
                    } else if (result.ok) {
                      setNotice("We will tell you when this store is back in stock.");
                    }
                  }}
                />
              );
            })}
          </View>
        ) : null}

        {notice ? <Text style={{ color: colors.chocolate, marginTop: 8 }}>{notice}</Text> : null}
        <Footer />
      </ScrollView>
    </SafeAreaView>
  );
}
