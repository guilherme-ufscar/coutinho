import { IsEnum, IsOptional, IsString } from "class-validator";
import { LibraryContentType } from "@prisma/client";

export class LibraryContentDto {
  @IsEnum(LibraryContentType) type!: LibraryContentType;
  @IsString() title!: string;
  @IsOptional() @IsString() body?: string;
  @IsOptional() @IsString() mediaUrl?: string;
}
