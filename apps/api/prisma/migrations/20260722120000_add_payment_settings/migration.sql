-- AlterEnum
ALTER TYPE "PaymentProviderName" ADD VALUE 'MERCADOPAGO';

-- CreateTable
CREATE TABLE "PaymentSettings" (
    "id" TEXT NOT NULL,
    "provider" "PaymentProviderName" NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT false,
    "publicKey" TEXT,
    "accessTokenEncrypted" TEXT,
    "accessTokenLast4" TEXT,
    "updatedById" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PaymentSettings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PaymentSettings_provider_key" ON "PaymentSettings"("provider");
