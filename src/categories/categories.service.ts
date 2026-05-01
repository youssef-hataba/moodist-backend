import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Category } from '@prisma/client';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  // CREATE
  async create(dto: CreateCategoryDto): Promise<Category> {
    const name = dto.name.trim().toLowerCase();

    const exists = await this.prisma.category.findUnique({
      where: { name },
    });

    if (exists) {
      throw new ConflictException('Category already exists');
    }

    return this.prisma.category.create({
      data: { name },
    });
  }

  // READ ALL
  async findAll(): Promise<Category[]> {
    return this.prisma.category.findMany({
      include: {
        _count: {
          select: {
            products: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  // READ ONE
  async findOne(id: string): Promise<Category> {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        products: true,
      },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }

  // UPDATE
  async update(id: string, dto: CreateCategoryDto): Promise<Category> {
    const name = dto.name.trim().toLowerCase();

    const category = await this.prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    const exists = await this.prisma.category.findUnique({
      where: { name },
    });

    if (exists && exists.id !== id) {
      throw new ConflictException('Category name already in use');
    }

    return this.prisma.category.update({
      where: { id },
      data: { name },
    });
  }

  // DELETE
  async remove(id: string): Promise<Category> {
    const category = await this.prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return this.prisma.category.delete({
      where: { id },
    });
  }
}