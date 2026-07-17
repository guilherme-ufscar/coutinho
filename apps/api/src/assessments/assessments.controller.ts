import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { PrismaService } from "../prisma/prisma.service";
import { CreateAssessmentDto } from "./dto/create-assessment.dto";

@Controller("assessments")
@UseGuards(JwtAuthGuard)
export class AssessmentsController {
  constructor(private prisma: PrismaService) {}

  @Get("me")
  listMine(@Req() req: any) {
    return this.prisma.assessment.findMany({ where: { userId: req.user.userId }, orderBy: { recordedAt: "asc" } });
  }

  @Post()
  create(@Req() req: any, @Body() dto: CreateAssessmentDto) {
    return this.prisma.assessment.create({ data: { userId: req.user.userId, ...dto } });
  }
}
