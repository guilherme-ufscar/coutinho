import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button, Card } from "@couthealth/ui";
import { paymentsApi, ApiError, type CheckoutResponse, type CheckoutConfig } from "../lib/api";
import { useAuth } from "../lib/auth";

type Method = "pix" | "cartao";

const MP_SDK_URL = "https://sdk.mercadopago.com/js/v2";

function loadMercadoPagoSdk(): Promise<void> {
  if ((window as any).MercadoPago) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = MP_SDK_URL;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Não foi possível carregar o Mercado Pago."));
    document.body.appendChild(script);
  });
}

export function CheckoutPage() {
  const [params] = useSearchParams();
  const { accessToken } = useAuth();
  const navigate = useNavigate();
  const [method, setMethod] = useState<Method>("pix");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CheckoutResponse | null>(null);
  const [config, setConfig] = useState<CheckoutConfig | null>(null);
  const [brickReady, setBrickReady] = useState(false);
  const brickContainerRef = useRef<HTMLDivElement>(null);
  const brickControllerRef = useRef<any>(null);

  const planCode = (params.get("plano") ?? "").toUpperCase();
  const period = (params.get("periodo") ?? "mensal").toUpperCase();
  const couponCode = params.get("cupom") ?? undefined;
  const amount = Number(params.get("valor") ?? 0) || undefined;

  useEffect(() => {
    paymentsApi.checkoutConfig().then(setConfig).catch(() => setConfig({ provider: "MOCK" }));
  }, []);

  // Mercado Pago: monta o Payment Brick (cartão + Google Pay quando o dispositivo é elegível) só
  // quando o método "cartão" está selecionado — PIX continua com o botão simples existente.
  useEffect(() => {
    if (config?.provider !== "MERCADOPAGO" || !config.publicKey || method !== "cartao" || result) return;
    let cancelled = false;

    loadMercadoPagoSdk()
      .then(() => {
        if (cancelled || !brickContainerRef.current) return;
        const mp = new (window as any).MercadoPago(config.publicKey, { locale: "pt-BR" });
        const bricksBuilder = mp.bricks();
        return bricksBuilder.create("payment", "mp-payment-brick", {
          initialization: { amount: amount ?? 0 },
          customization: {
            paymentMethods: { creditCard: "all", debitCard: "all", googlePay: "all" },
          },
          callbacks: {
            onReady: () => setBrickReady(true),
            onError: (err: unknown) => setError(err instanceof Error ? err.message : "Erro ao carregar o pagamento."),
            onSubmit: ({ formData }: { formData: any }) =>
              confirm({
                token: formData.token,
                paymentMethodId: formData.payment_method_id,
                installments: formData.installments,
                payerDocNumber: formData.payer?.identification?.number,
              }),
          },
        });
      })
      .then((controller) => {
        if (!cancelled) brickControllerRef.current = controller;
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Erro ao carregar o Mercado Pago."));

    return () => {
      cancelled = true;
      brickControllerRef.current?.unmount?.();
      brickControllerRef.current = null;
      setBrickReady(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config, method, result]);

  async function confirm(mercadoPagoData?: {
    token: string;
    paymentMethodId: string;
    installments: number;
    payerDocNumber?: string;
  }) {
    if (!accessToken) return;
    setLoading(true);
    setError(null);
    try {
      const res = await paymentsApi.checkout(
        {
          planCode,
          period,
          couponCode,
          method,
          ...(mercadoPagoData
            ? {
                token: mercadoPagoData.token,
                paymentMethodId: mercadoPagoData.paymentMethodId,
                installments: mercadoPagoData.installments,
                payerDocNumber: mercadoPagoData.payerDocNumber,
              }
            : {}),
        },
        accessToken
      );
      setResult(res);
      if (res.status === "APPROVED") {
        setTimeout(() => navigate("/anamnese"), 1800);
      }
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Não foi possível processar o pagamento.");
    } finally {
      setLoading(false);
    }
  }

  const showBrick = config?.provider === "MERCADOPAGO" && method === "cartao";

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
                Cartão{config?.provider === "MERCADOPAGO" ? " / Google Pay" : ""}
              </Button>
            </div>
            {error && <p style={{ color: "var(--danger)", fontSize: "var(--fs-body-sm)", margin: 0 }}>{error}</p>}

            {showBrick ? (
              <div id="mp-payment-brick" ref={brickContainerRef} />
            ) : (
              <Button onClick={() => confirm()} disabled={loading}>
                {loading ? "Processando…" : "Confirmar pagamento"}
              </Button>
            )}
            {showBrick && !brickReady && (
              <p style={{ color: "var(--text-tertiary)", fontSize: "var(--fs-body-sm)", margin: 0 }}>Carregando opções de pagamento…</p>
            )}
          </>
        )}

        {result && result.status === "APPROVED" && (
          <div style={{ textAlign: "center" }}>
            <p style={{ color: "var(--success)", fontWeight: 600 }}>Pagamento aprovado! Sua conta foi liberada.</p>
            <p style={{ color: "var(--text-secondary)", fontSize: "var(--fs-body-sm)" }}>Redirecionando…</p>
          </div>
        )}

        {result && result.status === "PENDING" && result.pixQrCode && (
          <div style={{ textAlign: "center" }}>
            <p style={{ color: "var(--text-secondary)" }}>Escaneie o QR code do PIX para pagar:</p>
            <p style={{ wordBreak: "break-all", fontSize: "var(--fs-caption)", color: "var(--text-tertiary)" }}>{result.pixQrCode}</p>
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

        {result && result.status === "FAILED" && (
          <p style={{ color: "var(--danger)", textAlign: "center" }}>Pagamento recusado. Tente outro método ou cartão.</p>
        )}
      </Card>
    </main>
  );
}
