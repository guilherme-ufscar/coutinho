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
    <ClientLayout>
      <h1 className="display" style={{ fontSize: "var(--fs-display-sm)", marginBottom: "var(--sp-6)" }}>
        Biblioteca
      </h1>

      {items.length === 0 && <p style={{ color: "var(--text-secondary)" }}>Nenhum conteúdo publicado ainda.</p>}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "var(--sp-4)" }}>
        {items.map((item) => (
          <Card key={item.id}>
            <Badge tone="accent">{item.type}</Badge>
            <h3 style={{ margin: "var(--sp-3) 0 8px" }}>{item.title}</h3>
            {item.body && <p style={{ color: "var(--text-secondary)", fontSize: "var(--fs-body-sm)" }}>{item.body}</p>}
            {item.mediaUrl && (
              <a href={item.mediaUrl} target="_blank" rel="noreferrer" style={{ color: "var(--accent)", fontSize: "var(--fs-body-sm)" }}>
                Abrir →
              </a>
            )}
          </Card>
        ))}
      </div>
    </ClientLayout>
  );
}
