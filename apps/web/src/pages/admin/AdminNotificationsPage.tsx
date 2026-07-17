import { useEffect, useState } from "react";
import { Button, Card, TextField } from "@couthealth/ui";
import { adminNotificationsApi } from "../../lib/api";
import { useAuth } from "../../lib/auth";
import { AdminLayout } from "./AdminLayout";

const audiences = [
  { value: "all", label: "Todos os clientes" },
  { value: "ESSENCIAL", label: "Assinantes Essencial" },
  { value: "PLUS", label: "Assinantes Plus" },
  { value: "ELITE", label: "Assinantes Elite" },
];

export function AdminNotificationsPage() {
  const { accessToken } = useAuth();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [audience, setAudience] = useState("all");
  const [scheduledFor, setScheduledFor] = useState("");
  const [sent, setSent] = useState<any[]>([]);
  const [status, setStatus] = useState<string | null>(null);

  function load() {
    if (!accessToken) return;
    adminNotificationsApi.list(accessToken).then(setSent);
  }

  useEffect(load, [accessToken]);

  async function create() {
    if (!accessToken || !title || !body) return;
    const res = await adminNotificationsApi.create({ title, body, audience, scheduledFor: scheduledFor || undefined }, accessToken);
    setStatus(res.status === "sent" ? `Enviada para ${res.recipients} cliente(s).` : `Agendada para ${new Date(res.scheduledFor).toLocaleString("pt-BR")}.`);
    setTitle("");
    setBody("");
    setScheduledFor("");
    load();
  }

  return (
    <AdminLayout>
      <h1 className="display" style={{ fontSize: "var(--fs-display-sm)", marginBottom: "var(--sp-6)" }}>
        Notificações e campanhas
      </h1>

      <Card style={{ marginBottom: "var(--sp-6)", display: "flex", flexDirection: "column", gap: "var(--sp-4)", maxWidth: 480 }}>
        <TextField label="Título" value={title} onChange={(e) => setTitle(e.target.value)} />
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-2)" }}>
          <label style={{ fontSize: "var(--fs-body-sm)", fontWeight: 600, color: "var(--text-secondary)" }}>Mensagem</label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={3}
            style={{ background: "var(--bg-surface)", border: "1px solid var(--border-hairline)", borderRadius: "var(--r-md)", padding: "12px 16px", color: "var(--text-primary)", fontFamily: "var(--font-body)" }}
          />
        </div>
        <div>
          <label style={{ fontSize: "var(--fs-body-sm)", fontWeight: 600, color: "var(--text-secondary)" }}>Público</label>
          <select value={audience} onChange={(e) => setAudience(e.target.value)} style={{ display: "block", width: "100%", marginTop: 8, background: "var(--bg-surface)", border: "1px solid var(--border-hairline)", borderRadius: "var(--r-md)", padding: "12px 16px", color: "var(--text-primary)" }}>
            {audiences.map((a) => (
              <option key={a.value} value={a.value}>
                {a.label}
              </option>
            ))}
          </select>
        </div>
        <TextField label="Agendar para (opcional)" type="datetime-local" value={scheduledFor} onChange={(e) => setScheduledFor(e.target.value)} />
        <Button onClick={create}>{scheduledFor ? "Agendar" : "Enviar agora"}</Button>
        {status && <p style={{ color: "var(--success)", fontSize: "var(--fs-body-sm)" }}>{status}</p>}
      </Card>

      <h3 style={{ color: "var(--text-secondary)", fontSize: "var(--fs-body-sm)", textTransform: "uppercase", letterSpacing: "0.04em" }}>Enviadas recentemente</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {sent.map((n) => (
          <div key={n.id} style={{ padding: "10px 14px", background: "var(--bg-card)", borderRadius: 8, border: "1px solid var(--border-hairline)" }}>
            <strong>{n.title}</strong> — <span style={{ color: "var(--text-secondary)" }}>{n.audienceSegment}</span>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
