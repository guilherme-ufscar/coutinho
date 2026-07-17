import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

const base: React.CSSProperties = {
  fontFamily: "var(--font-body)",
  fontWeight: 600,
  fontSize: "var(--fs-body-lg)",
  borderRadius: "var(--r-md)",
  padding: "12px 20px",
  cursor: "pointer",
  transition: "background var(--motion-fast), border-color var(--motion-fast), opacity var(--motion-fast)",
  border: "1px solid transparent",
};

const variants: Record<Variant, React.CSSProperties> = {
  primary: {
    background: "var(--accent-grad, var(--accent))",
    color: "var(--text-on-accent)",
  },
  secondary: {
    background: "transparent",
    color: "var(--text-primary)",
    borderColor: "var(--border-hairline)",
  },
  ghost: {
    background: "transparent",
    color: "var(--text-secondary)",
  },
};

export function Button({ variant = "primary", style, disabled, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled}
      style={{
        ...base,
        ...variants[variant],
        opacity: disabled ? 0.5 : 1,
        cursor: disabled ? "not-allowed" : "pointer",
        ...style,
      }}
    />
  );
}
