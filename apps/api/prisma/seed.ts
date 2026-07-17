import { PrismaClient, PlanCode, Role } from "@prisma/client";
import * as argon2 from "argon2";

const prisma = new PrismaClient();

async function main() {
  await prisma.plan.upsert({
    where: { code: PlanCode.ESSENCIAL },
    update: {},
    create: {
      code: PlanCode.ESSENCIAL,
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
  });

  await prisma.plan.upsert({
    where: { code: PlanCode.PLUS },
    update: {},
    create: {
      code: PlanCode.PLUS,
      name: "Plus",
      tagline: "Mais frequência e prioridade no atendimento.",
      monthlyPrice: 219,
      features: ["Tudo do Essencial", "Revisão a cada 15 dias", "Atendimento prioritário", "Check-ins mais frequentes"],
    },
  });

  await prisma.plan.upsert({
    where: { code: PlanCode.ELITE },
    update: {},
    create: {
      code: PlanCode.ELITE,
      name: "Elite",
      tagline: "O acompanhamento mais próximo, com teleconsulta.",
      monthlyPrice: 349,
      features: ["Tudo do Plus", "1 teleconsulta mensal (até 1h)"],
    },
  });

  await prisma.coupon.upsert({
    where: { code: "BEMVINDO10" },
    update: {},
    create: { code: "BEMVINDO10", percentOff: 0.1, active: true },
  });

  const adminEmail = "rafael@couthealth.com.br";
  const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (!existingAdmin) {
    await prisma.user.create({
      data: {
        email: adminEmail,
        name: "Rafael Coutinho",
        role: Role.PROFESSIONAL,
        passwordHash: await argon2.hash("mudeesta-senha-123"),
        consentedAt: new Date(),
      },
    });
    console.log(`[seed] admin criado: ${adminEmail} / mudeesta-senha-123 (TROCAR)`);
  }

  console.log("[seed] concluído: 3 planos, 1 cupom (BEMVINDO10), 1 admin.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
