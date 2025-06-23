import { Body, Controller, Post } from "@nestjs/common";
import { TransactionsService } from "../bussines/transactions.service";
import { CurrentUser } from "src/app/auth/decorators/current-user.decorator";
import { CreateTransactionDto } from "../dto/transactions.dto";
import { AuthenticatedUserDto } from "src/app/users/dto/user.dto";
import { Transaction } from "../domain/transactions.entity";

@Controller('transactions')
export class TransactionsController {
    constructor(private readonly transactionsService: TransactionsService) {}

    @Post()
    async create(
        @Body() createTransactionDto: CreateTransactionDto, 
        @CurrentUser() user: AuthenticatedUserDto
    ): Promise<Transaction> {
        return await this.transactionsService.create(createTransactionDto, user);
    }
}