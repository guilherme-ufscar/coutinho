export type ChargeMethod = "pix" | "cartao";

export interface CreateChargeInput {
  subscriptionId: string;
  amount: number;
  method: ChargeMethod;
  customer: { name: string; email: string };
  /** Só usados pelo MercadoPagoPaymentProvider — token gerado no navegador (cartão ou Google Pay). */
  token?: string;
  paymentMethodId?: string;
  installments?: number;
  payerDocNumber?: string;
}

export interface CreateChargeResult {
  providerChargeId: string;
  status: "PENDING" | "APPROVED" | "FAILED";
  checkoutUrl?: string;
  pixQrCode?: string;
  /** PNG em base64 (sem o prefixo data:) pronto pra exibir como <img> — vem do Mercado Pago. */
  pixQrCodeImage?: string;
}

export interface PaymentProvider {
  readonly name: "MERCADOPAGO";
  createCharge(input: CreateChargeInput): Promise<CreateChargeResult>;
}

/** Assinatura recorrente mensal (Mercado Pago `/preapproval`) — só cartão, PIX continua via createCharge. */
export interface CreateSubscriptionInput {
  subscriptionId: string;
  /** Valor cobrado todo mês (já com o desconto do período/cupom aplicado, travado na criação). */
  monthlyAmount: number;
  /** Quantos meses até a assinatura expirar e o cliente precisar escolher de novo. */
  months: number;
  customer: { name: string; email: string };
  /** Token do cartão gerado pelo Payment Brick no navegador. */
  cardToken: string;
}

export interface CreateSubscriptionResult {
  mpPreapprovalId: string;
  status: "authorized" | "pending" | "cancelled";
  /** Só preenchido se o Mercado Pago exigir o cliente autorizar num redirect (fallback). */
  initPoint?: string;
}
