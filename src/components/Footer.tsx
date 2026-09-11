import { Image, Linking, Pressable, Text, View } from "react-native";
import { BMC_HREF, BMC_IMG, colors } from "../lib/constants";

export function Footer() {
  return (
    <View
      style={{
        width: "100%",
        marginTop: 24,
        paddingVertical: 24,
        borderTopWidth: 1,
        borderTopColor: "rgba(201,146,42,0.25)",
        gap: 12,
      }}
    >
      <Text style={{ color: colors.chocolate, fontSize: 13 }}>
        GFF is independent of Woolworths. Stock can lag the collector by up to 120 minutes.
      </Text>
      <Pressable onPress={() => Linking.openURL(BMC_HREF)} accessibilityRole="link">
        <Image source={{ uri: BMC_IMG }} style={{ height: 50, width: 220 }} resizeMode="contain" />
      </Pressable>
    </View>
  );
}
