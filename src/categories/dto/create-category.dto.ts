import { IsString, MinLength, MaxLength, IsOptional, IsUrl } from 'class-validator';

export class CreateCategoryDto {
  @IsString({ message: 'Category name must be a string' })
  @MinLength(3, {
    message: 'Category name must be at least 3 characters long',
  })
  @MaxLength(50, {
    message: 'Category name must not exceed 50 characters',
  })
  name!: string;

  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  @MaxLength(200, {
    message: 'Description must not exceed 200 characters',
  })
  description?: string;


  @IsOptional()
  @IsUrl({}, { message: 'Image must be a valid URL' })
  image?: string;

  @IsOptional()
  @IsString()
  @MaxLength(60)
  metaTitle?: string;

  @IsOptional()
  @IsString()
  @MaxLength(160)
  metaDescription?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  metaKeywords?: string;
}