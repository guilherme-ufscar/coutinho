import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { Period, PlanCode, PaymentProviderName } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { MockPaymentProvider } from "./providers/mock-payment.provider";
import { AsaasPaymentProvider } from "./providers/asaas-payment.provider";
import { MercadoPagoPaymentProvider } from "./providers/mercadopago-payment.provider";
import type { PaymentProvider } from "./payment-provider.interface";
import { CheckoutDto } from "./dto/checkout.dto";

const PERIOD_DISCOUNT: Record<Period, number> = {
  MENSAL: 0,
  TRIMESTRAL: 0.08,
  SEMESTRAL: 0.15,
  ANUAL: 0.25,
};

const PERIOD_MONTHS: Record<Period, number> = {
  MENSAL: 1,
  TRIMESTRAL: 3,
  SEMESTRAL: 6,
  ANUAL: 12,
};

@Injectable()
export class PaymentsService {
  constructor(
    private prisma: PrismaService,
    private mockProvider: MockPaymentProvider,
    private asaasProvider: AsaasPaymentProvider,
    private mercadoPagoProvider: MercadoPagoPaymentProvider
  ) {}

  /**
   * Gateway ativo agora é configurável pelo profissional no admin (`PaymentSettings`), sem precisar
   * de redeploy. Sem nenhum gateway ativo no banco, cai no fallback legado por env var
   * (`PAYMENT_PROVIDER=asaas`), preservando o setup anterior à existência desta tela.
   */
  private async resolveProvider(): Promise<PaymentProvider> {
    const active = await this.prisma.paymentSettings.findFirst({
      where: { active: true, accessTokenEncrypted: { not: null } },
    });
    if (active?.provider === PaymentProviderName.MERCADOPAGO) return this.mercadoPagoProvider;

    const configured = process.env.PAYMENT_PROVIDER ?? "mock";
    return configured === "asaas" ? this.asaasProvider : this.mockProvider;
  }

  async checkout(userId: string, dto: CheckoutDto) {
    const [user, plan] = await Promise.all([
      this.prisma.user.findUniqueOrThrow({ where: { id: userId } }),
      this.prisma.plan.findUnique({ where: { code: dto.planCode as PlanCode } }),
    ]);
    if (!plan) throw new NotFoundException("Plano não encontrado.");

    let coupon = null;
    if (dto.couponCode) {
      coupon = await this.prisma.coupon.findUnique({ where: { code: dto.couponCode } });
      if (!coupon || !coupon.active || (coupon.expiresAt && coupon.expiresAt < new Date())) {
        throw new BadRequestException("Cupom inválido ou expirado.");
      }
    }

    const periodDiscount = PERIOD_DISCOUNT[dto.period as Period];
    const couponDiscount = coupon?.percentOff ?? 0;
    const amount = Number((plan.monthlyPrice * PERIOD_MONTHS[dto.period as Period] * (1 - periodDiscount) * (1 - couponDiscount)).toFixed(2));

    const subscription = await this.prisma.subscription.create({
      data: {
        userId,
        planId: plan.id,
        period: dto.period as Period,
        couponId: coupon?.id,
        status: "PENDING",
      },
    });

    const provider = await this.resolveProvider();
    const charge = await provider.createCharge({
      subscriptionId: subscription.id,
      amount,
      method: dto.method,
      customer: { name: user.name, email: user.email },
      token: dto.token,
      paymentMethodId: dto.paymentMethodId,
      installments: dto.installments,
      payerDocNumber: dto.payerDocNumber,
    });

    const payment = await this.prisma.payment.create({
      data: {
        subscriptionId: subscription.id,
        provider: provider.name,
        providerChargeId: charge.providerChargeId,
        amount,
        status: charge.status,
        method: dto.method,
      },
    });

    if (charge.status === "APPROVED") {
      await this.activateSubscription(subscription.id, dto.period as Period);
    }

    return {
      subscriptionId: subscription.id,
      paymentId: payment.id,
      status: charge.status,
      checkoutUrl: charge.checkoutUrl,
      pixQrCode: charge.pixQrCode,
      amount,
    };
  }

  async activateSubscription(subscriptionId: string, period: Period) {
    const currentPeriodEnd = new Date();
    currentPeriodEnd.setMonth(currentPeriodEnd.getMonth() + PERIOD_MONTHS[period]);
    await this.prisma.subscription.update({
      where: { id: subscriptionId },
      data: { status: "ACTIVE", startedAt: new Date(), currentPeriodEnd },
    });
  }

  /** Webhook do Asaas — confirma pagamento assíncrono e libera a assinatura. */
  async handleAsaasWebhook(payload: { payment?: { id: string; status: string } }) {
    const chargeId = payload.payment?.id;
    if (!chargeId) return { ok: false };

    const payment = await this.prisma.payment.findFirst({ where: { providerChargeId: chargeId } });
    if (!payment) return { ok: false };

    const approved = payload.payment?.status === "CONFIRMED" || payload.payment?.status === "RECEIVED";
    await this.prisma.payment.update({
      where: { id: payment.id },
      data: { status: approved ? "APPROVED" : "FAILED" },
    });

    if (approved) {
      const subscription = await this.prisma.subscription.findUniqueOrThrow({ where: { id: payment.subscriptionId } });
      await this.activateSubscription(subscription.id, subscription.period);
    }

    return { ok: true };
  }
}
