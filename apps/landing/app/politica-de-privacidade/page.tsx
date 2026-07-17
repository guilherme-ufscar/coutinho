import type { Metadata } from "next";

export const metadata: Metadata = { title: "Política de Privacidade — CoutHealth" };

export default function PrivacyPolicy() {
  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: "var(--sp-16) var(--sp-6)" }}>
      <h1 className="display" style={{ fontSize: "var(--fs-display-sm)" }}>
        Política de Privacidade
      </h1>
      <p style={{ color: "var(--text-secondary)", lineHeight: 1.7 }}>
        A CoutHealth trata dados de saúde como dados sensíveis, conforme a LGPD (Lei nº 13.709/2018). Coletamos
        apenas as informações necessárias para o acompanhamento profissional contínuo (anamnese, avaliações físicas,
        mensagens e evolução), sempre com o seu consentimento explícito no cadastro.
      </p>
      <p style={{ color: "var(--text-secondary)", lineHeight: 1.7 }}>
        Seus dados são criptografados em trânsito, o acesso é controlado por papel (você só vê os seus dados; a
        equipe profissional acessa apenas o necessário para o atendimento) e mantemos trilha de auditoria de acessos
        e alterações. Você pode solicitar exclusão ou portabilidade dos seus dados a qualquer momento pelo painel ou
        pelo canal de contato da equipe.
      </p>
      <p style={{ color: "var(--text-tertiary)", fontSize: "var(--fs-caption)" }}>
        Texto placeholder — versão jurídica definitiva será revisada antes do go-live (Fase 10, ver escopo.md §13.10).
      </p>
    </main>
  );
}
