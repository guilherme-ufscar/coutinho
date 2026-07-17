import { Routes, Route, Navigate } from "react-router-dom";
import { ContinuityRing } from "@couthealth/ui";

function Placeholder({ title }: { title: string }) {
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
      }}
    >
      <ContinuityRing progress={0.3} size={64} />
      <h1 className="display">{title}</h1>
      <p style={{ color: "var(--text-secondary)" }}>Módulos completos chegam nas próximas fases.</p>
    </main>
  );
}

export function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/app" replace />} />
      <Route path="/app/*" element={<Placeholder title="Área do cliente" />} />
      <Route path="/admin/*" element={<Placeholder title="Painel administrativo" />} />
      <Route path="*" element={<Placeholder title="Não encontrado" />} />
    </Routes>
  );
}
