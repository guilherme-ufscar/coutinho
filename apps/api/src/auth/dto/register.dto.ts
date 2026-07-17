import { IsBoolean, IsEmail, IsString, MinLength } from "class-validator";

export class RegisterDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8, { message: "A senha precisa ter pelo menos 8 caracteres." })
  password!: string;

  @IsString()
  @MinLength(2)
  name!: string;

  @IsBoolean()
  consent!: boolean;
}
