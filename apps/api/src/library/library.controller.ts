import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { ProfessionalGuard } from "../auth/professional.guard";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { LibraryContentDto } from "./dto/library-content.dto";

@Controller("library")
export class LibraryController {
  constructor(private prisma: PrismaService) {}

  /** Clientes só veem o que já foi publicado; a equipe (via /library/all) vê rascunhos também. */
  @Get()
  @UseGuards(JwtAuthGuard)
  listPublished() {
    return this.prisma.libraryContent.findMany({ where: { publishedAt: { not: null } }, orderBy: { publishedAt: "desc" } });
  }

  @Get("all")
  @UseGuards(ProfessionalGuard)
  listAll() {
    return this.prisma.libraryContent.findMany({ orderBy: { createdAt: "desc" } });
  }

  @Post()
  @UseGuards(ProfessionalGuard)
  create(@Body() dto: LibraryContentDto) {
    return this.prisma.libraryContent.create({ data: dto });
  }

  @Patch(":id")
  @UseGuards(ProfessionalGuard)
  update(@Param("id") id: string, @Body() dto: Partial<LibraryContentDto>) {
    return this.prisma.libraryContent.update({ where: { id }, data: dto });
  }

  @Post(":id/publish")
  @UseGuards(ProfessionalGuard)
  publish(@Param("id") id: string) {
    return this.prisma.libraryContent.update({ where: { id }, data: { publishedAt: new Date() } });
  }

  @Delete(":id")
  @UseGuards(ProfessionalGuard)
  remove(@Param("id") id: string) {
    return this.prisma.libraryContent.delete({ where: { id } });
  }
}
