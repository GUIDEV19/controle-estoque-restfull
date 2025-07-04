import { Provider } from "@nestjs/common";
import { Transaction } from "../domain/transactions.entity";
import { DataSource, Repository } from "typeorm";

export const TransactionsProvider: Provider<Repository<Transaction>> = {
    provide: 'TRANSACTIONS_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Transaction),
    inject: ['DATA_SOURCE'],
};