import { Controller, Get, Post, Body, Param, Req, UseGuards, NotFoundException, BadRequestException } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';

@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async checkout(@Req() req, @Body() createOrderDto: CreateOrderDto) {
    const userId = req.user.id;
    return this.ordersService.checkout(userId, createOrderDto);
  }

  @Get()
  async getUserOrders(@Req() req) {
    const userId = req.user.id;
    return this.ordersService.findByUser(userId);
  }

  @Get(':id')
  async getOrder(@Req() req, @Param('id') id: string) {
    const userId = req.user.id;
    const order = await this.ordersService.findOne(id);
    if (!order || order.userId !== userId) {
      throw new NotFoundException('Order not found');
    }
    return order;
  }
}
