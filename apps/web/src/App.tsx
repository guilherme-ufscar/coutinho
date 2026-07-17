import { Routes, Route, Navigate } from "react-router-dom";
import { ContinuityRing } from "@couthealth/ui";
import { RegisterPage } from "./pages/RegisterPage";
import { LoginPage } from "./pages/LoginPage";
import { AuthCallbackPage } from "./pages/AuthCallbackPage";
import { PlansPage } from "./pages/PlansPage";
import { CheckoutPage } from "./pages/CheckoutPage";
import { AnamnesisPage } from "./pages/anamnesis/AnamnesisPage";
import { DashboardPage } from "./pages/client/DashboardPage";
import { NutritionPage } from "./pages/client/NutritionPage";
import { WorkoutPage } from "./pages/client/WorkoutPage";
import { LibraryPage } from "./pages/client/LibraryPage";
import { MessagesPage } from "./pages/client/MessagesPage";
import { NotificationsPage } from "./pages/client/NotificationsPage";
import { EvolutionPage } from "./pages/client/EvolutionPage";
import { CheckInPage } from "./pages/client/CheckInPage";
import { ProfilePage } from "./pages/client/ProfilePage";
import { AdminDashboardPage } from "./pages/admin/AdminDashboardPage";
import { AdminClientDetailPage } from "./pages/admin/AdminClientDetailPage";
import { AdminFoodsPage } from "./pages/admin/AdminFoodsPage";
import { AdminExercisesPage } from "./pages/admin/AdminExercisesPage";
import { AdminLibraryPage } from "./pages/admin/AdminLibraryPage";
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
        path="/app"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/app/nutricao"
        element={
          <ProtectedRoute>
            <NutritionPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/app/treino"
        element={
          <ProtectedRoute>
            <WorkoutPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/app/biblioteca"
        element={
          <ProtectedRoute>
            <LibraryPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/app/mensagens"
        element={
          <ProtectedRoute>
            <MessagesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/app/evolucao"
        element={
          <ProtectedRoute>
            <EvolutionPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/app/checkin"
        element={
          <ProtectedRoute>
            <CheckInPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/app/notificacoes"
        element={
          <ProtectedRoute>
            <NotificationsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/app/perfil"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin"
        element={
          <ProtectedRoute role="PROFESSIONAL">
            <AdminDashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/clientes/:id"
        element={
          <ProtectedRoute role="PROFESSIONAL">
            <AdminClientDetailPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/alimentos"
        element={
          <ProtectedRoute role="PROFESSIONAL">
            <AdminFoodsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/exercicios"
        element={
          <ProtectedRoute role="PROFESSIONAL">
            <AdminExercisesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/biblioteca"
        element={
          <ProtectedRoute role="PROFESSIONAL">
            <AdminLibraryPage />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Placeholder title="Não encontrado" />} />
    </Routes>
  );
}
