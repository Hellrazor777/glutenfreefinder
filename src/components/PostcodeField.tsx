import { useRef } from "react";
import { TextInput } from "react-native";
import { layout } from "../lib/layout";

export function PostcodeField({
  value,
  onChange,
  onFocused,
}: {
  value: string;
  onChange: (next: string) => void;
  onFocused: () => void;
}) {
  const asked = useRef(false);
  return (
    <TextInput
      accessibilityLabel="Australian postcode"
      value={value}
      onChangeText={(t) => onChange(t.replace(/\D/g, "").slice(0, 4))}
      onFocus={() => {
        if (!asked.current) {
          asked.current = true;
          onFocused();
        }
      }}
      keyboardType="number-pad"
      inputMode="numeric"
      maxLength={4}
      autoComplete="postal-code"
      enterKeyHint="search"
      placeholder="Postcode"
      style={layout.control}
    />
  );
}
