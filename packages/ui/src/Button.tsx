import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost";

interface CommonProps {
  variant?: Variant;
}

export type ButtonProps = CommonProps &
  (
    | ({ href?: undefined } & ButtonHTMLAttributes<HTMLButtonElement>)
    | ({ href: string } & AnchorHTMLAttributes<HTMLAnchorElement>)
  );

const base: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  fontFamily: "var(--font-body)",
  fontWeight: 600,
  fontSize: "var(--fs-body-lg)",
  borderRadius: "var(--r-md)",
  padding: "12px 20px",
  cursor: "pointer",
  textDecoration: "none",
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

/** Renderiza como <a> quando `href` é passado (navegação, sem JS), ou <button> caso contrário. */
export function Button({ variant = "primary", style, ...props }: ButtonProps) {
  const combinedStyle = { ...base, ...variants[variant], ...style };

  if ("href" in props && props.href !== undefined) {
    const { href, ...anchorProps } = props;
    return <a href={href} style={combinedStyle} {...anchorProps} />;
  }

  const { disabled, ...buttonProps } = props as ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button
      {...buttonProps}
      disabled={disabled}
      style={{ ...combinedStyle, opacity: disabled ? 0.5 : 1, cursor: disabled ? "not-allowed" : "pointer" }}
    />
  );
}
