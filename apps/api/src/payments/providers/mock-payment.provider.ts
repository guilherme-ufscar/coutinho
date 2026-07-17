import { Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";
import type { CreateChargeInput, CreateChargeResult, PaymentProvider } from "../payment-provider.interface";

/** Aprova automaticamente em dev — "pagamento aprovado → conta liberada" sem depender de gateway real. */
@Injectable()
export class MockPaymentProvider implements PaymentProvider {
  readonly name = "MOCK" as const;

  async createCharge(_input: CreateChargeInput): Promise<CreateChargeResult> {
    return { providerChargeId: `mock_${randomUUID()}`, status: "APPROVED" };
  }
}
