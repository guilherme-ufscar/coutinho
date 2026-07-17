import { Body, Controller, Get, Param, Patch, Post, BadRequestException, Req, UseGuards } from "@nestjs/common";
import { IsBoolean, IsDateString, IsNumber, IsOptional, IsString } from "class-validator";
import { Type } from "class-transformer";
import { PrismaService } from "../prisma/prisma.service";
import { ProfessionalGuard } from "../auth/professional.guard";
import { AuditService } from "../audit/audit.service";

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
  constructor(private prisma: PrismaService, private audit: AuditService) {}

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
  async create(@Req() req: any, @Body() dto: CreateCouponDto) {
    const coupon = await this.prisma.coupon.create({
      data: { code: dto.code.toUpperCase(), percentOff: dto.percentOff, expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : undefined },
    });
    this.audit.log(req.user.userId, "CREATE", "Coupon", coupon.id, { code: coupon.code });
    return coupon;
  }

  @Patch("admin/:id")
  @UseGuards(ProfessionalGuard)
  async update(@Req() req: any, @Param("id") id: string, @Body() dto: UpdateCouponDto) {
    const coupon = await this.prisma.coupon.update({ where: { id }, data: dto });
    this.audit.log(req.user.userId, "UPDATE", "Coupon", coupon.id, { ...dto });
    return coupon;
  }
}
