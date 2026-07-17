import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button, Card } from "@couthealth/ui";
import { paymentsApi, ApiError, type CheckoutResponse } from "../lib/api";
import { useAuth } from "../lib/auth";

type Method = "pix" | "cartao";

export function CheckoutPage() {
  const [params] = useSearchParams();
  const { accessToken } = useAuth();
  const navigate = useNavigate();
  const [method, setMethod] = useState<Method>("pix");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CheckoutResponse | null>(null);

  const planCode = (params.get("plano") ?? "").toUpperCase();
  const period = (params.get("periodo") ?? "mensal").toUpperCase();
  const couponCode = params.get("cupom") ?? undefined;

  async function confirm() {
    if (!accessToken) return;
    setLoading(true);
    setError(null);
    try {
      const res = await paymentsApi.checkout({ planCode, period, couponCode, method }, accessToken);
      setResult(res);
      if (res.status === "APPROVED") {
        setTimeout(() => navigate("/app"), 1800);
      }
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Não foi possível processar o pagamento.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "var(--sp-6)" }}>
      <Card style={{ width: "100%", maxWidth: 440, display: "flex", flexDirection: "column", gap: "var(--sp-6)" }}>
        <div>
          <h1 className="display" style={{ fontSize: "var(--fs-title-lg)", margin: 0 }}>
            Pagamento
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "var(--fs-body-sm)", margin: "8px 0 0" }}>
            Plano {planCode} · {period.toLowerCase()}
          </p>
        </div>

        {!result && (
          <>
            <div style={{ display: "flex", gap: "var(--sp-3)" }}>
              <Button variant={method === "pix" ? "primary" : "secondary"} onClick={() => setMethod("pix")} style={{ flex: 1 }}>
                PIX
              </Button>
              <Button variant={method === "cartao" ? "primary" : "secondary"} onClick={() => setMethod("cartao")} style={{ flex: 1 }}>
                Cartão
              </Button>
            </div>
            {error && <p style={{ color: "var(--danger)", fontSize: "var(--fs-body-sm)", margin: 0 }}>{error}</p>}
            <Button onClick={confirm} disabled={loading}>
              {loading ? "Processando…" : "Confirmar pagamento"}
            </Button>
          </>
        )}

        {result && result.status === "APPROVED" && (
          <div style={{ textAlign: "center" }}>
            <p style={{ color: "var(--success)", fontWeight: 600 }}>Pagamento aprovado! Sua conta foi liberada.</p>
            <p style={{ color: "var(--text-secondary)", fontSize: "var(--fs-body-sm)" }}>Redirecionando…</p>
          </div>
        )}

        {result && result.status === "PENDING" && result.checkoutUrl && (
          <div style={{ textAlign: "center" }}>
            <p style={{ color: "var(--text-secondary)" }}>Finalize o pagamento para liberar sua conta:</p>
            <Button href={result.checkoutUrl} target="_blank" rel="noreferrer">
              Ir para o pagamento
            </Button>
          </div>
        )}
      </Card>
    </main>
  );
}
