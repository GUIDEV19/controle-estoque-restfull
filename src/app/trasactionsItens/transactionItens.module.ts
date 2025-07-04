import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/config/database.module';
import { TransactionItemProviders } from './provider/transactionsItens.provider';
import { TransactionItemController } from './controller/transactionsItens.controller';
import { TransactionItemService } from './business/transactionsItens.service';


@Module({
    imports: [DatabaseModule],
    controllers: [TransactionItemController],
    providers: [...TransactionItemProviders, TransactionItemService],
    exports: [TransactionItemService],
})
export class TransactionItensModule { }