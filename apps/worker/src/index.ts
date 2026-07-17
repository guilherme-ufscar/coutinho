import { Queue, Worker } from "bullmq";
import IORedis from "ioredis";

const connection = new IORedis(process.env.REDIS_URL ?? "redis://localhost:6379", {
  maxRetriesPerRequest: null,
});

// Fila de lembretes (anamnese, check-ins) — jobs reais entram nas Fases 4 e 7.
export const remindersQueue = new Queue("reminders", { connection });

const worker = new Worker(
  "reminders",
  async (job) => {
    console.log(`[worker] processando job ${job.name}`, job.data);
  },
  { connection }
);

worker.on("ready", () => console.log("[worker] pronto, conectado ao Redis"));
worker.on("error", (err) => console.error("[worker] erro", err));

connection.on("connect", () => console.log("[worker] Redis conectado"));
connection.on("error", (err) => console.error("[worker] Redis erro", err));
