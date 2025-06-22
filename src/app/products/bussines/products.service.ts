import { BadRequestException, Inject, Injectable, InternalServerErrorException } from "@nestjs/common";
import { Product } from "../domain/products.entity";
import { Repository } from "typeorm";
import { CreateProductDto } from "../dto/products.dto";
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
}