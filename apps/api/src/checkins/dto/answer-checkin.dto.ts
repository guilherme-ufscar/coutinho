import { IsString, MinLength } from "class-validator";

export class AnswerCheckInDto {
  @IsString()
  @MinLength(1)
  answer!: string;
}
