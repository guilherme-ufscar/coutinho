import { useEffect, useState } from "react";
import { Badge } from "@couthealth/ui";
import { adminSubscriptionsApi } from "../../lib/api";
import { useAuth } from "../../lib/auth";
import { AdminLayout } from "./AdminLayout";

const statuses = ["PENDING", "ACTIVE", "CANCELED", "EXPIRED"];
const planCodes = ["ESSENCIAL", "PLUS", "ELITE"];

export function AdminSubscriptionsPage() {
  const { accessToken } = useAuth();
  const [subs, setSubs] = useState<any[]>([]);

  function load() {
    if (!accessToken) return;
    adminSubscriptionsApi.list(accessToken).then(setSubs);
  }

  useEffect(load, [accessToken]);

  async function changeStatus(id: string, status: string) {
    if (!accessToken) return;
    await adminSubscriptionsApi.update(id, { status }, accessToken);
    load();
  }

  async function changePlan(id: string, planCode: string) {
    if (!accessToken) return;
    await adminSubscriptionsApi.update(id, { planCode }, accessToken);
    load();
  }

  return (
    <AdminLayout>
      <h1 className="display" style={{ fontSize: "var(--fs-display-sm)", marginBottom: "var(--sp-6)" }}>
        Planos & Assinaturas
      </h1>

      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {subs.map((s) => (
          <div key={s.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8, padding: "10px 14px", background: "var(--bg-card)", borderRadius: 8, border: "1px solid var(--border-hairline)" }}>
            <span>
              {s.user.name} <span style={{ color: "var(--text-tertiary)", fontSize: "var(--fs-caption)" }}>({s.user.email})</span>
            </span>
            <span style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <Badge>{s.period}</Badge>
              <select value={s.plan.code} onChange={(e) => changePlan(s.id, e.target.value)} style={{ background: "var(--bg-surface)", border: "1px solid var(--border-hairline)", borderRadius: 8, padding: "6px 10px", color: "var(--text-primary)" }}>
                {planCodes.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
              <select value={s.status} onChange={(e) => changeStatus(s.id, e.target.value)} style={{ background: "var(--bg-surface)", border: "1px solid var(--border-hairline)", borderRadius: 8, padding: "6px 10px", color: "var(--text-primary)" }}>
                {statuses.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </span>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
