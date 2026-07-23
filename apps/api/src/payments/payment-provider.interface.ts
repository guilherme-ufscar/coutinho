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
}

export interface PaymentProvider {
  readonly name: "MERCADOPAGO";
  createCharge(input: CreateChargeInput): Promise<CreateChargeResult>;
}
