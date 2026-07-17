import { Routes, Route, Navigate } from "react-router-dom";
import { ContinuityRing } from "@couthealth/ui";
import { RegisterPage } from "./pages/RegisterPage";
import { LoginPage } from "./pages/LoginPage";
import { AuthCallbackPage } from "./pages/AuthCallbackPage";
import { PlansPage } from "./pages/PlansPage";
import { CheckoutPage } from "./pages/CheckoutPage";
import { AnamnesisPage } from "./pages/anamnesis/AnamnesisPage";
import { ProtectedRoute } from "./lib/ProtectedRoute";

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

      <Route path="/criar-conta" element={<RegisterPage />} />
      <Route path="/entrar" element={<LoginPage />} />
      <Route path="/auth/callback" element={<AuthCallbackPage />} />
      <Route
        path="/planos"
        element={
          <ProtectedRoute>
            <PlansPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/checkout"
        element={
          <ProtectedRoute>
            <CheckoutPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/anamnese"
        element={
          <ProtectedRoute>
            <AnamnesisPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/app/*"
        element={
          <ProtectedRoute>
            <Placeholder title="Área do cliente" />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute role="PROFESSIONAL">
            <Placeholder title="Painel administrativo" />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Placeholder title="Não encontrado" />} />
    </Routes>
  );
}
