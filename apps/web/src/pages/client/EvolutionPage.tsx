import { useEffect, useState } from "react";
import { Button, Card, LineChart, TextField } from "@couthealth/ui";
import { assessmentsListApi, assessmentsApi, type Assessment } from "../../lib/api";
import { useAuth } from "../../lib/auth";
import { ClientLayout } from "./ClientLayout";

const metrics: { key: keyof Assessment; label: string }[] = [
  { key: "weightKg", label: "Peso (kg)" },
  { key: "waistCm", label: "Cintura (cm)" },
  { key: "abdomenCm", label: "Abdômen (cm)" },
  { key: "armCm", label: "Braço (cm)" },
  { key: "thighCm", label: "Coxa (cm)" },
  { key: "muscleMassKg", label: "Massa muscular (kg)" },
  { key: "fatMassKg", label: "Massa de gordura (kg)" },
];

export function EvolutionPage() {
  const { accessToken } = useAuth();
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [form, setForm] = useState<Record<string, string>>({});
  const [showForm, setShowForm] = useState(false);

  function load() {
    if (!accessToken) return;
    assessmentsListApi.mine(accessToken).then(setAssessments);
  }

  useEffect(load, [accessToken]);

  async function save() {
    if (!accessToken) return;
    const payload: Record<string, number> = {};
    for (const [key, value] of Object.entries(form)) {
      if (value !== "") payload[key] = Number(value);
    }
    await assessmentsApi.create(payload, accessToken);
    setForm({});
    setShowForm(false);
    load();
  }

  return (
    <ClientLayout>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--sp-6)" }}>
        <h1 className="display" style={{ fontSize: "var(--fs-display-sm)", margin: 0 }}>
          Evolução
        </h1>
        <Button onClick={() => setShowForm((s) => !s)}>Registrar avaliação</Button>
      </div>

      {showForm && (
        <Card style={{ marginBottom: "var(--sp-6)", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "var(--sp-3)", alignItems: "end" }}>
          {metrics.map((m) => (
            <TextField
              key={m.key}
              label={m.label}
              type="number"
              value={form[m.key as string] ?? ""}
              onChange={(e) => setForm({ ...form, [m.key]: e.target.value })}
            />
          ))}
          <Button onClick={save}>Salvar</Button>
        </Card>
      )}

      {assessments.length === 0 && (
        <p style={{ color: "var(--text-secondary)" }}>
          Você ainda não tem medidas registradas. Clique em "Registrar avaliação" para começar — tudo bem preencher aos poucos.
        </p>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "var(--sp-6)" }}>
        {metrics.map((m) => {
          const points = assessments
            .filter((a) => a[m.key] !== null && a[m.key] !== undefined)
            .map((a) => ({ label: new Date(a.recordedAt).toLocaleDateString("pt-BR"), value: Number(a[m.key]) }));
          if (points.length === 0) return null;
          return (
            <Card key={m.key as string}>
              <h3 style={{ margin: "0 0 var(--sp-4)" }}>{m.label}</h3>
              <LineChart data={points} />
            </Card>
          );
        })}
      </div>
    </ClientLayout>
  );
}
