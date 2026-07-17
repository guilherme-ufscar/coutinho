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
    <ClientLayout>
      <h1 className="display" style={{ fontSize: "var(--fs-display-sm)", marginBottom: "var(--sp-6)" }}>
        Perfil
      </h1>

      <Card style={{ maxWidth: 420, display: "flex", flexDirection: "column", gap: "var(--sp-4)", marginBottom: "var(--sp-6)" }}>
        <div>
          <p style={{ color: "var(--text-tertiary)", fontSize: "var(--fs-caption)", margin: 0 }}>Nome</p>
          <p style={{ margin: "4px 0 0" }}>{user?.name}</p>
        </div>
        <div>
          <p style={{ color: "var(--text-tertiary)", fontSize: "var(--fs-caption)", margin: 0 }}>E-mail</p>
          <p style={{ margin: "4px 0 0" }}>{user?.email}</p>
        </div>
        <Button variant="secondary" onClick={logout}>
          Sair
        </Button>
      </Card>

      <Card style={{ maxWidth: 420, display: "flex", flexDirection: "column", gap: "var(--sp-4)" }}>
        <h3 style={{ margin: 0 }}>Seus dados (LGPD)</h3>
        <p style={{ color: "var(--text-secondary)", fontSize: "var(--fs-body-sm)", margin: 0 }}>
          Você pode baixar uma cópia de tudo que guardamos sobre você, ou solicitar a remoção da sua conta a qualquer momento.
        </p>
        <Button variant="secondary" onClick={exportData}>
          Baixar meus dados
        </Button>
        {!confirmingDeletion ? (
          <Button variant="ghost" onClick={() => setConfirmingDeletion(true)} style={{ color: "var(--danger)" }}>
            Excluir minha conta
          </Button>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-2)" }}>
            <p style={{ color: "var(--danger)", fontSize: "var(--fs-body-sm)" }}>
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
        {status && <p style={{ color: "var(--success)", fontSize: "var(--fs-body-sm)" }}>{status}</p>}
      </Card>
    </ClientLayout>
  );
}
