import { Body, Controller, Headers, Post, Req, UnauthorizedException, UseGuards } from "@nestjs/common";
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

  /**
   * Asaas assina o webhook com o token configurado no dashboard (header asaas-access-token).
   * Sem ASAAS_WEBHOOK_TOKEN configurado, recusa por padrão — evita que qualquer um forje uma
   * aprovação de pagamento chamando este endpoint diretamente.
   */
  @Post("payments/webhook/asaas")
  webhook(@Headers("asaas-access-token") token: string | undefined, @Body() payload: any) {
    const expected = process.env.ASAAS_WEBHOOK_TOKEN;
    if (!expected || token !== expected) {
      throw new UnauthorizedException("Assinatura do webhook inválida.");
    }
    return this.paymentsService.handleAsaasWebhook(payload);
  }
}
