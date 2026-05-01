import {
  IsString,
  IsOptional,
  IsNumber,
  IsArray,
  ValidateNested,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

class CreateVariantDto {
  @IsString()
  size!: string;

  @IsString()
  color!: string;

  @IsNumber()
  @Min(0)
  stock!: number;

  @IsOptional()
  @IsNumber()
  price?: number;
}

class CreateImageDto {
  @IsString()
  url!: string;

  @IsOptional()
  @IsString()
  alt?: string;

  @IsOptional()
  isPrimary?: boolean;
}

class CreateDesignDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsString()
  imageUrl!: string;
}

export class CreateProductDto {
  @IsString()
  title!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  @Min(0)
  basePrice!: number;

  @IsString()
  categoryId!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateVariantDto)
  variants!: CreateVariantDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateImageDto)
  images!: CreateImageDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateDesignDto)
  designs?: CreateDesignDto[];
}