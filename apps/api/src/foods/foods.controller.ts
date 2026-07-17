import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { ProfessionalGuard } from "../auth/professional.guard";
import { FoodDto } from "./dto/food.dto";

@Controller("foods")
export class FoodsController {
  constructor(private prisma: PrismaService) {}

  @Get()
  list(@Query("search") search?: string) {
    return this.prisma.food.findMany({
      where: search ? { name: { contains: search, mode: "insensitive" } } : undefined,
      orderBy: { name: "asc" },
    });
  }

  @Post()
  @UseGuards(ProfessionalGuard)
  create(@Body() dto: FoodDto) {
    return this.prisma.food.create({ data: dto });
  }

  @Patch(":id")
  @UseGuards(ProfessionalGuard)
  update(@Param("id") id: string, @Body() dto: Partial<FoodDto>) {
    return this.prisma.food.update({ where: { id }, data: dto });
  }

  @Delete(":id")
  @UseGuards(ProfessionalGuard)
  remove(@Param("id") id: string) {
    return this.prisma.food.delete({ where: { id } });
  }
}
