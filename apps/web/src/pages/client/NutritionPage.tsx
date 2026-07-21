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
    <ClientLayout title="Nutrição">
      <div style={{ maxWidth: 820 }}>
        {loading && <p style={{ color: "var(--text-secondary)" }}>Carregando…</p>}
        {!loading && !mealPlan && <p style={{ color: "var(--text-secondary)" }}>Nenhum plano alimentar publicado ainda.</p>}

        <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-4)" }}>
          {mealPlan?.meals?.map((meal: any) => (
            <Card key={meal.id} style={{ padding: "var(--sp-6) var(--sp-8)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--sp-4)" }}>
                <h3 className="display" style={{ fontSize: "1.0625rem", fontWeight: 600, margin: 0 }}>
                  {meal.name}
                </h3>
                <span style={{ fontSize: "0.8125rem", color: "var(--text-secondary)" }}>{meal.time}</span>
              </div>
              {meal.notes && (
                <p style={{ color: "var(--text-secondary)", fontSize: "var(--fs-body-sm)", marginTop: 0 }}>{meal.notes}</p>
              )}
              <div>
                {meal.items.map((item: any) => (
                  <div
                    key={item.id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "10px 0",
                      borderTop: "1px solid var(--border-hairline)",
                      fontSize: "0.9375rem",
                    }}
                  >
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
      </div>
    </ClientLayout>
  );
}
