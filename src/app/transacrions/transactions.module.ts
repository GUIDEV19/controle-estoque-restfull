import { Module } from "@nestjs/common";
import { DatabaseModule } from "src/config/database.module";
import { TransactionsController } from "./controller/transaction.controller";
import { TransactionsService } from "./bussines/transactions.service";
import { TransactionsProvider } from "./provider/transactions.provider";

@Module({
    imports: [DatabaseModule],
    controllers: [TransactionsController],
    providers: [TransactionsService, TransactionsProvider],
    exports: [TransactionsService],
})
export class TransactionsModule {}