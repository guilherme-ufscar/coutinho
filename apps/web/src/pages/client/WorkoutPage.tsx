import { useEffect, useState } from "react";
import { Badge, Card } from "@couthealth/ui";
import { clientApi } from "../../lib/api";
import { useAuth } from "../../lib/auth";
import { ClientLayout } from "./ClientLayout";

export function WorkoutPage() {
  const { accessToken } = useAuth();
  const [workouts, setWorkouts] = useState<any[]>([]);
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    if (!accessToken) return;
    clientApi.workouts(accessToken).then((data) => {
      setWorkouts(data);
      if (data[0]) setActive(data[0].id);
    });
  }, [accessToken]);

  const current = workouts.find((w) => w.id === active);

  return (
    <ClientLayout>
      <h1 className="display" style={{ fontSize: "var(--fs-display-sm)", marginBottom: "var(--sp-6)" }}>
        Treino
      </h1>

      {workouts.length === 0 && <p style={{ color: "var(--text-secondary)" }}>Nenhum treino publicado ainda.</p>}

      <div style={{ display: "flex", gap: "var(--sp-2)", marginBottom: "var(--sp-6)" }}>
        {workouts.map((w) => (
          <button
            key={w.id}
            onClick={() => setActive(w.id)}
            style={{
              padding: "8px 16px",
              borderRadius: "var(--r-full)",
              border: "1px solid var(--border-hairline)",
              background: w.id === active ? "var(--accent-grad, var(--accent))" : "transparent",
              color: w.id === active ? "var(--ink-900)" : "var(--text-secondary)",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Treino {w.letter}
          </button>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-4)" }}>
        {current?.exercises?.map((we: any) => (
          <Card key={we.id}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <h3 style={{ margin: 0 }}>{we.exercise.name}</h3>
                <Badge>{we.exercise.muscleGroup}</Badge>
              </div>
              <span style={{ color: "var(--accent)", fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>
                {we.sets}x{we.reps}
              </span>
            </div>
            {(we.load || we.restSeconds) && (
              <p style={{ color: "var(--text-secondary)", fontSize: "var(--fs-body-sm)" }}>
                {we.load ? `Carga: ${we.load}` : ""} {we.restSeconds ? `· Intervalo: ${we.restSeconds}s` : ""}
              </p>
            )}
            {we.notes && <p style={{ color: "var(--text-secondary)", fontSize: "var(--fs-body-sm)" }}>{we.notes}</p>}
            {we.exercise.videoUrl && (
              <a href={we.exercise.videoUrl} target="_blank" rel="noreferrer" style={{ color: "var(--accent)", fontSize: "var(--fs-body-sm)" }}>
                Ver vídeo demonstrativo →
              </a>
            )}
          </Card>
        ))}
      </div>
    </ClientLayout>
  );
}
