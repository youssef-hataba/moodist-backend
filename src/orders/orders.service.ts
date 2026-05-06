import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order, OrderItem } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  // Checkout creates an order and clears the cart
  async checkout(userId: string, createOrderDto: CreateOrderDto): Promise<Order> {
    // Validate cart exists
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: { items: { include: { variant: true } } },
    });
    if (!cart || cart.items.length === 0) {
      throw new NotFoundException('Cart is empty');
    }

        const totalAmount = cart.items.reduce((sum, i) => {
          const price = i.variant?.price ?? 0;
          return sum + price * i.quantity;
        }, 0);
        const order = await this.prisma.order.create({
          data: {
            userId,
            status: 'PENDING',
            totalAmount,
            addressId: createOrderDto.addressId,
            paymentMethod: createOrderDto.paymentMethod,
            items: {
              create: cart.items.map((item) => ({
                productId: item.productId,
                variantId: item.variantId,
                quantity: item.quantity,
                price: item.variant?.price ?? 0,
                customDesignUrl: item.customDesignUrl,
                customText: item.customText,
              })),
            },
          },
        });

    // Clear cart
    await this.prisma.cartItem.deleteMany({ where: { cartId: cart.id } });

    return order;
  }

  async findByUser(userId: string): Promise<Order[]> {
    return this.prisma.order.findMany({ where: { userId } });
  }

  async findOne(id: string): Promise<Order | null> {
    return this.prisma.order.findUnique({ where: { id } });
  }
}
