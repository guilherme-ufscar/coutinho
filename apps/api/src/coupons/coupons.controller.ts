import { Controller, Post, Body, BadRequestException } from "@nestjs/common";
import { IsString } from "class-validator";
import { PrismaService } from "../prisma/prisma.service";

class ValidateCouponDto {
  @IsString()
  code!: string;
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
}
