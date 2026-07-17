import { Body, Controller, Get, Param, Patch, Post, BadRequestException, UseGuards } from "@nestjs/common";
import { IsBoolean, IsDateString, IsNumber, IsOptional, IsString } from "class-validator";
import { Type } from "class-transformer";
import { PrismaService } from "../prisma/prisma.service";
import { ProfessionalGuard } from "../auth/professional.guard";

class ValidateCouponDto {
  @IsString()
  code!: string;
}

class CreateCouponDto {
  @IsString() code!: string;
  @Type(() => Number) @IsNumber() percentOff!: number;
  @IsOptional() @IsDateString() expiresAt?: string;
}

class UpdateCouponDto {
  @IsOptional() @IsBoolean() active?: boolean;
  @IsOptional() @Type(() => Number) @IsNumber() percentOff?: number;
}

@Controller("coupons")
export class CouponsController {
  constructor(private prisma: PrismaService) {}

  @Post("validate")
  async validate(@Body() dto: ValidateCouponDto) {
    const coupon = await this.prisma.coupon.findUnique({ where: { code: dto.code } });
    if (!coupon || !coupon.active || (coupon.expiresAt && coupon.expiresAt < new Date())) {
      throw new BadRequestException("Cupom inválido ou expirado.");
    }
    return { code: coupon.code, percentOff: coupon.percentOff };
  }

  @Get("admin/all")
  @UseGuards(ProfessionalGuard)
  listAll() {
    return this.prisma.coupon.findMany({ orderBy: { createdAt: "desc" } });
  }

  @Post("admin")
  @UseGuards(ProfessionalGuard)
  create(@Body() dto: CreateCouponDto) {
    return this.prisma.coupon.create({
      data: { code: dto.code.toUpperCase(), percentOff: dto.percentOff, expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : undefined },
    });
  }

  @Patch("admin/:id")
  @UseGuards(ProfessionalGuard)
  update(@Param("id") id: string, @Body() dto: UpdateCouponDto) {
    return this.prisma.coupon.update({ where: { id }, data: dto });
  }
}
