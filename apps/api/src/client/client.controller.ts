import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { PrismaService } from "../prisma/prisma.service";

@Controller("client")
@UseGuards(JwtAuthGuard)
export class ClientController {
  constructor(private prisma: PrismaService) {}

  @Get("dashboard")
  async dashboard(@Req() req: any) {
    const userId = req.user.userId;
    const [subscription, mealPlan, workouts, unreadNotifications, thread] = await Promise.all([
      this.prisma.subscription.findFirst({ where: { userId, status: "ACTIVE" }, include: { plan: true }, orderBy: { createdAt: "desc" } }),
      this.prisma.mealPlan.findFirst({ where: { clientId: userId, publishedAt: { not: null } }, orderBy: { publishedAt: "desc" } }),
      this.prisma.workout.findMany({ where: { clientId: userId, publishedAt: { not: null } }, orderBy: { publishedAt: "desc" } }),
      this.prisma.notification.findMany({ where: { userId, readAt: null }, orderBy: { createdAt: "desc" }, take: 5 }),
      this.prisma.thread.findFirst({ where: { clientId: userId }, include: { messages: { orderBy: { createdAt: "desc" }, take: 1 } } }),
    ]);

    return {
      subscription,
      nextReview: subscription?.currentPeriodEnd ?? null,
      lastMealPlanPublishedAt: mealPlan?.publishedAt ?? null,
      workoutsCount: workouts.length,
      unreadNotifications,
      lastMessage: thread?.messages[0] ?? null,
    };
  }

  @Get("nutrition")
  async nutrition(@Req() req: any) {
    return this.prisma.mealPlan.findFirst({
      where: { clientId: req.user.userId, publishedAt: { not: null } },
      orderBy: { publishedAt: "desc" },
      include: { meals: { include: { items: { include: { food: true } } } } },
    });
  }

  @Get("workouts")
  async workouts(@Req() req: any) {
    return this.prisma.workout.findMany({
      where: { clientId: req.user.userId, publishedAt: { not: null } },
      orderBy: { letter: "asc" },
      include: { exercises: { include: { exercise: true }, orderBy: { order: "asc" } } },
    });
  }
}
