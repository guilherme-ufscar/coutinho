import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class AuditService {
  constructor(private prisma: PrismaService) {}

  /** Trilha de auditoria (escopo.md §9): quem fez o quê, em qual entidade. */
  log(actorId: string | null, action: string, entityType: string, entityId?: string, metadata?: Record<string, unknown>) {
    return this.prisma.auditLog
      .create({ data: { actorId, action, entityType, entityId, metadata: metadata as any } })
      .catch((err) => console.error("[audit] falha ao registrar log", err));
  }
}
