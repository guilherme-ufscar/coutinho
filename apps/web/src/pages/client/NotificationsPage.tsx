import { useEffect, useState } from "react";
import { Card } from "@couthealth/ui";
import { notificationsApi } from "../../lib/api";
import { useAuth } from "../../lib/auth";
import { ClientLayout } from "./ClientLayout";

export function NotificationsPage() {
  const { accessToken } = useAuth();
  const [items, setItems] = useState<any[]>([]);

  function load() {
    if (!accessToken) return;
    notificationsApi.mine(accessToken).then(setItems);
  }

  useEffect(load, [accessToken]);

  async function markRead(id: string) {
    if (!accessToken) return;
    await notificationsApi.markRead(id, accessToken);
    load();
  }

  return (
    <ClientLayout>
      <h1 className="display" style={{ fontSize: "var(--fs-display-sm)", marginBottom: "var(--sp-6)" }}>
        Notificações
      </h1>

      {items.length === 0 && <p style={{ color: "var(--text-secondary)" }}>Nenhuma notificação por enquanto.</p>}

      <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-3)" }}>
        {items.map((n) => (
          <Card
            key={n.id}
            onClick={() => !n.readAt && markRead(n.id)}
            style={{ cursor: n.readAt ? "default" : "pointer", opacity: n.readAt ? 0.6 : 1, borderColor: n.readAt ? undefined : "var(--accent)" }}
          >
            <p style={{ fontWeight: 600, margin: 0 }}>{n.title}</p>
            <p style={{ color: "var(--text-secondary)", fontSize: "var(--fs-body-sm)", margin: "4px 0 0" }}>{n.body}</p>
            <p style={{ color: "var(--text-tertiary)", fontSize: "var(--fs-caption)", margin: "8px 0 0" }}>
              {new Date(n.createdAt).toLocaleString("pt-BR")}
            </p>
          </Card>
        ))}
      </div>
    </ClientLayout>
  );
}
