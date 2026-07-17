import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { ProfessionalGuard } from "../auth/professional.guard";
import { ExerciseDto } from "./dto/exercise.dto";

@Controller("exercises")
export class ExercisesController {
  constructor(private prisma: PrismaService) {}

  @Get()
  list(@Query("search") search?: string) {
    return this.prisma.exerciseLibrary.findMany({
      where: search ? { name: { contains: search, mode: "insensitive" } } : undefined,
      orderBy: { name: "asc" },
    });
  }

  @Post()
  @UseGuards(ProfessionalGuard)
  create(@Body() dto: ExerciseDto) {
    return this.prisma.exerciseLibrary.create({ data: dto });
  }

  @Patch(":id")
  @UseGuards(ProfessionalGuard)
  update(@Param("id") id: string, @Body() dto: Partial<ExerciseDto>) {
    return this.prisma.exerciseLibrary.update({ where: { id }, data: dto });
  }

  @Delete(":id")
  @UseGuards(ProfessionalGuard)
  remove(@Param("id") id: string) {
    return this.prisma.exerciseLibrary.delete({ where: { id } });
  }
}
