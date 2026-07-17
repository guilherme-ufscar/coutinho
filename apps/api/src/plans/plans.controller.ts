import { Controller, Get } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Controller("plans")
export class PlansController {
  constructor(private prisma: PrismaService) {}

  @Get()
  list() {
    return this.prisma.plan.findMany({ orderBy: { monthlyPrice: "asc" } });
  }
}
