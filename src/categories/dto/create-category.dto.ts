import { IsString, MinLength, MaxLength } from 'class-validator';

export class CreateCategoryDto {
  @IsString({ message: 'Category name must be a string' })
  @MinLength(3, {
    message: 'Category name must be at least 3 characters long',
  })
  @MaxLength(50, {
    message: 'Category name must not exceed 50 characters',
  })
  name!: string;
}