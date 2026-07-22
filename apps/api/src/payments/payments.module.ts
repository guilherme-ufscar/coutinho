import { Module } from "@nestjs/common";
import { PaymentsController } from "./payments.controller";
import { PaymentsService } from "./payments.service";
import { MockPaymentProvider } from "./providers/mock-payment.provider";
import { AsaasPaymentProvider } from "./providers/asaas-payment.provider";
import { MercadoPagoPaymentProvider } from "./providers/mercadopago-payment.provider";

@Module({
  controllers: [PaymentsController],
  providers: [PaymentsService, MockPaymentProvider, AsaasPaymentProvider, MercadoPagoPaymentProvider],
})
export class PaymentsModule {}
