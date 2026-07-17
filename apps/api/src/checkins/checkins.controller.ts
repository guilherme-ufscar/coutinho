import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { ProfessionalGuard } from "../auth/professional.guard";
import { PrismaService } from "../prisma/prisma.service";
import { CreateCheckInDto } from "./dto/create-checkin.dto";
import { AnswerCheckInDto } from "./dto/answer-checkin.dto";

@Controller()
export class CheckInsController {
  constructor(private prisma: PrismaService) {}

  @Get("checkins/me")
  @UseGuards(JwtAuthGuard)
  mine(@Req() req: any) {
    return this.prisma.checkIn.findMany({ where: { userId: req.user.userId }, orderBy: { createdAt: "desc" } });
  }

  @Patch("checkins/me/:id")
  @UseGuards(JwtAuthGuard)
  answer(@Req() req: any, @Param("id") id: string, @Body() dto: AnswerCheckInDto) {
    return this.prisma.checkIn.update({
      where: { id },
      data: { answer: dto.answer, answeredAt: new Date() },
    });
  }

  @Post("admin/clients/:id/checkins")
  @UseGuards(ProfessionalGuard)
  create(@Param("id") clientId: string, @Body() dto: CreateCheckInDto) {
    return this.prisma.checkIn.create({ data: { userId: clientId, kind: dto.kind, question: dto.question } });
  }
}
