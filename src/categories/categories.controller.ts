import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}
  // /categories
  @Post()
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  // /categories
  @Get()
  async findAll() {
    return this.categoriesService.findAll();
  }

  // /categories/id
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(+id);
  }

  // /categories/id
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() createCategoryDto: CreateCategoryDto,
  ) {
    return this.categoriesService.update(+id, createCategoryDto);
  }

  // /categories/id
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.categoriesService.delete(+id);
  }
}
