import { TransactionItem } from '../domain/transactionsItens.entity';
import { DataSource } from 'typeorm';

export const TransactionItemProviders = [
  {
    provide: 'TRANSACTION_ITEM_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(TransactionItem),
    inject: ['DATA_SOURCE'],
  },
];