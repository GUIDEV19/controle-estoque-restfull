import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from "@nestjs/common";
import { ProductsService } from "../bussines/products.service";
import { CreateProductDto, UpdateProductDto } from "../dto/products.dto";
import { AuthenticatedUserDto } from "src/app/users/dto/user.dto";
import { CurrentUser } from "../../auth/decorators/current-user.decorator";
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard";

@Controller('products')
@UseGuards(JwtAuthGuard)
export class ProductsController {
    constructor(private readonly productsService: ProductsService) {}

    @Post()
    async create(
        @Body() createProductDto: CreateProductDto,
        @CurrentUser() user: AuthenticatedUserDto
    ) {
        return this.productsService.create(createProductDto, user);
    }

    @Get()
    async findAll() {
        return this.productsService.findAll();
    }

    @Get(':id')
    async findOne(
        @Param('id') id: number
    ) {
        return this.productsService.findOne(id);
    }

    @Put(':id')
    async update(
        @Param('id') id: number,
        @Body() updateProductDto: UpdateProductDto,
        @CurrentUser() user: AuthenticatedUserDto
    ) {
        return this.productsService.update(id, updateProductDto, user);
    }

    @Delete(':id')
    async delete(
        @Param('id') id: number,
        @CurrentUser() user: AuthenticatedUserDto
    ) {
        return this.productsService.delete(id, user);
    }
}