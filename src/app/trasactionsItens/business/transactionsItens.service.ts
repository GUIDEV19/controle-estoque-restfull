import { Inject, Injectable } from '@nestjs/common';
import { TransactionItem } from '../domain/transactionsItens.entity';
import { Repository } from 'typeorm';
import { TransactionItemDto } from '../dto/transactionsItens.dto';

@Injectable()
export class TransactionItemService {
    constructor(
        @Inject('TRANSACTION_ITEM_REPOSITORY')
        private transactionItemRepository: Repository<TransactionItem>,
    ) { }

    async create(transactionItemDto: TransactionItemDto): Promise<TransactionItem> {
        return this.transactionItemRepository.save(transactionItemDto);
    }
}