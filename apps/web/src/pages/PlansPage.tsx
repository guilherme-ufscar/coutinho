import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button, PeriodToggle, PlanCard, TextField, PERIOD_DISCOUNT, type Period } from "@couthealth/ui";
import { plansApi, couponsApi, ApiError, type Plan } from "../lib/api";

function formatPrice(monthly: number, period: Period) {
  const effective = monthly * (1 - PERIOD_DISCOUNT[period]);
  return effective.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
}

export function PlansPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [period, setPeriod] = useState<Period>((params.get("periodo")?.toLowerCase() as Period) || "mensal");
  const [couponCode, setCouponCode] = useState("");
  const [couponStatus, setCouponStatus] = useState<{ valid: boolean; message: string } | null>(null);

  useEffect(() => {
    plansApi.list().then(setPlans).catch(() => setPlans([]));
  }, []);

  async function checkCoupon() {
    if (!couponCode) {
      setCouponStatus(null);
      return;
    }
    try {
      const res = await couponsApi.validate(couponCode);
      setCouponStatus({ valid: true, message: `Cupom aplicado: -${Math.round(res.percentOff * 100)}%` });
    } catch (err) {
      setCouponStatus({ valid: false, message: err instanceof ApiError ? err.message : "Cupom inválido." });
    }
  }

  function selectPlan(planCode: string) {
    const query = new URLSearchParams({ plano: planCode.toLowerCase(), periodo: period });
    if (couponStatus?.valid && couponCode) query.set("cupom", couponCode);
    navigate(`/checkout?${query.toString()}`);
  }

  const preselected = params.get("plano");

  return (
    <main style={{ minHeight: "100vh", padding: "var(--sp-16) var(--sp-6)", display: "flex", flexDirection: "column", gap: "var(--sp-8)" }}>
      <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--sp-4)" }}>
        <h1 className="display" style={{ fontSize: "var(--fs-display-sm)", margin: 0 }}>
          Escolha seu plano
        </h1>
        <p style={{ color: "var(--text-secondary)", maxWidth: 480 }}>Quanto maior o período, maior o desconto.</p>
        <PeriodToggle value={period} onChange={setPeriod} />
        <div style={{ display: "flex", gap: "var(--sp-2)", alignItems: "flex-end", maxWidth: 320, width: "100%" }}>
          <div style={{ flex: 1 }}>
            <TextField label="Cupom (opcional)" value={couponCode} onChange={(e) => setCouponCode(e.target.value.toUpperCase())} onBlur={checkCoupon} />
          </div>
        </div>
        {couponStatus && (
          <p style={{ color: couponStatus.valid ? "var(--success)" : "var(--danger)", fontSize: "var(--fs-caption)", margin: 0 }}>
            {couponStatus.message}
          </p>
        )}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "var(--sp-6)",
          maxWidth: 1080,
          margin: "0 auto",
          width: "100%",
        }}
      >
        {plans.map((plan) => (
          <PlanCard
            key={plan.id}
            name={plan.name}
            tagline={plan.tagline}
            priceLabel={`${formatPrice(plan.monthlyPrice, period)}/mês`}
            originalPriceLabel={period !== "mensal" ? `${formatPrice(plan.monthlyPrice, "mensal")}/mês` : undefined}
            features={plan.features}
            highlighted={plan.code === "PLUS" || plan.code.toLowerCase() === preselected}
            ctaLabel="Continuar"
            onSelect={() => selectPlan(plan.code)}
          />
        ))}
      </div>
    </main>
  );
}
