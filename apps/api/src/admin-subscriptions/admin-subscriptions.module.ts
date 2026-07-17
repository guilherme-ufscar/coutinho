import { Module } from "@nestjs/common";
import { AdminSubscriptionsController } from "./admin-subscriptions.controller";

@Module({ controllers: [AdminSubscriptionsController] })
export class AdminSubscriptionsModule {}
