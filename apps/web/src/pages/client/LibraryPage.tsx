import { useEffect, useState } from "react";
import { Badge, Card } from "@couthealth/ui";
import { libraryApi, type LibraryItem } from "../../lib/api";
import { useAuth } from "../../lib/auth";
import { ClientLayout } from "./ClientLayout";

export function LibraryPage() {
  const { accessToken } = useAuth();
  const [items, setItems] = useState<LibraryItem[]>([]);

  useEffect(() => {
    if (!accessToken) return;
    libraryApi.listPublished(accessToken).then(setItems);
  }, [accessToken]);

  return (
    <ClientLayout title="Biblioteca">
      {items.length === 0 && <p style={{ color: "var(--text-secondary)" }}>Nenhum conteúdo publicado ainda.</p>}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "var(--sp-5)" }}>
        {items.map((item) => (
          <Card key={item.id} style={{ padding: 0, overflow: "hidden" }}>
            <div style={{ height: 140, background: "var(--bg-surface)" }} />
            <div style={{ padding: "var(--sp-5)" }}>
              <Badge tone="accent" style={{ marginBottom: 10 }}>
                {item.type}
              </Badge>
              <h3 style={{ fontSize: "0.9375rem", fontWeight: 600, margin: "0 0 6px" }}>{item.title}</h3>
              {item.body && <p style={{ color: "var(--text-secondary)", fontSize: "0.8125rem", margin: 0 }}>{item.body}</p>}
              {item.mediaUrl && (
                <a
                  href={item.mediaUrl}
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: "var(--accent)", fontSize: "var(--fs-body-sm)", display: "inline-block", marginTop: 8 }}
                >
                  Abrir →
                </a>
              )}
            </div>
          </Card>
        ))}
      </div>
    </ClientLayout>
  );
}
