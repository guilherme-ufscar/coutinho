// Copy compartilhado pelas 3 direções de landing (mesmo conteúdo, muda só a direção visual).
// Preços são placeholders configuráveis no admin (escopo.md §13.0).

export const howItWorks = [
  {
    step: "01",
    title: "Cadastro",
    description: "Você cria a conta e escolhe o plano de acompanhamento que faz sentido pra sua rotina.",
  },
  {
    step: "02",
    title: "Anamnese",
    description: "Um formulário único reúne objetivo, alimentação, saúde, sono, hábitos e avaliação física.",
  },
  {
    step: "03",
    title: "Análise profissional",
    description: "Rafael analisa seus dados e monta sua estratégia — nenhuma decisão clínica é automática.",
  },
  {
    step: "04",
    title: "Acompanhamento contínuo",
    description: "Plano e treino publicados, check-ins regulares e revisão periódica ao longo do ciclo.",
  },
] as const;

export const differentiators = [
  {
    title: "Tecnologia + profissional humano",
    description: "A plataforma organiza e automatiza os bastidores. Toda decisão clínica continua sendo do Rafael.",
  },
  {
    title: "Cuidado contínuo, não um PDF",
    description: "Nada de plano estático: revisão periódica, check-ins e ajustes fazem parte do acompanhamento.",
  },
  {
    title: "Tudo em um só lugar",
    description: "Nutrição, treino, biblioteca, mensagens e evolução — sem planilha solta, sem PDF perdido no WhatsApp.",
  },
] as const;

export const testimonials = [
  {
    quote: "Pela primeira vez senti que alguém estava acompanhando de verdade, não só me mandando uma dieta pronta.",
    name: "Cliente CoutHealth",
    role: "Plano Plus",
  },
  {
    quote: "Os check-ins me ajudaram a manter a consistência nas semanas difíceis — isso fez toda a diferença.",
    name: "Cliente CoutHealth",
    role: "Plano Elite",
  },
  {
    quote: "Consigo ver treino, plano alimentar e conversar com a equipe no mesmo app. Muito mais simples.",
    name: "Cliente CoutHealth",
    role: "Plano Essencial",
  },
] as const;

export interface PlanCopy {
  id: "essencial" | "plus" | "elite";
  name: string;
  tagline: string;
  monthlyPrice: number;
  features: string[];
}

export const plans: PlanCopy[] = [
  {
    id: "essencial",
    name: "Essencial",
    tagline: "Acompanhamento contínuo com revisão mensal.",
    monthlyPrice: 149,
    features: [
      "Plano alimentar personalizado",
      "Treino personalizado",
      "Biblioteca de conteúdos",
      "Mensagens com a equipe",
      "Check-ins regulares",
      "Revisão 1× por mês",
    ],
  },
  {
    id: "plus",
    name: "Plus",
    tagline: "Mais frequência e prioridade no atendimento.",
    monthlyPrice: 219,
    features: [
      "Tudo do Essencial",
      "Revisão a cada 15 dias",
      "Atendimento prioritário",
      "Check-ins mais frequentes",
    ],
  },
  {
    id: "elite",
    name: "Elite",
    tagline: "O acompanhamento mais próximo, com teleconsulta.",
    monthlyPrice: 349,
    features: ["Tudo do Plus", "1 teleconsulta mensal (até 1h)"],
  },
];

export const faq = [
  {
    question: "A CoutHealth gera minha dieta e treino automaticamente?",
    answer:
      "Não. A tecnologia organiza seus dados, mas toda dieta e treino são montados e publicados por um profissional humano — nunca por um algoritmo.",
  },
  {
    question: "Preciso ter experiência com treino ou dieta pra começar?",
    answer: "Não. A anamnese inicial capta seu nível atual, rotina e restrições para montar um plano adequado ao seu ponto de partida.",
  },
  {
    question: "Como funciona a revisão periódica?",
    answer:
      "De acordo com seu plano, o Rafael revisa sua evolução e ajusta plano/treino a cada 15 ou 30 dias, com base nos check-ins e nas medidas registradas.",
  },
  {
    question: "Posso mudar de plano depois?",
    answer: "Sim, a qualquer momento pelo painel — o ajuste de cobrança é proporcional ao período restante.",
  },
  {
    question: "Meus dados de saúde estão seguros?",
    answer:
      "Sim. Dados de saúde são tratados como sensíveis: consentimento explícito, criptografia em trânsito e controle de acesso por papel, conforme a LGPD.",
  },
] as const;

export const heroCopy = {
  cinematic: {
    eyebrow: "Acompanhamento contínuo, não um PDF de dieta",
    headline: "O cuidado nunca para. Sua evolução, também não.",
    subheadline:
      "A CoutHealth cria um ciclo contínuo de acompanhamento profissional em nutrição e treino — a tecnologia organiza, a decisão é sempre humana.",
  },
  clinical: {
    eyebrow: "Um ciclo, não um evento único",
    headline: "Cadastro. Anamnese. Análise profissional. Acompanhamento. Sempre girando.",
    subheadline: "Cada etapa do seu cuidado é acompanhada de perto — com método, confiança e revisão constante.",
  },
  editorial: {
    eyebrow: "Nutrição e treino, com acompanhamento de verdade",
    headline: "Seu método. Seu profissional. Sua continuidade.",
    subheadline: "Um único lugar para nutrição, treino e evolução — conduzido por quem entende do seu caso.",
  },
} as const;

export const footerLinks = {
  legal: [
    { label: "Política de Privacidade", href: "/politica-de-privacidade" },
    { label: "Termos de Uso", href: "/termos-de-uso" },
  ],
};
