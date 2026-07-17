import { Controller, ForbiddenException, Get, NotFoundException, Param, Post, Req, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { PrismaService } from "../prisma/prisma.service";

@Controller("notifications")
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private prisma: PrismaService) {}

  @Get("me")
  mine(@Req() req: any) {
    return this.prisma.notification.findMany({
      where: { userId: req.user.userId },
      orderBy: { createdAt: "desc" },
    });
  }

  @Post("me/:id/read")
  async markRead(@Req() req: any, @Param("id") id: string) {
    const notification = await this.prisma.notification.findUnique({ where: { id } });
    if (!notification) throw new NotFoundException("Notificação não encontrada.");
    if (notification.userId !== req.user.userId) throw new ForbiddenException();
    return this.prisma.notification.update({ where: { id }, data: { readAt: new Date() } });
  }
}
