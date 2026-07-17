import { Injectable } from "@nestjs/common";
import { Role } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { RemindersQueueService } from "../reminders/reminders-queue.service";
import { CreateCampaignDto } from "./dto/create-campaign.dto";

@Injectable()
export class AdminNotificationsService {
  constructor(private prisma: PrismaService, private reminders: RemindersQueueService) {}

  private async resolveAudienceUserIds(audience: string): Promise<string[]> {
    if (audience === "all") {
      const clients = await this.prisma.user.findMany({ where: { role: Role.CLIENT }, select: { id: true } });
      return clients.map((c) => c.id);
    }
    const subs = await this.prisma.subscription.findMany({
      where: { status: "ACTIVE", plan: { code: audience as any } },
      select: { userId: true },
    });
    return [...new Set(subs.map((s) => s.userId))];
  }

  async create(dto: CreateCampaignDto) {
    const scheduledFor = dto.scheduledFor ? new Date(dto.scheduledFor) : null;
    const isFuture = scheduledFor && scheduledFor.getTime() > Date.now();

    if (isFuture) {
      await this.reminders.scheduleCampaign({ title: dto.title, body: dto.body, audience: dto.audience, sendAt: scheduledFor!.toISOString() });
      return { status: "scheduled", scheduledFor };
    }

    const userIds = await this.resolveAudienceUserIds(dto.audience);
    await this.prisma.notification.createMany({
      data: userIds.map((userId) => ({
        userId,
        type: "PERSONALIZADA",
        title: dto.title,
        body: dto.body,
        audienceSegment: dto.audience,
        sentAt: new Date(),
      })),
    });
    return { status: "sent", recipients: userIds.length };
  }

  listSent() {
    return this.prisma.notification.findMany({
      where: { type: "PERSONALIZADA" },
      orderBy: { createdAt: "desc" },
      take: 50,
    });
  }
}
