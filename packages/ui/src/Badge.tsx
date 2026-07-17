import type { HTMLAttributes } from "react";

type Tone = "accent" | "neutral";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: Tone;
}

export function Badge({ tone = "neutral", style, ...props }: BadgeProps) {
  return (
    <span
      {...props}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "var(--sp-2)",
        padding: "6px 12px",
        borderRadius: "var(--r-full)",
        fontSize: "var(--fs-caption)",
        fontWeight: 600,
        letterSpacing: "0.02em",
        background: tone === "accent" ? "rgba(247,190,0,0.12)" : "var(--bg-surface)",
        color: tone === "accent" ? "var(--accent)" : "var(--text-secondary)",
        border: `1px solid ${tone === "accent" ? "rgba(247,190,0,0.35)" : "var(--border-hairline)"}`,
        ...style,
      }}
    />
  );
}
