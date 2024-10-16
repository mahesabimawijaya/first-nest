import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { response } from 'src/utils/response.util';
import { UpdateProductDto } from './dto/update-product.dto';
import { Category } from 'src/categories/entities/category.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
    @InjectRepository(Category)
    private readonly categoriesRepository: Repository<Category>,
  ) {}

  //create
  async create(createProductDto: CreateProductDto) {
    try {
      const { name, description, stock, price, categoryId } = createProductDto;

      if (!name || !description || !stock || !price || !categoryId) {
        throw new BadRequestException(
          response(false, 'Please fill your fields correctly', null),
        );
      }

      const existedProduct = await this.productsRepository.findOne({
        where: {
          name: createProductDto.name,
        },
      });

      if (existedProduct) {
        throw new ConflictException(
          response(false, 'Product already exist', null),
        );
      }

      const existedCategory = await this.categoriesRepository.findOne({
        where: {
          id: createProductDto.categoryId,
        },
      });

      if (!existedCategory) {
        throw new NotFoundException(
          response(false, 'Category not found', null),
        );
      }

      const product = new Product();
      Object.assign(product, createProductDto);
      product.category = existedCategory;
      const result = await this.productsRepository.save(product);

      return response(true, 'Product created successfully', result);
    } catch (error) {
      console.error('Error creating product:', error);

      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException ||
        error instanceof ConflictException
      ) {
        throw error;
      }

      throw new InternalServerErrorException('An unexpected error occurred');
    }
  }

  //read
  async findAll() {
    try {
      const result = await this.productsRepository.find({
        relations: ['category'],
      });

      return response(true, 'Products fetched', result);
    } catch (error) {
      console.error('Error fetching products:', error);
      throw new InternalServerErrorException('An unexpected error occurred');
    }
  }

  //read:one
  async findOne(id: number) {
    try {
      const result = await this.productsRepository.findOne({
        where: {
          id,
        },
        relations: ['category'],
      });

      if (!result) {
        throw new NotFoundException(response(false, 'Product not found', null));
      }

      return response(true, 'Product fetched', result);
    } catch (error) {
      console.error('Error fetching product:', error);

      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('An unexpected error occurred');
    }
  }

  //update
  async update(id: number, updateProductDto: UpdateProductDto) {
    try {
      const { name, description, stock, price, categoryId } = updateProductDto;

      if (!name || !description || !stock || !price || !categoryId) {
        throw new BadRequestException(
          response(false, 'Please fill your fields correctly', null),
        );
      }

      const data = await this.productsRepository.findOne({
        where: {
          id,
        },
      });

      if (!data) {
        throw new NotFoundException(response(false, 'Product not found', null));
      }

      const category = await this.categoriesRepository.findOne({
        where: {
          id: updateProductDto.categoryId,
        },
      });

      if (!category) {
        throw new NotFoundException(
          response(false, 'Category not found', null),
        );
      }

      data.name = updateProductDto.name;
      data.description = updateProductDto.description;
      data.stock = updateProductDto.stock;
      data.price = updateProductDto.price;
      data.category = category;

      const result = await this.productsRepository.save(data);

      return response(true, 'Product updated successfully', result);
    } catch (error) {
      console.error('Error updating product:', error);

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
      const data = await this.productsRepository.findOne({
        where: {
          id,
        },
      });

      if (!data) {
        throw new NotFoundException(response(false, 'Product not found', null));
      }

      const result = await this.productsRepository.remove(data);

      return response(true, 'Product deleted successfully', result);
    } catch (error) {
      console.error('Error deleting product:', error);

      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException('An unexpected error occurred');
    }
  }
}
