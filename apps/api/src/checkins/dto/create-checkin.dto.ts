import { IsEnum, IsString } from "class-validator";
import { CheckInKind } from "@prisma/client";

export class CreateCheckInDto {
  @IsEnum(CheckInKind) kind!: CheckInKind;
  @IsString() question!: string;
}
