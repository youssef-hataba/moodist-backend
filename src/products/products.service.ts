import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { generateSlug } from '../categories/utils/slug.util';
import { GetProductsQueryDto } from './dto/get-product.dot';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) { }

  private async generateUniqueSlug(baseSlug: string): Promise<string> {
    let slug = baseSlug;
    let counter = 1;

    while (true) {
      const exists = await this.prisma.product.findUnique({
        where: { slug },
      });

      if (!exists) return slug;

      slug = `${baseSlug}-${counter}`;
      counter++;
    }
  }

  async create(dto: CreateProductDto) {
    const category = await this.prisma.category.findUnique({
      where: { id: dto.categoryId },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    const baseSlug = generateSlug(dto.title);
    const slug = await this.generateUniqueSlug(baseSlug);

    return this.prisma.$transaction(async (tx) => {
      const product = await tx.product.create({
        data: {
          title: dto.title,
          slug,
          description: dto.description,
          basePrice: dto.basePrice,
          categoryId: dto.categoryId,
        },
      });

      // Variants
      await tx.productVariant.createMany({
        data: dto.variants.map((v) => ({
          ...v,
          productId: product.id,
        })),
      });

      // Images
      await tx.productImage.createMany({
        data: dto.images.map((img) => ({
          ...img,
          productId: product.id,
        })),
      });

      // Designs (optional)
      if (dto.designs?.length) {
        await tx.design.createMany({
          data: dto.designs.map((d) => ({
            ...d,
            productId: product.id,
          })),
        });
      }

      return product;
    });
  }

  async findAll(query: GetProductsQueryDto) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;

    const where: any = {};

    // search
    if (query.search) {
      where.OR = [
        {
          title: {
            contains: query.search,
            mode: 'insensitive',
          },
        },
        {
          description: {
            contains: query.search,
            mode: 'insensitive',
          },
        },
      ];
    }

    // category filter
    if (query.category) {
      where.categoryId = query.category;
    }

    // price filter
    if (query.minPrice || query.maxPrice) {
      where.basePrice = {};

      if (query.minPrice) {
        where.basePrice.gte = Number(query.minPrice);
      }

      if (query.maxPrice) {
        where.basePrice.lte = Number(query.maxPrice);
      }
    }

    const [data, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          category: true,
          images: true,
          variants: true,
        },
      }),

      this.prisma.product.count({ where }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / limit),
      },
    };
  }

  async findBySlug(slug: string) {
    const product = await this.prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        images: true,
        variants: true,
        designs: true,
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }
}