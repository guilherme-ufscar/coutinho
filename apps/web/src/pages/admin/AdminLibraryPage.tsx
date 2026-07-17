import { useEffect, useState } from "react";
import { Badge, Button, Card, TextField } from "@couthealth/ui";
import { libraryApi, type LibraryItem } from "../../lib/api";
import { useAuth } from "../../lib/auth";
import { AdminLayout } from "./AdminLayout";

const types: LibraryItem["type"][] = ["RECEITA", "ARTIGO", "VIDEO", "MATERIAL"];

export function AdminLibraryPage() {
  const { accessToken } = useAuth();
  const [items, setItems] = useState<LibraryItem[]>([]);
  const [title, setTitle] = useState("");
  const [type, setType] = useState<LibraryItem["type"]>("ARTIGO");
  const [mediaUrl, setMediaUrl] = useState("");

  function load() {
    if (!accessToken) return;
    libraryApi.listAll(accessToken).then(setItems);
  }

  useEffect(load, [accessToken]);

  async function create() {
    if (!accessToken || !title) return;
    await libraryApi.create({ title, type, mediaUrl }, accessToken);
    setTitle("");
    setMediaUrl("");
    load();
  }

  async function publish(id: string) {
    if (!accessToken) return;
    await libraryApi.publish(id, accessToken);
    load();
  }

  return (
    <AdminLayout>
      <h1 className="display" style={{ fontSize: "var(--fs-display-sm)", marginBottom: "var(--sp-6)" }}>
        Biblioteca
      </h1>

      <Card style={{ marginBottom: "var(--sp-6)", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "var(--sp-3)", alignItems: "end" }}>
        <TextField label="Título" value={title} onChange={(e) => setTitle(e.target.value)} />
        <div>
          <label style={{ fontSize: "var(--fs-body-sm)", fontWeight: 600, color: "var(--text-secondary)" }}>Tipo</label>
          <select value={type} onChange={(e) => setType(e.target.value as LibraryItem["type"])} style={{ display: "block", width: "100%", marginTop: 8, background: "var(--bg-surface)", border: "1px solid var(--border-hairline)", borderRadius: "var(--r-md)", padding: "12px 16px", color: "var(--text-primary)" }}>
            {types.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        <TextField label="URL (vídeo/material)" value={mediaUrl} onChange={(e) => setMediaUrl(e.target.value)} />
        <Button onClick={create}>Adicionar</Button>
      </Card>

      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {items.map((item) => (
          <div key={item.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", background: "var(--bg-card)", borderRadius: 8, border: "1px solid var(--border-hairline)" }}>
            <span>
              {item.title} <Badge>{item.type}</Badge>
            </span>
            {item.publishedAt ? (
              <Badge tone="accent">Publicado</Badge>
            ) : (
              <Button variant="secondary" onClick={() => publish(item.id)}>
                Publicar
              </Button>
            )}
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
