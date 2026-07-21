import { useEffect, useState } from "react";
import { Badge, Button, Card, TextField } from "@couthealth/ui";
import { checkinsApi, type CheckIn } from "../../lib/api";
import { useAuth } from "../../lib/auth";
import { ClientLayout } from "./ClientLayout";

export function CheckInPage() {
  const { accessToken } = useAuth();
  const [checkIns, setCheckIns] = useState<CheckIn[]>([]);
  const [drafts, setDrafts] = useState<Record<string, string>>({});

  function load() {
    if (!accessToken) return;
    checkinsApi.mine(accessToken).then(setCheckIns);
  }

  useEffect(load, [accessToken]);

  async function answer(id: string) {
    if (!accessToken || !drafts[id]?.trim()) return;
    await checkinsApi.answer(id, drafts[id], accessToken);
    setDrafts((d) => ({ ...d, [id]: "" }));
    load();
  }

  const pending = checkIns.filter((c) => !c.answeredAt);
  const answered = checkIns.filter((c) => c.answeredAt);

  return (
    <ClientLayout title="Check-in">
      <div style={{ maxWidth: 720 }}>
        <h3 style={{ color: "var(--text-secondary)", fontSize: "0.8125rem", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "var(--sp-4)" }}>
          Pendentes
        </h3>
        {pending.length === 0 && <p style={{ color: "var(--text-secondary)" }}>Nenhum check-in pendente.</p>}
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-4)", marginBottom: "var(--sp-10)" }}>
          {pending.map((c) => (
            <Card key={c.id} style={{ padding: "var(--sp-8)" }}>
              <Badge tone="accent">{c.kind === "NUTRICAO" ? "Nutrição" : "Treino"}</Badge>
              <p style={{ fontSize: "1.0625rem", margin: "var(--sp-5) 0" }}>{c.question}</p>
              <div style={{ display: "flex", gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <TextField label="" placeholder="Sua resposta…" value={drafts[c.id] ?? ""} onChange={(e) => setDrafts((d) => ({ ...d, [c.id]: e.target.value }))} />
                </div>
                <Button onClick={() => answer(c.id)}>Responder</Button>
              </div>
            </Card>
          ))}
        </div>

        <h3 style={{ color: "var(--text-secondary)", fontSize: "0.8125rem", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "var(--sp-4)" }}>
          Histórico
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-3)" }}>
          {answered.map((c) => (
            <Card key={c.id} style={{ opacity: 0.75 }}>
              <Badge>{c.kind === "NUTRICAO" ? "Nutrição" : "Treino"}</Badge>
              <p style={{ fontWeight: 600, margin: "var(--sp-3) 0 4px" }}>{c.question}</p>
              <p style={{ color: "var(--text-secondary)", fontSize: "var(--fs-body-sm)" }}>{c.answer}</p>
            </Card>
          ))}
        </div>
      </div>
    </ClientLayout>
  );
}
