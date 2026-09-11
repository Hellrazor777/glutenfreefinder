import { FormEvent, ReactNode } from "react";

export function SearchForm({
  onSubmit,
  children,
}: {
  onSubmit: () => void;
  children: ReactNode;
}) {
  return (
    <form
      onSubmit={(e: FormEvent) => {
        e.preventDefault();
        onSubmit();
      }}
      style={{ width: "100%", display: "flex", flexDirection: "column", gap: 12 }}
    >
      {children}
    </form>
  );
}
