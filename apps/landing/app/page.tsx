import { ContinuityRing } from "@couthealth/ui";

export default function Home() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "var(--sp-6)",
        textAlign: "center",
        padding: "var(--sp-8)",
      }}
    >
      <ContinuityRing progress={0.65} size={72} />
      <h1 className="display" style={{ fontSize: "var(--fs-display-md)" }}>
        CoutHealth
      </h1>
      <p style={{ color: "var(--text-secondary)", maxWidth: 480 }}>
        Fundação do monorepo no ar. A landing completa (3 direções) chega na Fase 2.
      </p>
    </main>
  );
}
