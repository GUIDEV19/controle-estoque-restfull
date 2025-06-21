import { BadRequestException, Inject, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { Repository } from "typeorm";
import { Category } from "../domain/categories.entity";
import { CreateCategoryDto } from "../dto/categories.dto";
import { CustomLoggerService } from "src/common/services/logger.service";

@Injectable()
export class CategoriesService {
    constructor(
        @Inject('CATEGORY_REPOSITORY')
        private categoryRepository: Repository<Category>,
        private readonly logger: CustomLoggerService,
    ) {}

    async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
        try {
            if(await this.categoryRepository.findOne({ where: { name: createCategoryDto.name } })) {
                throw new BadRequestException('Category already exists');
            }
            return await this.categoryRepository.save(createCategoryDto);
        } catch (error) {
            if(error instanceof BadRequestException) {
                this.logger.warn('Category already exists', 'CategoriesService');
                throw error;
            }
            this.logger.error('Error creating category', error.stack, 'CategoriesService');
            throw new InternalServerErrorException(error);
        }
    }

    async findAll(): Promise<Category[]> {
        try {
            const categories = await this.categoryRepository.find();
            if(categories.length === 0) throw new NotFoundException('Categories not found');
            return categories;
        } catch (error) {
            if(error instanceof NotFoundException) {
                this.logger.warn('Categories not found', 'CategoriesService');
                throw error;
            }
            this.logger.error('Error fetching categories', error.stack, 'CategoriesService');
            throw new InternalServerErrorException(error);
        }
    }

    async findOne(id: number): Promise<Category> {
        try {
            const category = await this.categoryRepository.findOne({ where: { id } });
            if(!category) throw new NotFoundException('Category not found');
            return category;
        } catch (error) {
            if(error instanceof NotFoundException) {
                this.logger.warn('Category not found', 'CategoriesService');
                throw error;
            }
            this.logger.error('Error fetching category', error.stack, 'CategoriesService');
            throw new InternalServerErrorException(error);
        }
    }

    async update(id: number, updateCategoryDto: CreateCategoryDto): Promise<Category> {
        try {
            const category = await this.categoryRepository.findOne({ where: { id } });
            if(!category) throw new NotFoundException('Category not found');
            return await this.categoryRepository.save({ ...updateCategoryDto, id });
        } catch (error) {
            if(error instanceof NotFoundException) {
                this.logger.warn('Category not found', 'CategoriesService');
                throw error;
            }
            this.logger.error('Error updating category', error.stack, 'CategoriesService');
            throw new InternalServerErrorException(error);
        }
    }

    async delete(id: number): Promise<void> {
        try {
            const category = await this.categoryRepository.findOne({ where: { id } });
            if(!category) throw new NotFoundException('Category not found');
            await this.categoryRepository.softDelete(id);
        } catch (error) {
            if(error instanceof NotFoundException) {
                this.logger.warn('Category not found', 'CategoriesService');
                throw error;
            }
            this.logger.error('Error deleting category', error.stack, 'CategoriesService');
            throw new InternalServerErrorException(error);
        }
    }
}