import { Body, Controller, Post } from '@nestjs/common';
import { TransactionItemService } from '../business/transactionsItens.service';
import { TransactionItemDto } from '../dto/transactionsItens.dto';
import { TransactionItem } from '../domain/transactionsItens.entity';

@Controller('transactions-items')
export class TransactionItemController {
  constructor(private readonly transactionItemService: TransactionItemService) {}

  @Post()
  async create(@Body() transactionItemDto: TransactionItemDto): Promise<TransactionItem> {
    return this.transactionItemService.create(transactionItemDto);
  }
}