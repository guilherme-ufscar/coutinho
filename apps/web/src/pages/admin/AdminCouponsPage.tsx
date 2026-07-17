import { useEffect, useState } from "react";
import { Badge, Button, Card, TextField } from "@couthealth/ui";
import { adminCouponsApi, type Coupon } from "../../lib/api";
import { useAuth } from "../../lib/auth";
import { AdminLayout } from "./AdminLayout";

export function AdminCouponsPage() {
  const { accessToken } = useAuth();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [code, setCode] = useState("");
  const [percentOff, setPercentOff] = useState("10");

  function load() {
    if (!accessToken) return;
    adminCouponsApi.list(accessToken).then(setCoupons);
  }

  useEffect(load, [accessToken]);

  async function create() {
    if (!accessToken || !code) return;
    await adminCouponsApi.create({ code, percentOff: Number(percentOff) / 100 }, accessToken);
    setCode("");
    load();
  }

  async function toggle(c: Coupon) {
    if (!accessToken) return;
    await adminCouponsApi.update(c.id, { active: !c.active }, accessToken);
    load();
  }

  return (
    <AdminLayout>
      <h1 className="display" style={{ fontSize: "var(--fs-display-sm)", marginBottom: "var(--sp-6)" }}>
        Cupons
      </h1>

      <Card style={{ marginBottom: "var(--sp-6)", display: "flex", gap: "var(--sp-3)", alignItems: "end", maxWidth: 480 }}>
        <TextField label="Código" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} />
        <TextField label="Desconto (%)" type="number" value={percentOff} onChange={(e) => setPercentOff(e.target.value)} />
        <Button onClick={create}>Criar cupom</Button>
      </Card>

      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {coupons.map((c) => (
          <div key={c.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", background: "var(--bg-card)", borderRadius: 8, border: "1px solid var(--border-hairline)" }}>
            <span>
              <strong>{c.code}</strong> — {Math.round(c.percentOff * 100)}% off
            </span>
            <span style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <Badge tone={c.active ? "accent" : "neutral"}>{c.active ? "Ativo" : "Inativo"}</Badge>
              <Button variant="ghost" onClick={() => toggle(c)}>
                {c.active ? "Desativar" : "Ativar"}
              </Button>
            </span>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
