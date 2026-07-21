import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, ContinuityRing } from "@couthealth/ui";
import { clientApi } from "../../lib/api";
import { useAuth } from "../../lib/auth";
import { ClientLayout } from "./ClientLayout";

function formatDate(value?: string | null) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "long" });
}

function daysUntil(value?: string | null) {
  if (!value) return null;
  const diff = Math.ceil((new Date(value).getTime() - Date.now()) / 86400000);
  return diff;
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span style={{ textTransform: "uppercase", fontSize: "0.75rem", letterSpacing: "0.1em", color: "var(--text-secondary)" }}>{children}</span>
  );
}

export function DashboardPage() {
  const { user, accessToken } = useAuth();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    if (!accessToken) return;
    clientApi.dashboard(accessToken).then(setData);
  }, [accessToken]);

  const days = daysUntil(data?.nextReview);
  const ringProgress = days != null ? Math.max(0, Math.min(1, 1 - days / 30)) : 0.3;

  return (
    <ClientLayout title="Início">
      <p style={{ fontSize: "1.0625rem", color: "var(--text-secondary)", margin: "0 0 var(--sp-8)" }}>
        Bom dia, {user?.name?.split(" ")[0] ?? ""}. Hoje é {formatDate(new Date().toISOString())}.
      </p>

      <Card
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "var(--sp-6)",
          padding: "var(--sp-8)",
        }}
      >
        <div>
          <Eyebrow>Próxima revisão profissional</Eyebrow>
          <h2 className="display" style={{ fontSize: "1.5rem", margin: "10px 0 0" }}>
            {days != null ? (days <= 0 ? "Hoje" : `Em ${days} dia${days > 1 ? "s" : ""}`) : "A combinar"}
          </h2>
        </div>
        <ContinuityRing progress={ringProgress} size={80} strokeWidth={5} />
      </Card>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "var(--sp-6)" }}>
        <Card>
          <Eyebrow>Plano ativo</Eyebrow>
          <h3 style={{ fontSize: "1.125rem", fontWeight: 600, margin: "10px 0 20px" }}>
            {data?.subscription?.plan?.name ?? "Nenhum plano ativo"}
          </h3>
        </Card>

        <Link to="/app/nutricao" style={{ textDecoration: "none", color: "inherit" }}>
          <Card>
            <Eyebrow>Último plano alimentar</Eyebrow>
            <h3 style={{ fontSize: "1.125rem", fontWeight: 600, margin: "10px 0 20px" }}>{formatDate(data?.lastMealPlanPublishedAt)}</h3>
            <span style={{ fontSize: "0.9375rem", color: "var(--accent)", fontWeight: 600 }}>Ver plano →</span>
          </Card>
        </Link>

        <Link to="/app/treino" style={{ textDecoration: "none", color: "inherit" }}>
          <Card>
            <Eyebrow>Treinos publicados</Eyebrow>
            <h3 style={{ fontSize: "1.125rem", fontWeight: 600, margin: "10px 0 20px" }}>{data?.workoutsCount ?? 0}</h3>
            <span style={{ fontSize: "0.9375rem", color: "var(--accent)", fontWeight: 600 }}>Iniciar →</span>
          </Card>
        </Link>

        <Link to="/app/mensagens" style={{ textDecoration: "none", color: "inherit" }}>
          <Card>
            <Eyebrow>Últimas mensagens</Eyebrow>
            <p style={{ fontSize: "0.9375rem", color: "var(--text-primary)", margin: "10px 0 20px" }}>
              {data?.lastMessage?.body ?? "Sem mensagens ainda"}
            </p>
            <span style={{ fontSize: "0.9375rem", color: "var(--accent)", fontWeight: 600 }}>Abrir conversa →</span>
          </Card>
        </Link>

        <Link to="/app/notificacoes" style={{ textDecoration: "none", color: "inherit" }}>
          <Card>
            <Eyebrow>Notificações não lidas</Eyebrow>
            <h3 style={{ fontSize: "1.125rem", fontWeight: 600, margin: "10px 0 20px" }}>{data?.unreadNotifications?.length ?? 0}</h3>
          </Card>
        </Link>

        <Link to="/app/checkin" style={{ textDecoration: "none", color: "inherit" }}>
          <Card>
            <Eyebrow>Próximo check-in</Eyebrow>
            <h3 style={{ fontSize: "1.125rem", fontWeight: 600, margin: "10px 0 20px" }}>Disponível</h3>
            <span style={{ fontSize: "0.9375rem", color: "var(--accent)", fontWeight: 600 }}>Responder agora →</span>
          </Card>
        </Link>
      </div>
    </ClientLayout>
  );
}
