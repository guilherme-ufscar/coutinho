import { Module } from "@nestjs/common";
import { PaymentsModule } from "../payments/payments.module";
import { AdminSubscriptionsController } from "./admin-subscriptions.controller";

@Module({ imports: [PaymentsModule], controllers: [AdminSubscriptionsController] })
export class AdminSubscriptionsModule {}
