import { useEffect, useState } from "react";
import { notificationsApi } from "../../lib/api";
import { useAuth } from "../../lib/auth";
import { ClientLayout } from "./ClientLayout";

function groupByDay(items: any[]) {
  const groups: { day: string; items: any[] }[] = [];
  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();
  for (const item of items) {
    const d = new Date(item.createdAt).toDateString();
    const label = d === today ? "Hoje" : d === yesterday ? "Ontem" : new Date(item.createdAt).toLocaleDateString("pt-BR");
    let group = groups.find((g) => g.day === label);
    if (!group) {
      group = { day: label, items: [] };
      groups.push(group);
    }
    group.items.push(item);
  }
  return groups;
}

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

  const groups = groupByDay(items);

  return (
    <ClientLayout title="Notificações">
      <div style={{ maxWidth: 640 }}>
        {items.length === 0 && <p style={{ color: "var(--text-secondary)" }}>Nenhuma notificação por enquanto.</p>}

        {groups.map((g) => (
          <div key={g.day} style={{ marginBottom: "var(--sp-8)" }}>
            <span
              style={{
                textTransform: "uppercase",
                fontSize: "0.75rem",
                letterSpacing: "0.1em",
                color: "var(--text-secondary)",
                display: "block",
                marginBottom: 12,
              }}
            >
              {g.day}
            </span>
            {g.items.map((n) => (
              <div
                key={n.id}
                onClick={() => !n.readAt && markRead(n.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  padding: "16px 0",
                  borderBottom: "1px solid var(--border-hairline)",
                  cursor: n.readAt ? "default" : "pointer",
                  opacity: n.readAt ? 0.6 : 1,
                }}
              >
                <span
                  style={{
                    width: 36,
                    height: 36,
                    flexShrink: 0,
                    borderRadius: "var(--r-full)",
                    background: "var(--ink-600)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--accent)",
                    fontWeight: 700,
                  }}
                >
                  •
                </span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: "0.9375rem" }}>{n.title}</div>
                  <div style={{ fontSize: "0.8125rem", color: "var(--text-secondary)" }}>{n.body}</div>
                </div>
                <span style={{ fontSize: "0.8125rem", color: "var(--text-tertiary)" }}>
                  {new Date(n.createdAt).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                </span>
                {!n.readAt && <span style={{ width: 8, height: 8, borderRadius: "var(--r-full)", background: "var(--accent)" }} />}
              </div>
            ))}
          </div>
        ))}
      </div>
    </ClientLayout>
  );
}
