import type { Metadata } from "next";

export const metadata: Metadata = { title: "Termos de Uso — CoutHealth" };

export default function TermsOfUse() {
  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: "var(--sp-16) var(--sp-6)" }}>
      <h1 className="display" style={{ fontSize: "var(--fs-display-sm)" }}>
        Termos de Uso
      </h1>
      <p style={{ color: "var(--text-secondary)", lineHeight: 1.7 }}>
        A CoutHealth é uma plataforma de acompanhamento profissional contínuo em nutrição e treino. A plataforma não
        substitui a avaliação de um profissional de saúde e não gera planos alimentares ou de treino de forma
        automática — toda decisão clínica é tomada e publicada por um profissional habilitado.
      </p>
      <p style={{ color: "var(--text-secondary)", lineHeight: 1.7 }}>
        Ao criar uma conta, você concorda com a coleta e o tratamento dos seus dados conforme a Política de
        Privacidade, com as condições do plano escolhido (valores, período e política de cancelamento) e com o uso
        adequado dos canais de mensagens da plataforma.
      </p>
      <p style={{ color: "var(--text-tertiary)", fontSize: "var(--fs-caption)" }}>
        Texto placeholder — versão jurídica definitiva será revisada antes do go-live (Fase 10, ver escopo.md §13.10).
      </p>
    </main>
  );
}
