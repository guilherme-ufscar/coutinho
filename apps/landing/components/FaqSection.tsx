import { Accordion } from "@couthealth/ui";
import { faq } from "../content/copy";

export function FaqSection() {
  return (
    <section id="faq" style={{ padding: "var(--sp-16) var(--sp-6)", maxWidth: 720, margin: "0 auto", width: "100%" }}>
      <h2 className="display" style={{ fontSize: "var(--fs-display-sm)", textAlign: "center", marginBottom: "var(--sp-8)" }}>
        Perguntas frequentes
      </h2>
      <Accordion items={faq.map((f) => ({ question: f.question, answer: f.answer }))} />
    </section>
  );
}
