import { Module } from "@nestjs/common";
import { PaymentsController } from "./payments.controller";
import { PaymentsService } from "./payments.service";
import { MercadoPagoPaymentProvider } from "./providers/mercadopago-payment.provider";

@Module({
  controllers: [PaymentsController],
  providers: [PaymentsService, MercadoPagoPaymentProvider],
})
export class PaymentsModule {}
