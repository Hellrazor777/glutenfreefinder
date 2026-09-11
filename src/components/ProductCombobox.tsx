import { useMemo, useState } from "react";
import { FlatList, Pressable, Text, TextInput, View } from "react-native";
import { layout } from "../lib/layout";
import { colors } from "../lib/constants";
import { filterProducts, productLabel, type Product } from "../lib/products";

export function ProductCombobox({
  products,
  value,
  onChange,
  disabled,
}: {
  products: Product[];
  value: string;
  onChange: (stockcode: string) => void;
  disabled: boolean;
}) {
  const selected = products.find((p) => p.stockcode === value);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => filterProducts(products, query), [products, query]);

  return (
    <View style={{ width: "100%" }}>
      <TextInput
        accessibilityRole="combobox"
        accessibilityState={{ expanded: open, disabled }}
        accessibilityLabel="Product"
        editable={!disabled}
        placeholder={disabled ? "Enter a postcode first" : "Product"}
        value={disabled ? "" : open || query ? query : selected ? productLabel(selected) : ""}
        onChangeText={(t) => {
          setQuery(t);
          setOpen(true);
        }}
        onFocus={() => {
          if (!disabled) setOpen(true);
        }}
        style={[layout.control, disabled ? { backgroundColor: "#f3eee4" } : null]}
      />
      {open && !disabled ? (
        <FlatList
          data={filtered}
          keyExtractor={(p) => p.stockcode}
          style={{ maxHeight: 240, borderWidth: 1, borderColor: "rgba(201,146,42,0.45)", borderRadius: 12, marginTop: 4 }}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => {
                onChange(item.stockcode);
                setQuery("");
                setOpen(false);
              }}
              style={{ minHeight: 44, paddingHorizontal: 12, justifyContent: "center" }}
            >
              <Text style={{ color: colors.ink }}>{productLabel(item)}</Text>
            </Pressable>
          )}
        />
      ) : null}
    </View>
  );
}
