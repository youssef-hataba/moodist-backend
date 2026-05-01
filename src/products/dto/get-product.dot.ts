import { IsOptional, IsString } from 'class-validator';

export class GetProductsQueryDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  page?: string;

  @IsOptional()
  limit?: string;

  @IsOptional()
  category?: string;

  @IsOptional()
  minPrice?: string;

  @IsOptional()
  maxPrice?: string;
}