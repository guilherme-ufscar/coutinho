import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class MessagesService {
  constructor(private prisma: PrismaService) {}

  async getOrCreateThread(clientId: string) {
    const existing = await this.prisma.thread.findFirst({ where: { clientId } });
    if (existing) return existing;
    return this.prisma.thread.create({ data: { clientId } });
  }

  async getThreadWithMessages(clientId: string) {
    const thread = await this.getOrCreateThread(clientId);
    const messages = await this.prisma.message.findMany({
      where: { threadId: thread.id },
      orderBy: { createdAt: "asc" },
      include: { sender: { select: { id: true, name: true, role: true } } },
    });
    return { thread, messages };
  }

  async send(clientId: string, senderId: string, body: string) {
    const thread = await this.getOrCreateThread(clientId);
    return this.prisma.message.create({
      data: { threadId: thread.id, senderId, body },
      include: { sender: { select: { id: true, name: true, role: true } } },
    });
  }

  async listForProfessional() {
    return this.prisma.thread.findMany({
      include: {
        client: { select: { id: true, name: true, email: true } },
        messages: { orderBy: { createdAt: "desc" }, take: 1 },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async assertClientExists(clientId: string) {
    const client = await this.prisma.user.findUnique({ where: { id: clientId } });
    if (!client) throw new NotFoundException("Cliente não encontrado.");
    return client;
  }
}
