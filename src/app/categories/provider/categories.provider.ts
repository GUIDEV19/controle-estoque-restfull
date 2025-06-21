import { DataSource } from "typeorm";
import { Category } from "../domain/categories.entity";

export const categoriesProvider = [
    {
        provide: 'CATEGORY_REPOSITORY',
        useFactory: (dataSource: DataSource) => dataSource.getRepository(Category),
        inject: ['DATA_SOURCE'],
    },
];