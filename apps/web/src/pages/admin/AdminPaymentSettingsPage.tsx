import { useEffect, useState } from "react";
import { Badge, Button, Card, TextField } from "@couthealth/ui";
import { adminPaymentSettingsApi, type PaymentSettings } from "../../lib/api";
import { useAuth } from "../../lib/auth";
import { AdminLayout } from "./AdminLayout";

export function AdminPaymentSettingsPage() {
  const { accessToken } = useAuth();
  const [settings, setSettings] = useState<PaymentSettings | null>(null);
  const [accessTokenInput, setAccessTokenInput] = useState("");
  const [publicKey, setPublicKey] = useState("");
  const [active, setActive] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  function load() {
    if (!accessToken) return;
    adminPaymentSettingsApi.list(accessToken).then((list) => {
      const mp = list.find((s) => s.provider === "MERCADOPAGO") ?? null;
      setSettings(mp);
      setPublicKey(mp?.publicKey ?? "");
      setActive(mp?.active ?? false);
    });
  }

  useEffect(load, [accessToken]);

  async function save() {
    if (!accessToken || !publicKey) return;
    setSaving(true);
    setSaved(false);
    try {
      await adminPaymentSettingsApi.updateMercadoPago(
        { accessToken: accessTokenInput || undefined, publicKey, active },
        accessToken
      );
      setAccessTokenInput("");
      setSaved(true);
      load();
    } finally {
      setSaving(false);
    }
  }

  return (
    <AdminLayout title="Pagamentos">
      <Card style={{ maxWidth: 520, display: "flex", flexDirection: "column", gap: "var(--sp-5)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h2 className="display" style={{ fontSize: "var(--fs-title-md)", margin: 0 }}>
            Mercado Pago
          </h2>
          <Badge tone={settings?.active ? "accent" : "neutral"}>{settings?.active ? "Ativo" : "Inativo"}</Badge>
        </div>
        <p style={{ color: "var(--text-secondary)", fontSize: "var(--fs-body-sm)", margin: 0 }}>
          Cole abaixo o <strong>Access Token</strong> e a <strong>Public Key</strong> da sua conta Mercado Pago
          (Suas integrações → Credenciais de produção). O token fica criptografado — nunca aparece de volta
          nesta tela, nem para a equipe de desenvolvimento.
        </p>

        <TextField
          label="Access Token"
          type="password"
          placeholder={settings?.accessTokenLast4 ? `Configurado (•••• ${settings.accessTokenLast4})` : "APP_USR-..."}
          value={accessTokenInput}
          onChange={(e) => setAccessTokenInput(e.target.value)}
        />
        <TextField label="Public Key" placeholder="APP_USR-..." value={publicKey} onChange={(e) => setPublicKey(e.target.value)} />

        <label style={{ display: "flex", alignItems: "center", gap: "var(--sp-3)", fontSize: "var(--fs-body-sm)" }}>
          <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} />
          Usar o Mercado Pago como gateway ativo (substitui PIX/cartão mock)
        </label>

        {saved && (
          <p style={{ color: "var(--success)", fontSize: "var(--fs-body-sm)", margin: 0 }}>Configuração salva.</p>
        )}

        <Button onClick={save} disabled={saving || !publicKey} style={{ alignSelf: "start" }}>
          {saving ? "Salvando…" : "Salvar"}
        </Button>
      </Card>
    </AdminLayout>
  );
}
