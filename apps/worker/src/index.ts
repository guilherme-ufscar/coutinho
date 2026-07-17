import { Queue, Worker } from "bullmq";
import IORedis from "ioredis";
import { PrismaClient } from "@prisma/client";

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

const worker = new Worker(
  "reminders",
  async (job) => {
    if (job.name === "anamnesis-incomplete") {
      await handleAnamnesisReminder(job.data.userId);
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
