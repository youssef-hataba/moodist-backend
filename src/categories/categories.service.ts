import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Category } from '@prisma/client';
import { generateSlug } from './utils/slug.util';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) { }

  private async generateUniqueSlug(baseSlug: string): Promise<string> {
    let slug = baseSlug;
    let counter = 1;

    while (true) {
      const exists = await this.prisma.category.findUnique({
        where: { slug },
      });

      if (!exists) return slug;

      slug = `${baseSlug}-${counter}`;
      counter++;
    }
  }

  // CREATE
  async create(dto: CreateCategoryDto): Promise<Category> {
    const name = dto.name.trim().toLowerCase();
    const description = dto.description?.trim().toLowerCase();
    const baseSlug = generateSlug(name);
    const slug = await this.generateUniqueSlug(baseSlug);

    const exists = await this.prisma.category.findUnique({
      where: { name },
    });

    if (exists) {
      throw new ConflictException('Category already exists');
    }

    return this.prisma.category.create({
      data: {
        name,
        description,
        slug,
        image: dto.image,
        metaTitle: dto.metaTitle,
        metaDescription: dto.metaDescription,
        metaKeywords: dto.metaKeywords,
      },
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

  async findBySlug(slug: string): Promise<Category> {
    const category = await this.prisma.category.findUnique({
      where: { slug },
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