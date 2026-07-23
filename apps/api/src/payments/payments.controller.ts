import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
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
}
