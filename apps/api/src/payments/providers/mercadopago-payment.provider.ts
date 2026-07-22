import { Injectable, ServiceUnavailableException } from "@nestjs/common";
import { PaymentProviderName } from "@prisma/client";
import { PrismaService } from "../../prisma/prisma.service";
import { CryptoService } from "../../crypto/crypto.service";
import type { CreateChargeInput, CreateChargeResult, PaymentProvider } from "../payment-provider.interface";

/**
 * Adapter Mercado Pago (PIX + cartão/Google Pay via token gerado no navegador pelo SDK do MP).
 * Credencial vem do banco (`PaymentSettings`, colada pelo profissional no admin), nunca de env var
 * — busca a cada chamada (sem cache) para uma troca de token no admin valer na hora.
 *
 * OBS: usa a API de Payments (`/v1/payments`), estável e amplamente documentada; o Mercado Pago
 * também oferece a Orders API mais nova — reavaliar migração se `/v1/payments` for descontinuada.
 */
@Injectable()
export class MercadoPagoPaymentProvider implements PaymentProvider {
  readonly name = "MERCADOPAGO" as const;

  private readonly baseUrl = "https://api.mercadopago.com";

  constructor(private prisma: PrismaService, private crypto: CryptoService) {}

  private async getAccessToken(): Promise<string> {
    const settings = await this.prisma.paymentSettings.findUnique({
      where: { provider: PaymentProviderName.MERCADOPAGO },
    });
    if (!settings?.accessTokenEncrypted) {
      throw new ServiceUnavailableException(
        "Mercado Pago não configurado — peça para o profissional cadastrar o Access Token em Admin > Pagamentos."
      );
    }
    return this.crypto.decrypt(settings.accessTokenEncrypted);
  }

  async createCharge(input: CreateChargeInput): Promise<CreateChargeResult> {
    const accessToken = await this.getAccessToken();

    const body: Record<string, unknown> = {
      transaction_amount: input.amount,
      description: `Assinatura CoutHealth — ${input.subscriptionId}`,
      external_reference: input.subscriptionId,
      payer: { email: input.customer.email },
    };

    if (input.method === "pix") {
      body.payment_method_id = "pix";
    } else {
      if (!input.token || !input.paymentMethodId) {
        throw new ServiceUnavailableException("Token de pagamento ausente — cartão/Google Pay precisa ser tokenizado no navegador antes do checkout.");
      }
      body.token = input.token;
      body.payment_method_id = input.paymentMethodId;
      body.installments = input.installments ?? 1;
      if (input.payerDocNumber) {
        (body.payer as any).identification = { type: "CPF", number: input.payerDocNumber };
      }
    }

    const res = await fetch(`${this.baseUrl}/v1/payments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        "X-Idempotency-Key": input.subscriptionId,
      },
      body: JSON.stringify(body),
    });
    const payment = await res.json();
    if (!res.ok) {
      throw new ServiceUnavailableException(`Falha ao criar cobrança no Mercado Pago: ${JSON.stringify(payment)}`);
    }

    const status: CreateChargeResult["status"] =
      payment.status === "approved" ? "APPROVED" : payment.status === "rejected" ? "FAILED" : "PENDING";

    return {
      providerChargeId: String(payment.id),
      status,
      pixQrCode: payment.point_of_interaction?.transaction_data?.qr_code,
    };
  }
}
