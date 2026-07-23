import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { Period, PlanCode } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { MercadoPagoPaymentProvider } from "./providers/mercadopago-payment.provider";
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
    private mercadoPagoProvider: MercadoPagoPaymentProvider
  ) {}

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

    const provider = this.mercadoPagoProvider;
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

}
