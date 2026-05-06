import { IsString, IsEnum, IsOptional } from 'class-validator';

export enum PaymentMethod {
  CARD = 'CARD',
  COD = 'COD',
}

export class CreateOrderDto {
  @IsString()
  addressId!: string;

  @IsEnum(PaymentMethod)
  paymentMethod!: PaymentMethod;

  // Optional fields for future extensions (e.g., coupon codes)
  @IsOptional()
  @IsString()
  couponCode?: string;
}
