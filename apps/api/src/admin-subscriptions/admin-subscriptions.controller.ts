import { Body, Controller, Get, NotFoundException, Param, Patch, UseGuards } from "@nestjs/common";
import { ProfessionalGuard } from "../auth/professional.guard";
import { PrismaService } from "../prisma/prisma.service";
import { UpdateSubscriptionDto } from "./dto/update-subscription.dto";

@Controller("admin/subscriptions")
@UseGuards(ProfessionalGuard)
export class AdminSubscriptionsController {
  constructor(private prisma: PrismaService) {}

  @Get()
  list() {
    return this.prisma.subscription.findMany({
      include: { user: { select: { id: true, name: true, email: true } }, plan: true },
      orderBy: { createdAt: "desc" },
    });
  }

  @Patch(":id")
  async update(@Param("id") id: string, @Body() dto: UpdateSubscriptionDto) {
    const data: any = {};
    if (dto.status) data.status = dto.status;
    if (dto.planCode) {
      const plan = await this.prisma.plan.findUnique({ where: { code: dto.planCode } });
      if (!plan) throw new NotFoundException("Plano não encontrado.");
      data.planId = plan.id;
    }
    return this.prisma.subscription.update({ where: { id }, data });
  }
}
