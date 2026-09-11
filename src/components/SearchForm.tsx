import { ReactNode } from "react";
import { View } from "react-native";

export function SearchForm({ children }: { onSubmit: () => void; children: ReactNode }) {
  return <View style={{ width: "100%", gap: 12 }}>{children}</View>;
}
