export type ChargeMethod = "pix" | "cartao";

export interface CreateChargeInput {
  subscriptionId: string;
  amount: number;
  method: ChargeMethod;
  customer: { name: string; email: string };
}

export interface CreateChargeResult {
  providerChargeId: string;
  status: "PENDING" | "APPROVED" | "FAILED";
  checkoutUrl?: string;
  pixQrCode?: string;
}

/** Interface comum a todos os gateways — ver escopo.md §13.0 (mock funcional + Asaas). */
export interface PaymentProvider {
  readonly name: "MOCK" | "ASAAS";
  createCharge(input: CreateChargeInput): Promise<CreateChargeResult>;
}
