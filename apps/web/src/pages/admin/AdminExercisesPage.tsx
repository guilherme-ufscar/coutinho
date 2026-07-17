import { useEffect, useState } from "react";
import { Button, Card, TextField } from "@couthealth/ui";
import { exercisesApi, type ExerciseItem } from "../../lib/api";
import { useAuth } from "../../lib/auth";
import { AdminLayout } from "./AdminLayout";

const empty = { name: "", muscleGroup: "", videoUrl: "" };

export function AdminExercisesPage() {
  const { accessToken } = useAuth();
  const [exercises, setExercises] = useState<ExerciseItem[]>([]);
  const [form, setForm] = useState(empty);
  const [search, setSearch] = useState("");

  function load() {
    exercisesApi.list(search).then(setExercises);
  }

  useEffect(load, [search]);

  async function create() {
    if (!accessToken || !form.name) return;
    await exercisesApi.create(form, accessToken);
    setForm(empty);
    load();
  }

  async function remove(id: string) {
    if (!accessToken) return;
    await exercisesApi.remove(id, accessToken);
    load();
  }

  return (
    <AdminLayout>
      <h1 className="display" style={{ fontSize: "var(--fs-display-sm)", marginBottom: "var(--sp-6)" }}>
        Banco de exercícios
      </h1>

      <Card style={{ marginBottom: "var(--sp-6)", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "var(--sp-3)", alignItems: "end" }}>
        <TextField label="Nome" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <TextField label="Grupo muscular" value={form.muscleGroup} onChange={(e) => setForm({ ...form, muscleGroup: e.target.value })} />
        <TextField label="URL do vídeo (YouTube não listado)" value={form.videoUrl} onChange={(e) => setForm({ ...form, videoUrl: e.target.value })} />
        <Button onClick={create}>Adicionar</Button>
      </Card>

      <TextField label="Buscar" value={search} onChange={(e) => setSearch(e.target.value)} style={{ marginBottom: "var(--sp-4)" }} />

      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {exercises.map((ex) => (
          <div key={ex.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", background: "var(--bg-card)", borderRadius: 8, border: "1px solid var(--border-hairline)" }}>
            <span>
              {ex.name} <span style={{ color: "var(--text-tertiary)", fontSize: "var(--fs-caption)" }}>({ex.muscleGroup})</span>
            </span>
            <Button variant="ghost" onClick={() => remove(ex.id)}>
              Remover
            </Button>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
