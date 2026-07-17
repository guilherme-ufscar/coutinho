const links = [
  { href: "/", label: "A · Cinematográfica" },
  { href: "/v2", label: "B · Clínica premium" },
  { href: "/v3", label: "C · Editorial clara" },
];

/** Navegação temporária pra comparar as 3 direções antes da escolha final (escopo.md Fase 2). */
export function VariantSwitcher({ current }: { current: "/" | "/v2" | "/v3" }) {
  return (
    <div
      style={{
        position: "fixed",
        bottom: 16,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 50,
        display: "flex",
        gap: 4,
        padding: 4,
        borderRadius: "var(--r-full)",
        background: "rgba(23,24,27,0.9)",
        backdropFilter: "blur(8px)",
        border: "1px solid var(--border-hairline)",
      }}
    >
      {links.map((link) => (
        <a
          key={link.href}
          href={link.href}
          style={{
            padding: "8px 14px",
            borderRadius: "var(--r-full)",
            fontSize: "var(--fs-caption)",
            fontWeight: 600,
            textDecoration: "none",
            background: current === link.href ? "var(--accent)" : "transparent",
            color: current === link.href ? "var(--ink-900)" : "var(--gray-100)",
          }}
        >
          {link.label}
        </a>
      ))}
    </div>
  );
}
