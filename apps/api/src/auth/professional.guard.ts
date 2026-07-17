import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Role } from "@prisma/client";
import { JwtAuthGuard } from "./jwt-auth.guard";

/** Atalho: exige JWT válido + papel PROFESSIONAL. Usar em todo endpoint de admin. */
@Injectable()
export class ProfessionalGuard extends JwtAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ok = (await super.canActivate(context)) as boolean;
    if (!ok) return false;
    const { user } = context.switchToHttp().getRequest();
    return user?.role === Role.PROFESSIONAL;
  }
}
