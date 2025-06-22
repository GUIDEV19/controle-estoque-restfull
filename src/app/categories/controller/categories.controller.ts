import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards, UseInterceptors } from "@nestjs/common";
import { CategoriesService } from "../busssines/categories.service";
import { CreateCategoryDto } from "../dto/categories.dto";
import { CurrentUser } from "../../auth/decorators/current-user.decorator";
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard";
import { UserContextInterceptor } from "../../auth/interceptors/user-context.interceptor";
import { TbUser } from "../../users/domain/user.entity";

@Controller('categories')
@UseGuards(JwtAuthGuard)
@UseInterceptors(UserContextInterceptor)
export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService) {}

    @Post()
    create(
        @Body() createCategoryDto: CreateCategoryDto,
    ) {
        return this.categoriesService.create(createCategoryDto);
    }

    @Get()
    findAll() {
        return this.categoriesService.findAll();
    }

    @Get(':id')
    findOne(
        @Param('id') id: string,
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
        @Param('id') id: string,
    ) {
        return this.categoriesService.delete(+id);
    }
}