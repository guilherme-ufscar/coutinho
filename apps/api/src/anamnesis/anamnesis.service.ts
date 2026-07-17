import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { RemindersQueueService } from "../reminders/reminders-queue.service";
import { UpdateAnamnesisDto } from "./dto/update-anamnesis.dto";

@Injectable()
export class AnamnesisService {
  constructor(private prisma: PrismaService, private reminders: RemindersQueueService) {}

  async getOrCreate(userId: string) {
    const existing = await this.prisma.anamnesis.findUnique({ where: { userId } });
    if (existing) return existing;
    return this.prisma.anamnesis.create({ data: { userId } });
  }

  async updateDraft(userId: string, dto: UpdateAnamnesisDto) {
    const anamnesis = await this.getOrCreate(userId);
    if (anamnesis.status === "ENVIADA" || anamnesis.status === "ANALISADA") {
      throw new BadRequestException("Anamnese já enviada — não é possível editar.");
    }

    const { birthDate, ...rest } = dto;
    const updated = await this.prisma.anamnesis.update({
      where: { userId },
      data: {
        ...rest,
        ...(birthDate ? { birthDate: new Date(birthDate) } : {}),
      },
    });

    // "Responder depois": qualquer salvamento de rascunho reagenda o lembrete de conclusão.
    await this.reminders.scheduleAnamnesisReminder(userId);

    return updated;
  }

  async submit(userId: string) {
    const anamnesis = await this.getOrCreate(userId);
    if (anamnesis.status !== "RASCUNHO") {
      return anamnesis;
    }
    const updated = await this.prisma.anamnesis.update({
      where: { userId },
      data: { status: "ENVIADA", submittedAt: new Date() },
    });
    await this.reminders.cancelAnamnesisReminder(userId);
    return updated;
  }
}
