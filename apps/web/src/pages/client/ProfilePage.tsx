import { useState } from "react";
import { Button, Card } from "@couthealth/ui";
import { clientApi } from "../../lib/api";
import { useAuth } from "../../lib/auth";
import { ClientLayout } from "./ClientLayout";

export function ProfilePage() {
  const { user, accessToken, logout } = useAuth();
  const [confirmingDeletion, setConfirmingDeletion] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  async function exportData() {
    if (!accessToken) return;
    const data = await clientApi.exportData(accessToken);
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "couthealth-meus-dados.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  async function confirmDeletion() {
    if (!accessToken) return;
    await clientApi.requestDeletion(accessToken);
    setStatus("Sua conta foi anonimizada. Saindo…");
    setTimeout(logout, 1500);
  }

  return (
    <ClientLayout title="Perfil">
      <div style={{ maxWidth: 720 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: "var(--sp-8)" }}>
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: "var(--r-full)",
              background: "var(--bg-card)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.5rem",
              fontWeight: 700,
              color: "var(--accent)",
              flexShrink: 0,
            }}
          >
            {user?.name?.[0]?.toUpperCase() ?? "?"}
          </div>
          <div>
            <h2 className="display" style={{ fontSize: "1.25rem", margin: "0 0 4px" }}>
              {user?.name}
            </h2>
            <p style={{ fontSize: "0.9375rem", color: "var(--text-secondary)", margin: 0 }}>
              {user?.role === "PROFESSIONAL" ? "Profissional CoutHealth" : "Cliente CoutHealth"}
            </p>
          </div>
        </div>

        <Card style={{ marginBottom: "var(--sp-5)", padding: "var(--sp-7)" }}>
          <h3 style={{ fontSize: "1.0625rem", fontWeight: 600, margin: "0 0 var(--sp-5)" }}>Dados pessoais</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 20, fontSize: "0.9375rem", marginBottom: "var(--sp-6)" }}>
            <div>
              <span style={{ color: "var(--text-secondary)", display: "block", marginBottom: 4 }}>E-mail</span>
              {user?.email}
            </div>
          </div>
          <Button variant="secondary" onClick={logout}>
            Sair
          </Button>
        </Card>

        <Card style={{ padding: "var(--sp-7)" }}>
          <h3 style={{ fontSize: "1.0625rem", fontWeight: 600, margin: "0 0 8px" }}>Privacidade (LGPD)</h3>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", margin: "0 0 var(--sp-5)" }}>
            Você pode baixar uma cópia de tudo que guardamos sobre você, ou solicitar a remoção da sua conta a qualquer momento.
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Button variant="secondary" onClick={exportData}>
              Baixar meus dados
            </Button>
            {!confirmingDeletion && (
              <Button variant="secondary" onClick={() => setConfirmingDeletion(true)} style={{ borderColor: "var(--danger)", color: "var(--danger)" }}>
                Excluir conta
              </Button>
            )}
          </div>
          {confirmingDeletion && (
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-3)", marginTop: "var(--sp-5)" }}>
              <p style={{ color: "var(--danger)", fontSize: "var(--fs-body-sm)", margin: 0 }}>
                Isso anonimiza sua conta (nome, e-mail e login removidos). Não é possível desfazer. Confirma?
              </p>
              <div style={{ display: "flex", gap: "var(--sp-2)" }}>
                <Button variant="secondary" onClick={() => setConfirmingDeletion(false)}>
                  Cancelar
                </Button>
                <Button onClick={confirmDeletion} style={{ background: "var(--danger)" }}>
                  Confirmar exclusão
                </Button>
              </div>
            </div>
          )}
          {status && <p style={{ color: "var(--success)", fontSize: "var(--fs-body-sm)", marginTop: "var(--sp-4)" }}>{status}</p>}
        </Card>
      </div>
    </ClientLayout>
  );
}
