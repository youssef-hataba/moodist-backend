import { Body, Controller, Delete, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { CreateWishlistItemDto } from './dto/create-wishlist-item.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';



@Controller('wishlist')
@UseGuards(JwtAuthGuard)
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Get()
  getWishlist(@Req() req) {
    // Assuming req.user is populated by a guard/middleware we will add
    return this.wishlistService.getWishlist(req.user?.id);
  }

  @Post('add')
  addToWishlist(@Req() req, @Body() dto: CreateWishlistItemDto) {
    return this.wishlistService.addToWishlist(req.user?.id, dto);
  }

  @Delete('remove/:productId')
  removeFromWishlist(@Req() req, @Param('productId') productId: string) {
    return this.wishlistService.removeFromWishlist(req.user?.id, productId);
  }
}
