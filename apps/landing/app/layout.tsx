import "@couthealth/ui/tokens.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CoutHealth — Acompanhamento profissional contínuo",
  description:
    "CoutHealth cria um ciclo contínuo de acompanhamento profissional em nutrição e treino, onde a tecnologia organiza e potencializa o cuidado — sempre sob decisão humana.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
