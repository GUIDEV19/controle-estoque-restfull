import { Body, Controller, Post, UseGuards, UseInterceptors } from "@nestjs/common";
import { ProductsService } from "../bussines/products.service";
import { CreateProductDto } from "../dto/products.dto";
import { AuthenticatedUserDto } from "src/app/users/dto/user.dto";
import { CurrentUser } from "../../auth/decorators/current-user.decorator";
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard";
import { UserContextInterceptor } from "../../auth/interceptors/user-context.interceptor";

@Controller('products')
@UseGuards(JwtAuthGuard)
@UseInterceptors(UserContextInterceptor)
export class ProductsController {
    constructor(private readonly productsService: ProductsService) {}

    @Post()
    async create(
        @Body() createProductDto: CreateProductDto,
        @CurrentUser() user: AuthenticatedUserDto
    ) {
        return this.productsService.create(createProductDto, user);
    }
}