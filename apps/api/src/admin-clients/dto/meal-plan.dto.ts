import { Type } from "class-transformer";
import { ArrayMinSize, IsArray, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";

class MealItemDto {
  @IsString() foodId!: string;
  @Type(() => Number) @IsNumber() quantityGrams!: number;
  @IsOptional() @IsString() notes?: string;
}

class MealDto {
  @IsString() time!: string;
  @IsString() name!: string;
  @IsOptional() @IsString() notes?: string;
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MealItemDto)
  items!: MealItemDto[];
}

export class CreateMealPlanDto {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => MealDto)
  meals!: MealDto[];
}
