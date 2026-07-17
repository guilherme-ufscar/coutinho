import { IsDateString, IsIn, IsOptional, IsString } from "class-validator";
import { PlanCode } from "@prisma/client";

export class CreateCampaignDto {
  @IsString() title!: string;
  @IsString() body!: string;

  /** "all" ou um PlanCode (segmenta por assinantes ativos daquele plano). */
  @IsIn(["all", ...Object.values(PlanCode)])
  audience!: string;

  @IsOptional() @IsDateString() scheduledFor?: string;
}
