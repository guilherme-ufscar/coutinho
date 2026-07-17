import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { PrismaModule } from "./prisma/prisma.module";
import { RemindersModule } from "./reminders/reminders.module";
import { AuthModule } from "./auth/auth.module";
import { PlansModule } from "./plans/plans.module";
import { CouponsModule } from "./coupons/coupons.module";
import { PaymentsModule } from "./payments/payments.module";
import { AnamnesisModule } from "./anamnesis/anamnesis.module";
import { AssessmentsModule } from "./assessments/assessments.module";

@Module({
  imports: [
    PrismaModule,
    RemindersModule,
    AuthModule,
    PlansModule,
    CouponsModule,
    PaymentsModule,
    AnamnesisModule,
    AssessmentsModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
