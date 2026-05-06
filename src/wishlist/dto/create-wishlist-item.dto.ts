import { IsNotEmpty, IsString } from 'class-validator';

export class CreateWishlistItemDto {
  @IsNotEmpty()
  @IsString()
  productId: string;
}
