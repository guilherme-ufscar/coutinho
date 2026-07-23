-- Cobrança recorrente mensal via Mercado Pago (assinaturas/preapproval) para pagamento com cartão.
ALTER TABLE "Subscription" ADD COLUMN "mpPreapprovalId" TEXT;
CREATE UNIQUE INDEX "Subscription_mpPreapprovalId_key" ON "Subscription"("mpPreapprovalId");
