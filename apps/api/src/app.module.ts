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
import { FoodsModule } from "./foods/foods.module";
import { ExercisesModule } from "./exercises/exercises.module";
import { LibraryModule } from "./library/library.module";
import { MessagesModule } from "./messages/messages.module";
import { AdminClientsModule } from "./admin-clients/admin-clients.module";

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
    FoodsModule,
    ExercisesModule,
    LibraryModule,
    MessagesModule,
    AdminClientsModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
