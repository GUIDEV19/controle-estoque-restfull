import { Module } from "@nestjs/common";
import { categoriesProvider } from "./provider/categories.provider";
import { CategoriesController } from "./controller/categories.controller";
import { CategoriesService } from "./busssines/categories.service";
import { DatabaseModule } from "src/config/database.module";

@Module({
    imports: [DatabaseModule],
    controllers: [CategoriesController],
    providers: [...categoriesProvider, CategoriesService],
    exports: [CategoriesService]
})
export class CategoriesModule {}