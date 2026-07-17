import { useEffect, useState } from "react";
import { Card } from "@couthealth/ui";
import { clientApi } from "../../lib/api";
import { useAuth } from "../../lib/auth";
import { ClientLayout } from "./ClientLayout";

export function NutritionPage() {
  const { accessToken } = useAuth();
  const [mealPlan, setMealPlan] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!accessToken) return;
    clientApi
      .nutrition(accessToken)
      .then(setMealPlan)
      .finally(() => setLoading(false));
  }, [accessToken]);

  return (
    <ClientLayout>
      <h1 className="display" style={{ fontSize: "var(--fs-display-sm)", marginBottom: "var(--sp-6)" }}>
        Nutrição
      </h1>

      {loading && <p style={{ color: "var(--text-secondary)" }}>Carregando…</p>}
      {!loading && !mealPlan && <p style={{ color: "var(--text-secondary)" }}>Nenhum plano alimentar publicado ainda.</p>}

      <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-4)" }}>
        {mealPlan?.meals?.map((meal: any) => (
          <Card key={meal.id}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "var(--sp-3)" }}>
              <h3 style={{ margin: 0 }}>{meal.name}</h3>
              <span style={{ color: "var(--accent)", fontWeight: 600 }}>{meal.time}</span>
            </div>
            {meal.notes && <p style={{ color: "var(--text-secondary)", fontSize: "var(--fs-body-sm)" }}>{meal.notes}</p>}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {meal.items.map((item: any) => (
                <div key={item.id} style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid var(--border-hairline)", paddingTop: 8 }}>
                  <span>
                    {item.food.name} — {item.quantityGrams} g
                  </span>
                  <span style={{ color: "var(--text-tertiary)", fontSize: "var(--fs-caption)", fontVariantNumeric: "tabular-nums" }}>
                    {Math.round((item.food.kcal * item.quantityGrams) / 100)} kcal · P{Math.round((item.food.protein * item.quantityGrams) / 100)}g · C
                    {Math.round((item.food.carbs * item.quantityGrams) / 100)}g · G{Math.round((item.food.fat * item.quantityGrams) / 100)}g
                  </span>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </ClientLayout>
  );
}
