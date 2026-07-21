export function LandingFooter({ variant = "dark" }: { variant?: "dark" | "light" }) {
  const dark = variant === "dark";
  return (
    <footer
      style={{
        padding: "var(--sp-8) var(--sp-6)",
        borderTop: dark ? "1px solid var(--border-hairline)" : "2px solid var(--ink-900)",
        textAlign: "center",
        color: dark ? "var(--text-tertiary)" : "var(--gray-500)",
        fontSize: "var(--fs-caption)",
      }}
    >
      <p>CoutHealth · Rafael Coutinho — Personal Trainer e Nutricionista</p>
      <div style={{ display: "flex", gap: "var(--sp-4)", justifyContent: "center", marginTop: "var(--sp-2)" }}>
        <a href="/politica-de-privacidade" style={{ color: "inherit" }}>Política de Privacidade</a>
        <a href="/termos-de-uso" style={{ color: "inherit" }}>Termos de Uso</a>
      </div>
    </footer>
  );
}
