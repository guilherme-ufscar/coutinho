import type { Metadata } from "next";
import { Button, ContinuityRing } from "@couthealth/ui";
import { differentiators, heroCopy, howItWorks, testimonials } from "../../content/copy";
import { PlansSection } from "../../components/PlansSection";
import { FaqSection } from "../../components/FaqSection";
import { VariantSwitcher } from "../../components/VariantSwitcher";
import { APP_URL } from "../../lib/env";

const hero = heroCopy.editorial;

export const metadata: Metadata = {
  title: "CoutHealth — Seu método, seu profissional, sua continuidade",
  description: hero.subheadline,
};

const diffImages = [
  "https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=700&q=75",
  "https://images.unsplash.com/photo-1571731956672-f2b94d7dd0cb?auto=format&fit=crop&w=700&q=75",
  "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=700&q=75",
];

const lightVars: React.CSSProperties = {
  ["--bg-base" as string]: "#EDEDED",
  ["--bg-surface" as string]: "#FFFFFF",
  ["--bg-card" as string]: "#FFFFFF",
  ["--border-hairline" as string]: "#D8D8D8",
  ["--text-primary" as string]: "#222222",
  ["--text-secondary" as string]: "#4A4F54",
  ["--text-tertiary" as string]: "#7A7E82",
  background: "var(--bg-base)",
  color: "var(--text-primary)",
};

export default function LandingEditorial() {
  return (
    <>
      <main style={lightVars}>
        {/* Hero editorial — grid tipográfico, headline enorme, pattern "C" como textura */}
        <section
          style={{
            position: "relative",
            padding: "var(--sp-16) var(--sp-6) var(--sp-12)",
            borderBottom: "1px solid var(--border-hairline)",
            overflow: "hidden",
          }}
        >
          <div
            aria-hidden
            style={{
              position: "absolute",
              right: "-10%",
              top: "-20%",
              width: 480,
              height: 480,
              borderRadius: "50%",
              border: "48px solid rgba(247,190,0,0.12)",
            }}
          />
          <div style={{ maxWidth: 1080, margin: "0 auto", position: "relative", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "var(--sp-10)", alignItems: "center" }}>
            <div>
              <p style={{ color: "var(--ink-700)", fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase", fontSize: "var(--fs-caption)", marginBottom: "var(--sp-4)" }}>
                {hero.eyebrow}
              </p>
              <h1
                className="display"
                style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)", lineHeight: 0.98, fontWeight: 700, margin: "0 0 var(--sp-8)" }}
              >
                {hero.headline}
              </h1>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "var(--sp-8)", alignItems: "end" }}>
                <p style={{ fontSize: "var(--fs-title-sm)", color: "var(--text-secondary)", margin: 0 }}>{hero.subheadline}</p>
                <div style={{ display: "flex", gap: "var(--sp-4)", justifyContent: "flex-start", flexWrap: "wrap" }}>
                  <Button href={`${APP_URL}/criar-conta`}>Criar conta</Button>
                  <Button variant="secondary" href="#como-funciona" style={{ borderColor: "var(--ink-700)", color: "var(--ink-700)" }}>
                    Como funciona
                  </Button>
                </div>
              </div>
            </div>
            <div style={{ position: "relative" }}>
              <div
                aria-hidden
                style={{ position: "absolute", top: -24, left: -24, width: 120, height: 120, borderRadius: "50%", border: "20px solid rgba(247,190,0,0.35)", zIndex: 0 }}
              />
              <img
                src="https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=1200&q=75"
                alt=""
                loading="lazy"
                style={{ position: "relative", width: "100%", height: 420, objectFit: "cover", borderRadius: "var(--r-lg)", zIndex: 1 }}
              />
            </div>
          </div>
        </section>

        {/* Como funciona — colunas numeradas estilo editorial */}
        <section id="como-funciona" style={{ padding: "var(--sp-16) var(--sp-6)", maxWidth: 1080, margin: "0 auto" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              borderTop: "2px solid var(--ink-700)",
            }}
          >
            {howItWorks.map((step) => (
              <div key={step.step} style={{ padding: "var(--sp-6) var(--sp-4) 0", borderLeft: "1px solid var(--border-hairline)" }}>
                <span className="display" style={{ fontSize: "var(--fs-display-sm)", fontWeight: 700 }}>
                  {step.step}
                </span>
                <h3 style={{ fontSize: "var(--fs-body-lg)", fontWeight: 700, margin: "var(--sp-3) 0 8px" }}>{step.title}</h3>
                <p style={{ color: "var(--text-secondary)", fontSize: "var(--fs-body-sm)", margin: 0 }}>{step.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Diferenciais — bloco amarelo forte */}
        <section style={{ padding: "var(--sp-16) var(--sp-6)", background: "var(--ink-700)", color: "var(--white)" }}>
          <div style={{ maxWidth: 1080, margin: "0 auto" }}>
            <h2 className="display" style={{ fontSize: "var(--fs-display-sm)", color: "var(--accent)", marginBottom: "var(--sp-8)" }}>
              Diferenciais
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "var(--sp-8)" }}>
              {differentiators.map((d, i) => (
                <div key={d.title}>
                  <img
                    src={diffImages[i]}
                    alt=""
                    loading="lazy"
                    style={{ width: "100%", height: 150, objectFit: "cover", borderRadius: "var(--r-md)", marginBottom: "var(--sp-4)" }}
                  />
                  <h3 style={{ fontSize: "var(--fs-title-sm)", margin: "0 0 8px" }}>{d.title}</h3>
                  <p style={{ color: "var(--gray-300)", fontSize: "var(--fs-body-sm)", margin: 0 }}>{d.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Depoimentos — grid editorial */}
        <section style={{ padding: "var(--sp-16) var(--sp-6)", maxWidth: 1080, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "var(--sp-8)" }}>
            {testimonials.map((t) => (
              <div key={t.quote} style={{ borderTop: "2px solid var(--accent)", paddingTop: "var(--sp-4)" }}>
                <p style={{ fontSize: "var(--fs-body-lg)", lineHeight: 1.5 }}>&ldquo;{t.quote}&rdquo;</p>
                <p style={{ color: "var(--text-tertiary)", fontSize: "var(--fs-caption)", marginTop: "var(--sp-4)" }}>
                  {t.name} · {t.role}
                </p>
              </div>
            ))}
          </div>
        </section>

        <div
          style={{
            background: "#0E0F11",
            ["--bg-base" as string]: "#0E0F11",
            ["--bg-surface" as string]: "#17181B",
            ["--bg-card" as string]: "#222222",
            ["--border-hairline" as string]: "#2C2E32",
            ["--text-primary" as string]: "#FFFFFF",
            ["--text-secondary" as string]: "#9A9DA2",
            ["--text-tertiary" as string]: "#4A4F54",
          } as React.CSSProperties}
        >
          <PlansSection appUrl={APP_URL} />
          <FaqSection />
        </div>

        <section style={{ padding: "var(--sp-16) var(--sp-6)", textAlign: "center" }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "var(--sp-6)" }}>
            <ContinuityRing progress={1} size={56} />
          </div>
          <h2 className="display" style={{ fontSize: "var(--fs-display-sm)", margin: "0 0 var(--sp-6)" }}>
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
      <VariantSwitcher current="/v3" />
    </>
  );
}
