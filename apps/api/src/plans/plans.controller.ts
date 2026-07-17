import { Body, Controller, Get, Param, Patch, UseGuards } from "@nestjs/common";
import { IsArray, IsNumber, IsOptional, IsString } from "class-validator";
import { Type } from "class-transformer";
import { PrismaService } from "../prisma/prisma.service";
import { ProfessionalGuard } from "../auth/professional.guard";

class UpdatePlanDto {
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsString() tagline?: string;
  @IsOptional() @Type(() => Number) @IsNumber() monthlyPrice?: number;
  @IsOptional() @IsArray() features?: string[];
}

@Controller("plans")
export class PlansController {
  constructor(private prisma: PrismaService) {}

  @Get()
  list() {
    return this.prisma.plan.findMany({ orderBy: { monthlyPrice: "asc" } });
  }

  @Patch("admin/:id")
  @UseGuards(ProfessionalGuard)
  update(@Param("id") id: string, @Body() dto: UpdatePlanDto) {
    return this.prisma.plan.update({ where: { id }, data: dto });
  }
}
