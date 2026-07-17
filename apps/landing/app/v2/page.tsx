import type { Metadata } from "next";
import { Button, ContinuityRing } from "@couthealth/ui";
import { differentiators, heroCopy, howItWorks, testimonials } from "../../content/copy";
import { PlansSection } from "../../components/PlansSection";
import { FaqSection } from "../../components/FaqSection";
import { VariantSwitcher } from "../../components/VariantSwitcher";
import { APP_URL } from "../../lib/env";

const hero = heroCopy.clinical;

export const metadata: Metadata = {
  title: "CoutHealth — Um ciclo contínuo de cuidado",
  description: hero.subheadline,
};

export default function LandingClinical() {
  return (
    <>
      <main style={{ background: "var(--ink-900)" }}>
        {/* Hero — o ciclo é o herói, não uma foto */}
        <section style={{ padding: "var(--sp-16) var(--sp-6) var(--sp-16)", maxWidth: 880, margin: "0 auto", textAlign: "center" }}>
          <p style={{ color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.08em", fontSize: "var(--fs-caption)", marginBottom: "var(--sp-8)" }}>
            {hero.eyebrow}
          </p>

          {/* Diagrama do ciclo: anel central + 4 etapas ao redor, representado de forma linear/calma */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "var(--sp-8)" }}>
            <ContinuityRing progress={0.8} size={140} strokeWidth={6} />
          </div>

          <h1 className="display" style={{ fontSize: "var(--fs-display-md)", lineHeight: 1.15, fontWeight: 600, margin: "0 0 var(--sp-6)" }}>
            {hero.headline}
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "var(--fs-body-lg)", maxWidth: 480, margin: "0 auto var(--sp-8)" }}>
            {hero.subheadline}
          </p>
          <Button href={`${APP_URL}/criar-conta`}>Criar conta</Button>

          <div style={{ display: "flex", justifyContent: "center", gap: "var(--sp-12)", marginTop: "var(--sp-16)", flexWrap: "wrap" }}>
            {howItWorks.map((step, i) => (
              <div key={step.step} style={{ maxWidth: 180, textAlign: "left" }}>
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: i === 0 ? "var(--accent)" : "var(--border-hairline)",
                    marginBottom: "var(--sp-3)",
                  }}
                />
                <h3 style={{ fontSize: "var(--fs-body-sm)", fontWeight: 600, margin: "0 0 4px" }}>{step.title}</h3>
                <p style={{ color: "var(--text-tertiary)", fontSize: "var(--fs-caption)", margin: 0, lineHeight: 1.5 }}>{step.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Diferenciais — texto denso, confiança */}
        <section style={{ padding: "var(--sp-16) var(--sp-6)", background: "var(--ink-800)" }}>
          <div style={{ maxWidth: 720, margin: "0 auto" }}>
            <h2 className="display" style={{ fontSize: "var(--fs-title-lg)", fontWeight: 600, marginBottom: "var(--sp-8)", textAlign: "center" }}>
              Método antes de tecnologia
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-8)" }}>
              {differentiators.map((d) => (
                <div key={d.title} style={{ display: "flex", gap: "var(--sp-6)", alignItems: "baseline" }}>
                  <span style={{ color: "var(--text-tertiary)", fontSize: "var(--fs-caption)", minWidth: 24 }}>—</span>
                  <div>
                    <h3 style={{ fontSize: "var(--fs-body-lg)", fontWeight: 600, margin: "0 0 6px" }}>{d.title}</h3>
                    <p style={{ color: "var(--text-secondary)", fontSize: "var(--fs-body-sm)", lineHeight: 1.6, margin: 0 }}>{d.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Depoimentos — citação única em destaque, rotativo estático */}
        <section style={{ padding: "var(--sp-16) var(--sp-6)", maxWidth: 640, margin: "0 auto", textAlign: "center" }}>
          {testimonials.slice(0, 1).map((t) => (
            <blockquote key={t.quote} style={{ margin: 0 }}>
              <p className="display" style={{ fontSize: "var(--fs-title-lg)", fontWeight: 500, lineHeight: 1.4 }}>
                &ldquo;{t.quote}&rdquo;
              </p>
              <footer style={{ color: "var(--text-tertiary)", fontSize: "var(--fs-caption)", marginTop: "var(--sp-4)" }}>
                {t.name} · {t.role}
              </footer>
            </blockquote>
          ))}
        </section>

        <PlansSection appUrl={APP_URL} />
        <FaqSection />

        <section style={{ padding: "var(--sp-16) var(--sp-6)", textAlign: "center" }}>
          <h2 className="display" style={{ fontSize: "var(--fs-title-lg)", fontWeight: 600, margin: "0 0 var(--sp-6)" }}>
            Seu ciclo de acompanhamento começa agora
          </h2>
          <Button href={`${APP_URL}/criar-conta`}>Criar conta</Button>
        </section>

        <footer style={{ padding: "var(--sp-8) var(--sp-6)", borderTop: "1px solid var(--border-hairline)", textAlign: "center", color: "var(--text-tertiary)", fontSize: "var(--fs-caption)" }}>
          <p>CoutHealth · Rafael Coutinho — Personal Trainer e Nutricionista</p>
          <div style={{ display: "flex", gap: "var(--sp-4)", justifyContent: "center", marginTop: "var(--sp-2)" }}>
            <a href="/politica-de-privacidade" style={{ color: "inherit" }}>Política de Privacidade</a>
            <a href="/termos-de-uso" style={{ color: "inherit" }}>Termos de Uso</a>
          </div>
        </footer>
      </main>
      <VariantSwitcher current="/v2" />
    </>
  );
}
