import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { response } from 'src/utils/response.util';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoriesRepository: Repository<Category>,
  ) {}

  //create
  async create(createCategoryDto: CreateCategoryDto) {
    try {
      if (createCategoryDto.name === '') {
        throw new BadRequestException(
          response(false, 'Please fill your fields correctly', null),
        );
      }

      const existedCategory = await this.categoriesRepository.findOne({
        where: { name: createCategoryDto.name },
      });

      if (existedCategory) {
        throw new ConflictException(
          response(false, 'Category already in database', null),
        );
      }

      const category = new Category();
      Object.assign(category, createCategoryDto);
      const result = await this.categoriesRepository.save(category);

      return response(true, 'Category Created Successfully', result);
    } catch (error) {
      console.error('Error creating category:', error);

      if (
        error instanceof ConflictException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }

      throw new InternalServerErrorException('An unexpected error occurred');
    }
  }

  //read
  async findAll() {
    try {
      const result = await this.categoriesRepository.find({
        relations: ['products'],
      });

      return response(true, 'Categories fetched', result);
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw new InternalServerErrorException('An unexpected error occurred');
    }
  }

  //read:one
  async findOne(id: number) {
    try {
      const result = await this.categoriesRepository.findOne({
        where: {
          id,
        },
        relations: ['products'],
      });

      if (!result) {
        throw new NotFoundException(response(false, 'Data not found', null));
      }
      return response(true, 'Category Fetched', result);
    } catch (error) {
      console.error('Error fetching category:', error);

      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException('An unexpected error occurred');
    }
  }

  //update
  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    try {
      if (updateCategoryDto.name === '') {
        throw new BadRequestException(
          response(false, 'Please fill your fields correctly', null),
        );
      }

      const data = await this.categoriesRepository.findOne({
        where: {
          id,
        },
      });

      if (!data) {
        throw new NotFoundException(response(false, 'Data not found', null));
      }

      data.name = updateCategoryDto.name;

      const result = await this.categoriesRepository.save(data);

      return response(true, 'Category updated successfully', result);
    } catch (error) {
      console.error('Error updating category:', error);

      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }

      throw new InternalServerErrorException('An unexpected error occurred');
    }
  }

  //delete
  async delete(id: number) {
    try {
      const data = await this.categoriesRepository.findOne({
        where: {
          id,
        },
      });

      if (!data) {
        throw new NotFoundException(response(false, 'Data not found', null));
      }

      const result = await this.categoriesRepository.remove(data);

      return response(true, 'Data deleted successfully', result);
    } catch (error) {
      console.error('Error deleting category:', error);

      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException('An unexpected error occurred');
    }
  }
}
