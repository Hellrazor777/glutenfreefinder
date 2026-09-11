import { useRef } from "react";

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
    <input
      id="gff-postcode"
      name="postal-code"
      aria-label="Australian postcode"
      inputMode="numeric"
      pattern="[0-9]{4}"
      maxLength={4}
      autoComplete="postal-code"
      enterKeyHint="search"
      placeholder="Postcode"
      value={value}
      onChange={(e) => onChange(e.target.value.replace(/\D/g, "").slice(0, 4))}
      onFocus={() => {
        if (!asked.current) {
          asked.current = true;
          onFocused();
        }
      }}
      style={{
        width: "100%",
        boxSizing: "border-box",
        minHeight: 44,
        fontSize: 18,
        letterSpacing: 4,
        padding: "10px 12px",
        borderRadius: 12,
        border: "1px solid rgba(201,146,42,0.45)",
        background: "#fff",
        color: "#2A1810",
      }}
    />
  );
}
