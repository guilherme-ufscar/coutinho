import { Injectable, ServiceUnavailableException } from "@nestjs/common";
import type {
  CreateChargeInput,
  CreateChargeResult,
  CreateSubscriptionInput,
  CreateSubscriptionResult,
  PaymentProvider,
} from "../payment-provider.interface";

/**
 * Adapter Mercado Pago (PIX + cartão/Google Pay via token gerado no navegador pelo SDK do MP).
 * Credencial vem de env var (`MERCADOPAGO_ACCESS_TOKEN`), como os demais gateways.
 *
 * OBS: usa a API de Payments (`/v1/payments`), estável e amplamente documentada; o Mercado Pago
 * também oferece a Orders API mais nova — reavaliar migração se `/v1/payments` for descontinuada.
 */
@Injectable()
export class MercadoPagoPaymentProvider implements PaymentProvider {
  readonly name = "MERCADOPAGO" as const;

  private readonly baseUrl = "https://api.mercadopago.com";

  private getAccessToken(): string {
    const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
    if (!accessToken) {
      throw new ServiceUnavailableException("MERCADOPAGO_ACCESS_TOKEN não configurado.");
    }
    return accessToken;
  }

  async createCharge(input: CreateChargeInput): Promise<CreateChargeResult> {
    const accessToken = this.getAccessToken();

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
      pixQrCodeImage: payment.point_of_interaction?.transaction_data?.qr_code_base64,
    };
  }

  /**
   * Assinatura recorrente mensal via `/preapproval` (API de Assinaturas do MP) — cria já autorizada
   * com `card_token_id`, sem precisar redirecionar o cliente pra um init_point. Cobra automaticamente
   * todo mês o `monthlyAmount` até `end_date` (quando expira e o cliente precisa escolher de novo).
   */
  async createSubscription(input: CreateSubscriptionInput): Promise<CreateSubscriptionResult> {
    const accessToken = this.getAccessToken();

    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + input.months);

    const body = {
      reason: `Assinatura CoutHealth — ${input.subscriptionId}`,
      external_reference: input.subscriptionId,
      payer_email: input.customer.email,
      card_token_id: input.cardToken,
      auto_recurring: {
        frequency: 1,
        frequency_type: "months",
        transaction_amount: input.monthlyAmount,
        currency_id: "BRL",
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
      },
      back_url: process.env.APP_PUBLIC_URL ? `${process.env.APP_PUBLIC_URL}/checkout` : undefined,
      status: "authorized",
    };

    const res = await fetch(`${this.baseUrl}/preapproval`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        "X-Idempotency-Key": input.subscriptionId,
      },
      body: JSON.stringify(body),
    });
    const preapproval = await res.json();
    if (!res.ok) {
      throw new ServiceUnavailableException(`Falha ao criar assinatura recorrente no Mercado Pago: ${JSON.stringify(preapproval)}`);
    }

    return {
      mpPreapprovalId: String(preapproval.id),
      status: preapproval.status,
      initPoint: preapproval.init_point,
    };
  }

  /** Consultado pelo webhook (tópico subscription_authorized_payment) pra saber o resultado de uma cobrança recorrente. */
  async getAuthorizedPayment(id: string): Promise<{ preapprovalId: string; status: string; transactionAmount: number }> {
    const accessToken = this.getAccessToken();
    const res = await fetch(`${this.baseUrl}/authorized_payments/${id}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const body = await res.json();
    if (!res.ok) throw new ServiceUnavailableException(`Falha ao consultar cobrança recorrente no Mercado Pago: ${JSON.stringify(body)}`);
    return { preapprovalId: body.preapproval_id, status: body.status, transactionAmount: body.transaction_amount };
  }

  /** Consultado pelo webhook (tópico subscription_preapproval) pra saber se o cliente cancelou a assinatura no MP. */
  async getPreapproval(id: string): Promise<{ status: string }> {
    const accessToken = this.getAccessToken();
    const res = await fetch(`${this.baseUrl}/preapproval/${id}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const body = await res.json();
    if (!res.ok) throw new ServiceUnavailableException(`Falha ao consultar assinatura no Mercado Pago: ${JSON.stringify(body)}`);
    return { status: body.status };
  }

  /** Cancela a cobrança recorrente no Mercado Pago — chamado ao expirar o período ou ao admin desativar manualmente. */
  async cancelSubscription(mpPreapprovalId: string): Promise<void> {
    const accessToken = this.getAccessToken();
    const res = await fetch(`${this.baseUrl}/preapproval/${mpPreapprovalId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
      body: JSON.stringify({ status: "cancelled" }),
    });
    if (!res.ok && res.status !== 404) {
      const body = await res.json().catch(() => undefined);
      throw new ServiceUnavailableException(`Falha ao cancelar assinatura no Mercado Pago: ${JSON.stringify(body)}`);
    }
  }
}
