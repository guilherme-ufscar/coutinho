import { Injectable, ServiceUnavailableException } from "@nestjs/common";
import type { CreateChargeInput, CreateChargeResult, PaymentProvider } from "../payment-provider.interface";

/**
 * Adapter Asaas (PIX + cartão recorrente) — pronto para receber chaves via .env (escopo.md §13.0).
 * Sem ASAAS_API_KEY configurada, falha explicitamente em vez de fingir sucesso (diferente do mock).
 */
@Injectable()
export class AsaasPaymentProvider implements PaymentProvider {
  readonly name = "ASAAS" as const;

  private get apiKey() {
    return process.env.ASAAS_API_KEY;
  }

  private get baseUrl() {
    return process.env.ASAAS_BASE_URL ?? "https://sandbox.asaas.com/api/v3";
  }

  async createCharge(input: CreateChargeInput): Promise<CreateChargeResult> {
    if (!this.apiKey) {
      throw new ServiceUnavailableException(
        "Gateway Asaas não configurado (ASAAS_API_KEY ausente). Use PAYMENT_PROVIDER=mock em dev."
      );
    }

    const customerRes = await fetch(`${this.baseUrl}/customers`, {
      method: "POST",
      headers: { "Content-Type": "application/json", access_token: this.apiKey },
      body: JSON.stringify({ name: input.customer.name, email: input.customer.email }),
    });
    const customer = await customerRes.json();
    if (!customerRes.ok) {
      throw new ServiceUnavailableException(`Falha ao criar cliente no Asaas: ${JSON.stringify(customer)}`);
    }

    const paymentRes = await fetch(`${this.baseUrl}/payments`, {
      method: "POST",
      headers: { "Content-Type": "application/json", access_token: this.apiKey },
      body: JSON.stringify({
        customer: customer.id,
        billingType: input.method === "pix" ? "PIX" : "CREDIT_CARD",
        value: input.amount,
        dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
        externalReference: input.subscriptionId,
      }),
    });
    const payment = await paymentRes.json();
    if (!paymentRes.ok) {
      throw new ServiceUnavailableException(`Falha ao criar cobrança no Asaas: ${JSON.stringify(payment)}`);
    }

    return {
      providerChargeId: payment.id,
      status: "PENDING",
      checkoutUrl: payment.invoiceUrl,
    };
  }
}
