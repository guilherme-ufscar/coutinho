import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { PrismaModule } from "./prisma/prisma.module";
import { AuthModule } from "./auth/auth.module";
import { PlansModule } from "./plans/plans.module";
import { CouponsModule } from "./coupons/coupons.module";
import { PaymentsModule } from "./payments/payments.module";

@Module({
  imports: [PrismaModule, AuthModule, PlansModule, CouponsModule, PaymentsModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
