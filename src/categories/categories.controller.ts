import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly service: CategoriesService) {}

  // CREATE
  @Post()
  create(@Body() dto: CreateCategoryDto) {
    return this.service.create(dto);
  }

  // READ ALL
  @Get()
  findAll() {
    return this.service.findAll();
  }

  // READ ONE
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  // UPDATE
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: CreateCategoryDto) {
    return this.service.update(id, dto);
  }

  // DELETE
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}