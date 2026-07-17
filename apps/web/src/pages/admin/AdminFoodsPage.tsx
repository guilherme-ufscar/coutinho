import { useEffect, useState } from "react";
import { Button, Card, TextField } from "@couthealth/ui";
import { foodsApi, type FoodItem } from "../../lib/api";
import { useAuth } from "../../lib/auth";
import { AdminLayout } from "./AdminLayout";

const empty = { name: "", category: "", kcal: 0, protein: 0, carbs: 0, fat: 0 };

export function AdminFoodsPage() {
  const { accessToken } = useAuth();
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [form, setForm] = useState(empty);
  const [search, setSearch] = useState("");

  function load() {
    foodsApi.list(search).then(setFoods);
  }

  useEffect(load, [search]);

  async function create() {
    if (!accessToken || !form.name) return;
    await foodsApi.create(form, accessToken);
    setForm(empty);
    load();
  }

  async function remove(id: string) {
    if (!accessToken) return;
    await foodsApi.remove(id, accessToken);
    load();
  }

  return (
    <AdminLayout>
      <h1 className="display" style={{ fontSize: "var(--fs-display-sm)", marginBottom: "var(--sp-6)" }}>
        Banco de alimentos
      </h1>

      <Card style={{ marginBottom: "var(--sp-6)", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "var(--sp-3)", alignItems: "end" }}>
        <TextField label="Nome" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <TextField label="Categoria" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
        <TextField label="Kcal/100g" type="number" value={form.kcal} onChange={(e) => setForm({ ...form, kcal: Number(e.target.value) })} />
        <TextField label="Proteína (g)" type="number" value={form.protein} onChange={(e) => setForm({ ...form, protein: Number(e.target.value) })} />
        <TextField label="Carbo (g)" type="number" value={form.carbs} onChange={(e) => setForm({ ...form, carbs: Number(e.target.value) })} />
        <TextField label="Gordura (g)" type="number" value={form.fat} onChange={(e) => setForm({ ...form, fat: Number(e.target.value) })} />
        <Button onClick={create}>Adicionar</Button>
      </Card>

      <TextField label="Buscar" value={search} onChange={(e) => setSearch(e.target.value)} style={{ marginBottom: "var(--sp-4)" }} />

      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {foods.map((food) => (
          <div key={food.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", background: "var(--bg-card)", borderRadius: 8, border: "1px solid var(--border-hairline)" }}>
            <span>
              {food.name} <span style={{ color: "var(--text-tertiary)", fontSize: "var(--fs-caption)" }}>({food.category})</span>
            </span>
            <span style={{ display: "flex", gap: 12, alignItems: "center", color: "var(--text-secondary)", fontSize: "var(--fs-caption)" }}>
              {food.kcal} kcal · P{food.protein} C{food.carbs} G{food.fat}
              <Button variant="ghost" onClick={() => remove(food.id)}>
                Remover
              </Button>
            </span>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
