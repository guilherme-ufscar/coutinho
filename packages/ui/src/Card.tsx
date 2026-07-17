import type { HTMLAttributes } from "react";

export function Card({ style, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border-hairline)",
        borderRadius: "var(--r-lg)",
        boxShadow: "var(--elev)",
        padding: "var(--sp-6)",
        ...style,
      }}
    />
  );
}
