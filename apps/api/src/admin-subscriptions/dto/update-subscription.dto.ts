import { IsIn, IsOptional, IsString } from "class-validator";
import { PlanCode, SubscriptionStatus } from "@prisma/client";

export class UpdateSubscriptionDto {
  @IsOptional() @IsIn(Object.values(SubscriptionStatus)) status?: SubscriptionStatus;
  @IsOptional() @IsString() planCode?: PlanCode;
}
