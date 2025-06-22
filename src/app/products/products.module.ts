import { Module } from "@nestjs/common";
import { DatabaseModule } from "src/config/database.module";
import { ProductsService } from "./bussines/products.service";;
import { CategoriesModule } from "../categories/categories.module";
import { ProductsController } from "./controller/products.controller";
import { productsProvider } from "./provider/products.provider";

@Module({
    imports: [DatabaseModule, CategoriesModule],
    controllers: [ProductsController],
    providers: [...productsProvider, ProductsService],
    exports: [ProductsService]
})
export class ProductsModule {}