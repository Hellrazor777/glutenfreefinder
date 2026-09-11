import { KeyboardEvent, useMemo, useState } from "react";
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
  const listId = "gff-product-listbox";
  const selected = products.find((p) => p.stockcode === value);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const filtered = useMemo(() => filterProducts(products, query), [products, query]);
  const activeItem = filtered[active];

  function choose(p: Product) {
    onChange(p.stockcode);
    setQuery("");
    setOpen(false);
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (disabled) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      setActive((i) => Math.min(filtered.length - 1, i + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setOpen(true);
      setActive((i) => Math.max(0, i - 1));
    } else if (e.key === "Enter" && open && activeItem) {
      e.preventDefault();
      choose(activeItem);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div style={{ width: "100%", position: "relative" }}>
      <input
        id="gff-product-combobox"
        role="combobox"
        aria-expanded={open}
        aria-controls={listId}
        aria-activedescendant={open && activeItem ? `gff-opt-${activeItem.stockcode}` : undefined}
        aria-autocomplete="list"
        aria-label="Product"
        disabled={disabled}
        placeholder={disabled ? "Enter a postcode first" : "Product"}
        value={disabled ? "" : open || query ? query : selected ? productLabel(selected) : ""}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
          setActive(0);
        }}
        onFocus={() => {
          if (!disabled) setOpen(true);
        }}
        onKeyDown={onKeyDown}
        style={{
          width: "100%",
          boxSizing: "border-box",
          minHeight: 44,
          fontSize: 16,
          padding: "10px 12px",
          borderRadius: 12,
          border: "1px solid rgba(201,146,42,0.45)",
          background: disabled ? "#f3eee4" : "#fff",
          color: "#2A1810",
        }}
      />
      {open && !disabled && (
        <ul
          id={listId}
          role="listbox"
          style={{
            listStyle: "none",
            margin: 4,
            padding: 0,
            position: "absolute",
            left: 0,
            right: 0,
            zIndex: 5,
            background: "#fff",
            border: "1px solid rgba(201,146,42,0.45)",
            borderRadius: 12,
            maxHeight: 240,
            overflowY: "auto",
          }}
        >
          {filtered.map((p, i) => (
            <li
              key={p.stockcode}
              id={`gff-opt-${p.stockcode}`}
              role="option"
              aria-selected={p.stockcode === value}
              onMouseDown={(e) => {
                e.preventDefault();
                choose(p);
              }}
              style={{
                minHeight: 44,
                padding: "10px 12px",
                cursor: "pointer",
                background: i === active ? "#F6EFE2" : "#fff",
              }}
            >
              {productLabel(p)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
