import { BadRequestException, Inject, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { Product } from "../domain/products.entity";
import { Repository } from "typeorm";
import { CreateProductDto, UpdateProductDto } from "../dto/products.dto";
import { CategoriesService } from "src/app/categories/busssines/categories.service";
import { CustomLoggerService } from "src/common/services/logger.service";
import { AuthenticatedUserDto } from "src/app/users/dto/user.dto";

@Injectable()
export class ProductsService {
    constructor(
        @Inject('PRODUCT_REPOSITORY')
        private productRepository: Repository<Product>,
        private readonly categoriesService: CategoriesService,
        private readonly logger: CustomLoggerService
    ) {}

    async create(createProductDto: CreateProductDto, user: AuthenticatedUserDto) {
        try {
            if (!user) {
                throw new BadRequestException('User not identified');
            }

            const category = await this.categoriesService.findOne(createProductDto.category_id);
            if (!category) {
                throw new BadRequestException('Category not found');
            }

            const product = this.productRepository.create({
                ...createProductDto,
                user_created_id: user.id,
                user_updated_id: user.id
            });
            return await this.productRepository.save(product);
        } catch (error) {
            if (error instanceof BadRequestException) {
                this.logger.warn('User not identified', 'ProductsService');
                throw error;
            }
            this.logger.error('Error creating product', error.stack, 'ProductsService');
            throw new InternalServerErrorException('Error creating product');
        }
    }

    async findAll(): Promise<Product[]> {
        try {
            const products = await this.productRepository.find();
            if (!products) {
                throw new NotFoundException('Products not found');
            }
            return products;
        } catch (error) {
            if (error instanceof NotFoundException) {
                this.logger.warn('Products not found', 'ProductsService');
                throw error;
            }
            this.logger.error('Error fetching products', error.stack, 'ProductsService');
            throw new InternalServerErrorException('Error fetching products');
        }
    }

    async findOne(id: number): Promise<Product> {
        try {
            const product = await this.productRepository.findOne({ where: { id } });
            if (!product) {
                throw new NotFoundException('Product not found');
            }
            return product;
        } catch (error) {
            if (error instanceof NotFoundException) {
                this.logger.warn('Product not found', 'ProductsService');
                throw error;
            }
            this.logger.error('Error fetching product', error.stack, 'ProductsService');
            throw new InternalServerErrorException('Error fetching product');
        }
    }

    async update(id: number, updateProductDto: UpdateProductDto, user: AuthenticatedUserDto): Promise<Product> {
        try {
            const product = await this.productRepository.findOne({ where: { id } });
            if (!product) {
                throw new NotFoundException('Product not found');
            }
            return await this.productRepository.save({id, ...updateProductDto, user_updated_id: user.id });
        } catch (error) {
            if (error instanceof NotFoundException) {
                this.logger.warn('Product not found', 'ProductsService');
                throw error;
            }
            this.logger.error('Error updating product', error.stack, 'ProductsService');
            throw new InternalServerErrorException('Error updating product');
        }
    }

    async delete(id: number, user: AuthenticatedUserDto): Promise<void> {
        try {
            const product: Product | any = await this.productRepository.findOne({ where: { id } });
            if (!product) {
                throw new NotFoundException('Product not found');
            }
            product.user_updated_id = user.id; 
            await this.productRepository.save(product);
            
            await this.productRepository.softDelete(id);
        } catch (error) {
            if (error instanceof NotFoundException) {
                this.logger.warn('Product not found', 'ProductsService');
                throw error;
            }
            this.logger.error('Error deleting product', error.stack, 'ProductsService');
            throw new InternalServerErrorException('Error deleting product');
        }
    }
}