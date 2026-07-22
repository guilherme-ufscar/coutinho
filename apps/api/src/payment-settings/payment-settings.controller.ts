import { Body, Controller, Get, Put, Req, UseGuards } from "@nestjs/common";
import { IsBoolean, IsOptional, IsString } from "class-validator";
import { PaymentProviderName } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { CryptoService } from "../crypto/crypto.service";
import { ProfessionalGuard } from "../auth/professional.guard";
import { AuditService } from "../audit/audit.service";

class UpdateMercadoPagoSettingsDto {
  @IsOptional()
  @IsString()
  accessToken?: string;

  @IsString()
  publicKey!: string;

  @IsBoolean()
  active!: boolean;
}

/** Fonte de verdade de qual gateway está ativo e com quais credenciais — nunca em .env. */
@Controller()
export class PaymentSettingsController {
  constructor(private prisma: PrismaService, private crypto: CryptoService, private audit: AuditService) {}

  @Get("admin/payment-settings")
  @UseGuards(ProfessionalGuard)
  async list() {
    const settings = await this.prisma.paymentSettings.findMany({ orderBy: { provider: "asc" } });
    return settings.map(({ accessTokenEncrypted, ...rest }) => rest);
  }

  @Put("admin/payment-settings/mercadopago")
  @UseGuards(ProfessionalGuard)
  async updateMercadoPago(@Req() req: any, @Body() dto: UpdateMercadoPagoSettingsDto) {
    if (dto.active) {
      await this.prisma.paymentSettings.updateMany({
        where: { provider: { not: PaymentProviderName.MERCADOPAGO } },
        data: { active: false },
      });
    }

    const data: {
      publicKey: string;
      active: boolean;
      updatedById: string;
      accessTokenEncrypted?: string;
      accessTokenLast4?: string;
    } = {
      publicKey: dto.publicKey,
      active: dto.active,
      updatedById: req.user.userId,
    };
    if (dto.accessToken) {
      data.accessTokenEncrypted = this.crypto.encrypt(dto.accessToken);
      data.accessTokenLast4 = dto.accessToken.slice(-4);
    }

    const settings = await this.prisma.paymentSettings.upsert({
      where: { provider: PaymentProviderName.MERCADOPAGO },
      create: { provider: PaymentProviderName.MERCADOPAGO, ...data },
      update: data,
    });

    this.audit.log(req.user.userId, "UPDATE", "PaymentSettings", settings.id, {
      provider: "MERCADOPAGO",
      active: dto.active,
      tokenUpdated: Boolean(dto.accessToken),
    });

    const { accessTokenEncrypted, ...safe } = settings;
    return safe;
  }

  /** Endpoint público — só devolve o provider ativo e sua public key (nunca o access token). */
  @Get("payments/checkout-config")
  async checkoutConfig() {
    const settings = await this.prisma.paymentSettings.findFirst({
      where: { active: true, accessTokenEncrypted: { not: null } },
    });
    if (settings) return { provider: settings.provider, publicKey: settings.publicKey ?? undefined };

    // Sem gateway configurado no banco — cai no fallback legado por env var (Asaas/Mock).
    const legacy = process.env.PAYMENT_PROVIDER === "asaas" ? "ASAAS" : "MOCK";
    return { provider: legacy as PaymentProviderName };
  }
}
