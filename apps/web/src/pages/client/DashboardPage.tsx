import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, ContinuityRing } from "@couthealth/ui";
import { clientApi } from "../../lib/api";
import { useAuth } from "../../lib/auth";
import { ClientLayout } from "./ClientLayout";

function formatDate(value?: string | null) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("pt-BR");
}

export function DashboardPage() {
  const { user, accessToken } = useAuth();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    if (!accessToken) return;
    clientApi.dashboard(accessToken).then(setData);
  }, [accessToken]);

  return (
    <ClientLayout>
      <div style={{ display: "flex", alignItems: "center", gap: "var(--sp-4)", marginBottom: "var(--sp-8)" }}>
        <ContinuityRing progress={0.7} size={56} />
        <div>
          <p style={{ color: "var(--text-tertiary)", fontSize: "var(--fs-caption)", margin: 0 }}>Olá,</p>
          <h1 className="display" style={{ fontSize: "var(--fs-display-sm)", margin: 0 }}>
            {user?.name?.split(" ")[0]}
          </h1>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "var(--sp-4)" }}>
        <Card>
          <p style={{ color: "var(--text-tertiary)", fontSize: "var(--fs-caption)", margin: 0 }}>Plano ativo</p>
          <p style={{ fontWeight: 600, margin: "4px 0 0" }}>{data?.subscription?.plan?.name ?? "Nenhum plano ativo"}</p>
        </Card>
        <Card>
          <p style={{ color: "var(--text-tertiary)", fontSize: "var(--fs-caption)", margin: 0 }}>Próxima revisão</p>
          <p style={{ fontWeight: 600, margin: "4px 0 0" }}>{formatDate(data?.nextReview)}</p>
        </Card>
        <Link to="/app/nutricao" style={{ textDecoration: "none" }}>
          <Card>
            <p style={{ color: "var(--text-tertiary)", fontSize: "var(--fs-caption)", margin: 0 }}>Último plano alimentar</p>
            <p style={{ fontWeight: 600, margin: "4px 0 0" }}>{formatDate(data?.lastMealPlanPublishedAt)}</p>
          </Card>
        </Link>
        <Link to="/app/treino" style={{ textDecoration: "none" }}>
          <Card>
            <p style={{ color: "var(--text-tertiary)", fontSize: "var(--fs-caption)", margin: 0 }}>Treinos publicados</p>
            <p style={{ fontWeight: 600, margin: "4px 0 0" }}>{data?.workoutsCount ?? 0}</p>
          </Card>
        </Link>
        <Link to="/app/mensagens" style={{ textDecoration: "none" }}>
          <Card>
            <p style={{ color: "var(--text-tertiary)", fontSize: "var(--fs-caption)", margin: 0 }}>Última mensagem</p>
            <p style={{ fontWeight: 600, margin: "4px 0 0" }}>{data?.lastMessage?.body ?? "Sem mensagens"}</p>
          </Card>
        </Link>
        <Link to="/app/notificacoes" style={{ textDecoration: "none" }}>
          <Card>
            <p style={{ color: "var(--text-tertiary)", fontSize: "var(--fs-caption)", margin: 0 }}>Notificações não lidas</p>
            <p style={{ fontWeight: 600, margin: "4px 0 0" }}>{data?.unreadNotifications?.length ?? 0}</p>
          </Card>
        </Link>
      </div>
    </ClientLayout>
  );
}
