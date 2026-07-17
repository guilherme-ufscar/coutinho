import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Badge, Card } from "@couthealth/ui";
import { adminApi, type ClientListItem } from "../../lib/api";
import { useAuth } from "../../lib/auth";
import { AdminLayout } from "./AdminLayout";

const statusLabel: Record<string, { label: string; tone: "accent" | "neutral" }> = {
  RASCUNHO: { label: "Anamnese em rascunho", tone: "neutral" },
  ENVIADA: { label: "Anamnese enviada — pendente de análise", tone: "accent" },
  ANALISADA: { label: "Anamnese analisada", tone: "neutral" },
};

export function AdminDashboardPage() {
  const { accessToken } = useAuth();
  const [clients, setClients] = useState<ClientListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!accessToken) return;
    adminApi
      .listClients(accessToken)
      .then(setClients)
      .finally(() => setLoading(false));
  }, [accessToken]);

  const pending = clients.filter((c) => c.anamnesis?.status === "ENVIADA");

  return (
    <AdminLayout>
      <h1 className="display" style={{ fontSize: "var(--fs-display-sm)", marginBottom: "var(--sp-2)" }}>
        Clientes
      </h1>
      <p style={{ color: "var(--text-secondary)", marginBottom: "var(--sp-8)" }}>
        {pending.length > 0 ? `${pending.length} anamnese(s) aguardando análise.` : "Nenhuma anamnese pendente no momento."}
      </p>

      {loading ? (
        <p style={{ color: "var(--text-secondary)" }}>Carregando…</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-3)" }}>
          {clients.map((client) => {
            const status = statusLabel[client.anamnesis?.status ?? "RASCUNHO"];
            return (
              <Link key={client.id} to={`/admin/clientes/${client.id}`} style={{ textDecoration: "none" }}>
                <Card style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "var(--sp-3)" }}>
                  <div>
                    <p style={{ fontWeight: 600, color: "var(--text-primary)", margin: 0 }}>{client.name}</p>
                    <p style={{ color: "var(--text-tertiary)", fontSize: "var(--fs-caption)", margin: "4px 0 0" }}>{client.email}</p>
                  </div>
                  <div style={{ display: "flex", gap: "var(--sp-2)", alignItems: "center" }}>
                    <Badge tone={status.tone}>{status.label}</Badge>
                    {client.subscriptions[0] && <Badge>{client.subscriptions[0].plan.name}</Badge>}
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </AdminLayout>
  );
}
