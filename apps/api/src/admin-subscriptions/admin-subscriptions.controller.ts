import { Body, Controller, Get, NotFoundException, Param, Patch, Req, UseGuards } from "@nestjs/common";
import { ProfessionalGuard } from "../auth/professional.guard";
import { PrismaService } from "../prisma/prisma.service";
import { AuditService } from "../audit/audit.service";
import { RemindersQueueService } from "../reminders/reminders-queue.service";
import { MercadoPagoPaymentProvider } from "../payments/providers/mercadopago-payment.provider";
import { UpdateSubscriptionDto } from "./dto/update-subscription.dto";

@Controller("admin/subscriptions")
@UseGuards(ProfessionalGuard)
export class AdminSubscriptionsController {
  constructor(
    private prisma: PrismaService,
    private audit: AuditService,
    private reminders: RemindersQueueService,
    private mercadoPago: MercadoPagoPaymentProvider
  ) {}

  @Get()
  list() {
    return this.prisma.subscription.findMany({
      include: { user: { select: { id: true, name: true, email: true } }, plan: true },
      orderBy: { createdAt: "desc" },
    });
  }

  @Patch(":id")
  async update(@Req() req: any, @Param("id") id: string, @Body() dto: UpdateSubscriptionDto) {
    const data: any = {};
    if (dto.status) data.status = dto.status;
    if (dto.planCode) {
      const plan = await this.prisma.plan.findUnique({ where: { code: dto.planCode } });
      if (!plan) throw new NotFoundException("Plano não encontrado.");
      data.planId = plan.id;
    }
    const before = await this.prisma.subscription.findUnique({ where: { id } });
    const subscription = await this.prisma.subscription.update({ where: { id }, data });
    this.audit.log(req.user.userId, "UPDATE", "Subscription", subscription.id, { ...dto });

    const deactivating = dto.status && dto.status !== "ACTIVE" && before?.status === "ACTIVE";
    if (deactivating && before?.mpPreapprovalId) {
      await this.mercadoPago.cancelSubscription(before.mpPreapprovalId);
      await this.reminders.cancelSubscriptionExpiry(id);
    }
    return subscription;
  }
}
