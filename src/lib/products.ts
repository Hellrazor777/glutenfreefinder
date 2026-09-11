export type Product = {
  stockcode: string;
  name: string;
  brand?: string;
  size?: string;
};

export function filterProducts(products: Product[], query: string): Product[] {
  const q = query.trim().toLowerCase();
  if (!q) return products;
  return products.filter((p) =>
    `${p.name} ${p.brand ?? ""} ${p.size ?? ""} ${p.stockcode}`.toLowerCase().includes(q),
  );
}

export function productLabel(p: Product): string {
  return [p.name, p.size].filter(Boolean).join(" · ");
}
