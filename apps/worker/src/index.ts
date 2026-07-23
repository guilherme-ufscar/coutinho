import { Queue, Worker } from "bullmq";
import IORedis from "ioredis";
import { PrismaClient, Role } from "@prisma/client";

const connection = new IORedis(process.env.REDIS_URL ?? "redis://localhost:6379", {
  maxRetriesPerRequest: null,
});
const prisma = new PrismaClient();

// Fila de lembretes (anamnese, check-ins) — enfileirada pela API (RemindersQueueService).
export const remindersQueue = new Queue("reminders", { connection });

async function handleAnamnesisReminder(userId: string) {
  const anamnesis = await prisma.anamnesis.findUnique({ where: { userId } });
  if (!anamnesis || anamnesis.status !== "RASCUNHO") {
    return; // já concluiu ou não existe mais — nada a lembrar.
  }
  await prisma.notification.create({
    data: {
      userId,
      type: "PERSONALIZADA",
      title: "Continue sua anamnese",
      body: "Você ainda não terminou seu formulário de anamnese. Retome de onde parou para começar seu acompanhamento.",
      sentAt: new Date(),
    },
  });
  console.log(`[worker] lembrete de anamnese criado para o usuário ${userId}`);
}

/** Cancela a assinatura recorrente no Mercado Pago quando o período contratado termina. */
async function cancelMercadoPagoSubscription(mpPreapprovalId: string) {
  const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
  if (!accessToken) {
    console.error("[worker] MERCADOPAGO_ACCESS_TOKEN não configurado — não foi possível cancelar a assinatura no Mercado Pago");
    return;
  }
  const res = await fetch(`https://api.mercadopago.com/preapproval/${mpPreapprovalId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
    body: JSON.stringify({ status: "cancelled" }),
  });
  if (!res.ok && res.status !== 404) {
    console.error(`[worker] falha ao cancelar assinatura ${mpPreapprovalId} no Mercado Pago: ${await res.text()}`);
  }
}

async function handleSubscriptionExpiring(subscriptionId: string) {
  const subscription = await prisma.subscription.findUnique({ where: { id: subscriptionId } });
  if (!subscription || subscription.status !== "ACTIVE") return; // já cancelada/trocada — nada a fazer

  if (subscription.mpPreapprovalId) await cancelMercadoPagoSubscription(subscription.mpPreapprovalId);

  await prisma.subscription.update({ where: { id: subscriptionId }, data: { status: "EXPIRED" } });
  await prisma.notification.create({
    data: {
      userId: subscription.userId,
      type: "PERSONALIZADA",
      title: "Sua assinatura expirou",
      body: "O período que você contratou chegou ao fim. Escolha um plano para continuar seu acompanhamento.",
      sentAt: new Date(),
    },
  });
  console.log(`[worker] assinatura ${subscriptionId} expirada — cliente ${subscription.userId} notificado`);
}

async function resolveCampaignAudience(audience: string): Promise<string[]> {
  if (audience === "all") {
    const clients = await prisma.user.findMany({ where: { role: Role.CLIENT }, select: { id: true } });
    return clients.map((c) => c.id);
  }
  const subs = await prisma.subscription.findMany({
    where: { status: "ACTIVE", plan: { code: audience as any } },
    select: { userId: true },
  });
  return [...new Set(subs.map((s) => s.userId))];
}

async function handleCampaign(payload: { title: string; body: string; audience: string }) {
  const userIds = await resolveCampaignAudience(payload.audience);
  await prisma.notification.createMany({
    data: userIds.map((userId) => ({
      userId,
      type: "PERSONALIZADA" as const,
      title: payload.title,
      body: payload.body,
      audienceSegment: payload.audience,
      sentAt: new Date(),
    })),
  });
  console.log(`[worker] campanha "${payload.title}" enviada para ${userIds.length} cliente(s)`);
}

const worker = new Worker(
  "reminders",
  async (job) => {
    if (job.name === "anamnesis-incomplete") {
      await handleAnamnesisReminder(job.data.userId);
      return;
    }
    if (job.name === "send-campaign") {
      await handleCampaign(job.data);
      return;
    }
    if (job.name === "subscription-expiring") {
      await handleSubscriptionExpiring(job.data.subscriptionId);
      return;
    }
    console.log(`[worker] job desconhecido ignorado: ${job.name}`);
  },
  { connection }
);

worker.on("ready", () => console.log("[worker] pronto, conectado ao Redis"));
worker.on("error", (err) => console.error("[worker] erro", err));
worker.on("failed", (job, err) => console.error(`[worker] job ${job?.id} falhou`, err));

connection.on("connect", () => console.log("[worker] Redis conectado"));
connection.on("error", (err) => console.error("[worker] Redis erro", err));
