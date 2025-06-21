import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { CategoriesService } from "../busssines/categories.service";
import { CreateCategoryDto } from "../dto/categories.dto";

@Controller('categories')
export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService) {}

    @Post()
    create(@Body() createCategoryDto: CreateCategoryDto) {
        return this.categoriesService.create(createCategoryDto);
    }

    @Get()
    findAll() {
        return this.categoriesService.findAll();
    }

    @Get(':id')
    findOne(
        @Param('id') id: string
    ) {
        return this.categoriesService.findOne(+id);
    }

    @Put(':id')
    update(
        @Param('id') id: string, 
        @Body() updateCategoryDto: CreateCategoryDto,
    ) {
        return this.categoriesService.update(+id, updateCategoryDto);
    }   

    @Delete(':id')
    delete(
        @Param('id') id: string
    ) {
        return this.categoriesService.delete(+id);
    }
}