import type { Metadata } from "next";
import { Badge, Button, ContinuityRing } from "@couthealth/ui";
import { differentiators, heroCopy, howItWorks, testimonials } from "../content/copy";
import { PlansSection } from "../components/PlansSection";
import { FaqSection } from "../components/FaqSection";
import { VariantSwitcher } from "../components/VariantSwitcher";
import { APP_URL } from "../lib/env";

const hero = heroCopy.cinematic;

export const metadata: Metadata = {
  title: "CoutHealth — O cuidado nunca para",
  description: hero.subheadline,
};

export default function LandingCinematic() {
  return (
    <>
      <main style={{ background: "var(--ink-900)" }}>
        {/* Hero full-bleed escuro */}
        <section
          style={{
            position: "relative",
            minHeight: "92vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "var(--sp-8) var(--sp-6)",
            overflow: "hidden",
            backgroundImage:
              "radial-gradient(ellipse at 20% -10%, rgba(247,190,0,0.14), transparent 55%), radial-gradient(ellipse at 100% 100%, rgba(74,79,84,0.35), transparent 60%)",
          }}
        >
          <div
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              opacity: 0.05,
              backgroundImage:
                "repeating-radial-gradient(circle at 50% 50%, transparent 0, transparent 60px, var(--gray-100) 61px, transparent 62px)",
              backgroundSize: "140px 140px",
            }}
          />
          <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "center", position: "relative" }}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "var(--sp-6)" }}>
              <Badge tone="accent">Nutrição + treino · acompanhamento humano</Badge>
            </div>
            <p style={{ color: "var(--accent)", fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase", fontSize: "var(--fs-caption)" }}>
              {hero.eyebrow}
            </p>
            <h1 className="display" style={{ fontSize: "var(--fs-display-lg)", lineHeight: 1.05, margin: "var(--sp-4) 0" }}>
              {hero.headline}
            </h1>
            <p style={{ color: "var(--text-secondary)", fontSize: "var(--fs-title-sm)", maxWidth: 560, margin: "0 auto var(--sp-8)" }}>
              {hero.subheadline}
            </p>
            <div style={{ display: "flex", gap: "var(--sp-4)", justifyContent: "center", flexWrap: "wrap" }}>
              <Button href={`${APP_URL}/criar-conta`}>Criar conta</Button>
              <Button variant="secondary" href="#como-funciona">
                Como funciona
              </Button>
            </div>
          </div>
        </section>

        {/* Como funciona — ciclo contínuo */}
        <section id="como-funciona" style={{ padding: "var(--sp-16) var(--sp-6)", maxWidth: 1080, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "var(--sp-6)", marginBottom: "var(--sp-8)", flexWrap: "wrap" }}>
            <ContinuityRing progress={0.75} size={56} />
            <div>
              <h2 className="display" style={{ fontSize: "var(--fs-display-sm)", margin: 0 }}>
                O problema não é você — é o método
              </h2>
              <p style={{ color: "var(--text-secondary)", margin: "8px 0 0" }}>Um ciclo contínuo, não um plano estático.</p>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "var(--sp-4)" }}>
            {howItWorks.map((step) => (
              <div
                key={step.step}
                style={{
                  background: "rgba(23,24,27,0.6)",
                  backdropFilter: "blur(6px)",
                  border: "1px solid var(--border-hairline)",
                  borderRadius: "var(--r-lg)",
                  padding: "var(--sp-6)",
                }}
              >
                <span className="display" style={{ color: "var(--accent)", fontSize: "var(--fs-title-lg)" }}>
                  {step.step}
                </span>
                <h3 style={{ fontSize: "var(--fs-title-sm)", margin: "var(--sp-2) 0" }}>{step.title}</h3>
                <p style={{ color: "var(--text-secondary)", fontSize: "var(--fs-body-sm)", margin: 0 }}>{step.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Diferenciais */}
        <section style={{ padding: "var(--sp-16) var(--sp-6)", maxWidth: 1080, margin: "0 auto" }}>
          <h2 className="display" style={{ fontSize: "var(--fs-display-sm)", marginBottom: "var(--sp-8)" }}>
            Tecnologia nos bastidores, profissional na linha de frente
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "var(--sp-6)" }}>
            {differentiators.map((d) => (
              <div key={d.title} style={{ borderLeft: "2px solid var(--accent)", paddingLeft: "var(--sp-4)" }}>
                <h3 style={{ fontSize: "var(--fs-title-sm)", margin: "0 0 8px" }}>{d.title}</h3>
                <p style={{ color: "var(--text-secondary)", fontSize: "var(--fs-body-sm)", margin: 0 }}>{d.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Depoimentos */}
        <section style={{ padding: "var(--sp-16) var(--sp-6)", background: "var(--ink-800)" }}>
          <div style={{ maxWidth: 1080, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "var(--sp-6)" }}>
            {testimonials.map((t) => (
              <div key={t.quote} style={{ background: "var(--bg-card)", border: "1px solid var(--border-hairline)", borderRadius: "var(--r-lg)", padding: "var(--sp-6)" }}>
                <p style={{ fontSize: "var(--fs-body-lg)", lineHeight: 1.6 }}>&ldquo;{t.quote}&rdquo;</p>
                <p style={{ color: "var(--text-tertiary)", fontSize: "var(--fs-caption)", marginTop: "var(--sp-4)" }}>
                  {t.name} · {t.role}
                </p>
              </div>
            ))}
          </div>
        </section>

        <PlansSection appUrl={APP_URL} />
        <FaqSection />

        {/* CTA final */}
        <section style={{ padding: "var(--sp-16) var(--sp-6)", textAlign: "center" }}>
          <ContinuityRing progress={1} size={64} />
          <h2 className="display" style={{ fontSize: "var(--fs-display-md)", margin: "var(--sp-6) 0" }}>
            Comece seu ciclo de acompanhamento
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
      <VariantSwitcher current="/" />
    </>
  );
}
