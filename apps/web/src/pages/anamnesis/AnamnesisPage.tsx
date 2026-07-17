import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, ContinuityRing } from "@couthealth/ui";
import { anamnesisApi, assessmentsApi, ApiError } from "../../lib/api";
import { useAuth } from "../../lib/auth";
import { steps } from "./steps";
import { StepField } from "./StepField";

export function AnamnesisPage() {
  const { accessToken } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stepIndex, setStepIndex] = useState(0);
  const [formData, setFormData] = useState<Record<string, unknown>>({});
  const [assessmentData, setAssessmentData] = useState<Record<string, number | undefined>>({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);

  useEffect(() => {
    if (!accessToken) return;
    anamnesisApi
      .getMine(accessToken)
      .then((data) => {
        const { id, status, currentStep, userId, createdAt, updatedAt, submittedAt, analyzedAt, ...fields } = data as any;
        setFormData(fields);
        setStepIndex(Math.min(currentStep ?? 0, steps.length - 1));
        setAlreadySubmitted(status !== "RASCUNHO");
      })
      .catch(() => setError("Não foi possível carregar sua anamnese."))
      .finally(() => setLoading(false));
  }, [accessToken]);

  function setValue(key: string, value: unknown) {
    if (key.startsWith("assessment.")) {
      setAssessmentData((prev) => ({ ...prev, [key.replace("assessment.", "")]: value as number | undefined }));
    } else {
      setFormData((prev) => ({ ...prev, [key]: value }));
    }
  }

  async function saveProgress(nextStep: number) {
    if (!accessToken) return;
    setSaving(true);
    setError(null);
    try {
      await anamnesisApi.updateMine({ ...formData, currentStep: nextStep }, accessToken);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Não foi possível salvar. Tente novamente.");
      throw err;
    } finally {
      setSaving(false);
    }
  }

  async function handleAnswerLater() {
    try {
      await saveProgress(stepIndex);
      navigate("/app");
    } catch {
      // erro já exibido
    }
  }

  async function handleNext() {
    const isLast = stepIndex === steps.length - 1;
    try {
      if (!isLast) {
        await saveProgress(stepIndex + 1);
        setStepIndex((s) => s + 1);
        return;
      }
      // Última etapa: salva, cria avaliação física inicial (se preenchida) e envia.
      await saveProgress(stepIndex);
      const hasAssessment = Object.values(assessmentData).some((v) => v !== undefined && v !== null);
      if (hasAssessment && accessToken) {
        await assessmentsApi.create(assessmentData, accessToken);
      }
      if (accessToken) await anamnesisApi.submitMine(accessToken);
      navigate("/app");
    } catch {
      // erro já exibido
    }
  }

  if (loading) return null;

  if (alreadySubmitted) {
    return (
      <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "var(--sp-6)" }}>
        <div>
          <ContinuityRing progress={1} size={64} />
          <h1 className="display" style={{ margin: "var(--sp-6) 0" }}>
            Anamnese já enviada
          </h1>
          <p style={{ color: "var(--text-secondary)" }}>Sua anamnese está com a equipe para análise.</p>
          <Button href="/app" style={{ marginTop: "var(--sp-6)" }}>
            Ir para o painel
          </Button>
        </div>
      </main>
    );
  }

  const step = steps[stepIndex];
  const isLast = stepIndex === steps.length - 1;
  const progress = (stepIndex + 1) / steps.length;

  return (
    <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", padding: "var(--sp-8) var(--sp-6)" }}>
      <div style={{ width: "100%", maxWidth: 560, display: "flex", flexDirection: "column", gap: "var(--sp-6)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--sp-4)" }}>
          <ContinuityRing progress={progress} size={48} strokeWidth={5} />
          <div>
            <p style={{ color: "var(--text-tertiary)", fontSize: "var(--fs-caption)", margin: 0 }}>
              Etapa {stepIndex + 1} de {steps.length}
            </p>
            <h1 className="display" style={{ fontSize: "var(--fs-title-lg)", margin: 0 }}>
              {step.title}
            </h1>
          </div>
        </div>

        {step.description && <p style={{ color: "var(--text-secondary)", fontSize: "var(--fs-body-sm)", margin: 0 }}>{step.description}</p>}

        <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-4)" }}>
          {step.fields.map((field) => (
            <StepField
              key={field.key}
              field={field}
              value={field.key.startsWith("assessment.") ? assessmentData[field.key.replace("assessment.", "")] : formData[field.key]}
              onChange={(v) => setValue(field.key, v)}
            />
          ))}
        </div>

        {error && <p style={{ color: "var(--danger)", fontSize: "var(--fs-body-sm)", margin: 0 }}>{error}</p>}

        <div style={{ display: "flex", justifyContent: "space-between", gap: "var(--sp-3)" }}>
          <Button variant="ghost" onClick={handleAnswerLater} disabled={saving}>
            Responder depois
          </Button>
          <div style={{ display: "flex", gap: "var(--sp-3)" }}>
            {stepIndex > 0 && (
              <Button variant="secondary" onClick={() => setStepIndex((s) => s - 1)} disabled={saving}>
                Voltar
              </Button>
            )}
            <Button onClick={handleNext} disabled={saving}>
              {saving ? "Salvando…" : isLast ? "Concluir" : "Avançar"}
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
