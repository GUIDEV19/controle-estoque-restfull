import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { TransactionsService } from "../bussines/transactions.service";
import { CurrentUser } from "src/app/auth/decorators/current-user.decorator";
import { CreateTransactionDto, UpdateTransactionDto } from "../dto/transactions.dto";
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

    @Get()
    async findAll(): Promise<Transaction[]> {
        return await this.transactionsService.findAll();
    }

    @Get(':id')
    async findOne(
        @Param('id') id: number
    ): Promise<Transaction> {
        return await this.transactionsService.findOne(id);
    }

    @Put(':id')
    async update(
        @Param('id') id: number,
        @Body() updateTransactionDto: UpdateTransactionDto,
        @CurrentUser() user: AuthenticatedUserDto
    ): Promise<Transaction> {
        return await this.transactionsService.update(id, updateTransactionDto, user);
    }

    @Delete(':id')
    async delete(
        @Param('id') id: number,
        @CurrentUser() user: AuthenticatedUserDto
    ): Promise<void> {
        return await this.transactionsService.delete(id, user);
    }
}