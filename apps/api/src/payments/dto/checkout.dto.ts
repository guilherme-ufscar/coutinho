import { IsIn, IsInt, IsOptional, IsString } from "class-validator";
import { PlanCode, Period } from "@prisma/client";

export class CheckoutDto {
  @IsIn(Object.values(PlanCode))
  planCode!: PlanCode;

  @IsIn(Object.values(Period))
  period!: Period;

  @IsOptional()
  @IsString()
  couponCode?: string;

  @IsIn(["pix", "cartao"])
  method!: "pix" | "cartao";

  // Preenchidos só quando o gateway ativo é o Mercado Pago e o método é cartão/Google Pay —
  // token gerado no navegador pelo SDK do MP (Payment Brick), nunca dado de cartão em texto puro.
  @IsOptional()
  @IsString()
  token?: string;

  @IsOptional()
  @IsString()
  paymentMethodId?: string;

  @IsOptional()
  @IsInt()
  installments?: number;

  @IsOptional()
  @IsString()
  payerDocNumber?: string;
}
