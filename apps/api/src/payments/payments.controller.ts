import { Body, Controller, Get, Headers, Post, Query, Req, UnauthorizedException, UseGuards } from "@nestjs/common";
import { createHmac } from "node:crypto";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { PaymentsService } from "./payments.service";
import { CheckoutDto } from "./dto/checkout.dto";

@Controller()
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @Post("checkout")
  @UseGuards(JwtAuthGuard)
  checkout(@Req() req: any, @Body() dto: CheckoutDto) {
    return this.paymentsService.checkout(req.user.userId, dto);
  }

  /** Endpoint público — devolve a public key do Mercado Pago (nunca o access token). */
  @Get("payments/checkout-config")
  checkoutConfig() {
    return { provider: "MERCADOPAGO", publicKey: process.env.MERCADOPAGO_PUBLIC_KEY };
  }

  /**
   * Webhook das cobranças recorrentes (assinatura/cartão). Assinado pelo Mercado Pago via
   * `x-signature` (ts + hash HMAC-SHA256) — configurar `MERCADOPAGO_WEBHOOK_SECRET` com o mesmo
   * segredo cadastrado no painel do MP (Suas integrações > Webhooks). Sem o env configurado,
   * recusa por padrão, igual ao antigo webhook do Asaas.
   */
  @Post("payments/webhook/mercadopago")
  webhook(
    @Headers("x-signature") signature: string | undefined,
    @Headers("x-request-id") requestId: string | undefined,
    @Query("data.id") dataId: string | undefined,
    @Body() payload: { type?: string; action?: string }
  ) {
    const secret = process.env.MERCADOPAGO_WEBHOOK_SECRET;
    if (!secret || !signature || !requestId || !dataId) {
      throw new UnauthorizedException("Assinatura do webhook inválida.");
    }
    const parts = Object.fromEntries(signature.split(",").map((p) => p.trim().split("=")) as [string, string][]);
    const manifest = `id:${dataId.toLowerCase()};request-id:${requestId};ts:${parts.ts};`;
    const expected = createHmac("sha256", secret).update(manifest).digest("hex");
    if (expected !== parts.v1) {
      throw new UnauthorizedException("Assinatura do webhook inválida.");
    }

    const topic = payload.type ?? "";
    return this.paymentsService.handleMercadoPagoWebhook(topic, dataId);
  }
}
