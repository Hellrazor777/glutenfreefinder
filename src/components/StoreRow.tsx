import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { colors, SIGHTING_LABELS, type SightingLevel } from "../lib/constants";
import { wwStatusText, type resolveWwStock } from "../lib/observations";

type Ww = ReturnType<typeof resolveWwStock>;

const LEVELS: SightingLevel[] = ["plenty", "a_few", "one_left", "none"];

export function StoreRow({
  name,
  address,
  distanceKm,
  ww,
  community,
  onSighting,
  onNotify,
}: {
  name: string;
  address: string;
  distanceKm: number;
  ww: Ww;
  community: { label: string; sightedAt: string; comment?: string | null } | null;
  onSighting: (level: SightingLevel, comment: string) => void;
  onNotify: () => void;
}) {
  const [level, setLevel] = useState<SightingLevel>("a_few");
  const [comment, setComment] = useState("");
  const wwColor =
    ww.status === "in_stock" ? colors.sage : ww.status === "out_of_stock" ? colors.brick : colors.stone;

  return (
    <View
      style={{
        width: "100%",
        gap: 12,
        padding: 16,
        borderRadius: 16,
        backgroundColor: colors.cream,
        marginBottom: 12,
      }}
    >
      <Text style={{ fontSize: 18, fontWeight: "700", color: colors.cocoa }}>{name}</Text>
      <Text style={{ color: colors.stone, fontSize: 13 }}>
        {address} · {distanceKm.toFixed(1)} km
      </Text>
      <View style={{ flexDirection: "row", gap: 12, flexWrap: "wrap" }}>
        <View style={{ flex: 1, minWidth: 220, backgroundColor: colors.wwBg, borderRadius: 12, padding: 12 }}>
          <Text style={{ fontSize: 11, fontWeight: "700", letterSpacing: 1, color: colors.stone }}>
            WOOLWORTHS STOCK
          </Text>
          <Text style={{ marginTop: 4, fontSize: 18, fontWeight: "700", color: wwColor }}>
            {wwStatusText(ww.status)}
          </Text>
          <Text style={{ marginTop: 4, fontSize: 12, color: colors.stone }}>
            {ww.label}
            {ww.stale ? " · shown as Unknown because it is stale" : ""}
          </Text>
        </View>
        <View
          style={{
            flex: 1,
            minWidth: 220,
            backgroundColor: colors.shopperBg,
            borderRadius: 12,
            padding: 12,
            borderWidth: 1,
            borderStyle: "dashed",
            borderColor: colors.shopperBorder,
          }}
        >
          <Text style={{ fontSize: 11, fontWeight: "700", letterSpacing: 1, color: colors.stone }}>
            COMMUNITY SIGHTING
          </Text>
          <Text style={{ marginTop: 4, color: colors.chocolate, fontSize: 13 }}>
            {community
              ? `${community.label} · ${community.sightedAt}${community.comment ? ` — “${community.comment}”` : ""}`
              : "No shelf reports yet."}
          </Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
            {LEVELS.map((id) => (
              <Pressable
                key={id}
                onPress={() => setLevel(id)}
                style={{
                  minHeight: 44,
                  paddingHorizontal: 10,
                  borderRadius: 999,
                  justifyContent: "center",
                  backgroundColor: level === id ? colors.cocoa : "#fff",
                }}
              >
                <Text style={{ color: level === id ? colors.cream : colors.chocolate, fontSize: 12 }}>
                  {SIGHTING_LABELS[id]}
                </Text>
              </Pressable>
            ))}
          </View>
          <TextInput
            value={comment}
            onChangeText={(t) => setComment(t.slice(0, 280))}
            placeholder="Optional comment"
            style={{
              marginTop: 8,
              minHeight: 44,
              borderWidth: 1,
              borderColor: "rgba(201,146,42,0.35)",
              borderRadius: 8,
              paddingHorizontal: 8,
              backgroundColor: "#fff",
            }}
          />
          <Pressable
            onPress={() => onSighting(level, comment)}
            style={{ marginTop: 8, minHeight: 44, justifyContent: "center" }}
          >
            <Text style={{ color: colors.chocolate, fontWeight: "600" }}>Report sighting</Text>
          </Pressable>
        </View>
      </View>
      {ww.status !== "in_stock" ? (
        <Pressable onPress={onNotify} style={{ minHeight: 44, justifyContent: "center" }}>
          <Text style={{ color: colors.cocoa, fontWeight: "600" }}>Tell me when back in stock</Text>
        </Pressable>
      ) : null}
    </View>
  );
}
