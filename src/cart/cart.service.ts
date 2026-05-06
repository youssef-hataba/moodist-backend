import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { AddToCartDto } from "./dto/add-to-cart.dto";
import { UpdateCartItemDto } from "./dto/update-cart.dto";

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) { }

  async getCart(userId: string) {
    return this.prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              include: { images: true },
            },
            variant: true,
          },
        },
      },
    });
  }

  async addToCart(userId: string, dto: AddToCartDto) {
  let cart = await this.prisma.cart.findFirst({
    where: { userId },
  });

  if (!cart) {
    cart = await this.prisma.cart.create({
      data: { userId },
    });
  }

  const existing = await this.prisma.cartItem.findFirst({
    where: {
      cartId: cart.id,
      productId: dto.productId,
      variantId: dto.variantId ?? null,
      customDesignUrl: dto.customDesignUrl ?? null,
      customText: dto.customText ?? null,
    },
  });

  if (existing) {
    return this.prisma.cartItem.update({
      where: { id: existing.id },
      data: {
        quantity: existing.quantity + dto.quantity,
      },
    });
  }

  return this.prisma.cartItem.create({
    data: {
      cartId: cart.id,
      productId: dto.productId,
      variantId: dto.variantId,
      quantity: dto.quantity,
      customDesignUrl: dto.customDesignUrl,
      customText: dto.customText,
    },
  });
}

  async updateItem(itemId: string, dto: UpdateCartItemDto) {
    return this.prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity: dto.quantity },
    });
  }

  async removeItem(itemId: string) {
    return this.prisma.cartItem.delete({
      where: { id: itemId },
    });
  }

  async clearCart(userId: string) {
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
    });

    if (!cart) return;

    return this.prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });
  }
}