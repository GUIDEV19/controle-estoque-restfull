import { Inject, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { Repository } from "typeorm";
import { Transaction } from "../domain/transactions.entity";
import { CustomLoggerService } from "src/common/services/logger.service";
import { CreateTransactionDto, UpdateTransactionDto } from "../dto/transactions.dto";
import { AuthenticatedUserDto } from "src/app/users/dto/user.dto";

@Injectable()
export class TransactionsService {
    constructor(
        @Inject('TRANSACTIONS_REPOSITORY')
        private readonly transactionRepository: Repository<Transaction>,
        private readonly logger: CustomLoggerService,
    ) {}

    async create(createTransactionDto: CreateTransactionDto, user: AuthenticatedUserDto): Promise<Transaction> {
        try {
            return await this.transactionRepository.save({
                ...createTransactionDto,
                user_created_id: user.id,
                user_updated_id: user.id,
            });
        } catch (error) {
            this.logger.error('Error creating transaction', error.stack, 'TransactionsService');
            throw new InternalServerErrorException('Error creating transaction');
        }
    }

    async findAll(): Promise<Transaction[]> {
        try {
            const transactions = await this.transactionRepository.find();
            if (!transactions) {
                throw new NotFoundException('Transactions not found');
            }
            return transactions;
        } catch (error) {
            if (error instanceof NotFoundException) {
                this.logger.warn('Transactions not found', 'TransactionsService');
                throw error;
            }
            this.logger.error('Error finding all transactions', error.stack, 'TransactionsService');
            throw new InternalServerErrorException('Error finding all transactions');
        }
    }

    async findOne(id: number): Promise<Transaction> {
        try {
            const transaction = await this.transactionRepository.findOne({ where: { id } });
            if (!transaction) {
                throw new NotFoundException('Transaction not found');
            }
            return transaction;
        } catch (error) {
            if (error instanceof NotFoundException) {
                this.logger.warn('Transaction not found', 'TransactionsService');
                throw error;
            }
            this.logger.error('Error finding one transaction', error.stack, 'TransactionsService');
            throw new InternalServerErrorException('Error finding one transaction');
        }
    }

    async update(id: number, updateTransactionDto: UpdateTransactionDto, user: AuthenticatedUserDto): Promise<Transaction> {
        try {
            const transaction = await this.transactionRepository.findOne({ where: { id } });
            if (!transaction) {
                throw new NotFoundException('Transaction not found');
            }
            transaction.user_updated_id = user.id;
            return await this.transactionRepository.save({...transaction});
        } catch (error) {
            if (error instanceof NotFoundException) {
                this.logger.warn('Transaction not found', 'TransactionsService');
                throw error;
            }
            this.logger.error('Error updating transaction', error.stack, 'TransactionsService');
            throw new InternalServerErrorException('Error updating transaction');
        }
    }

    async delete(id: number, user: AuthenticatedUserDto): Promise<void> {
        try {
            const transaction = await this.transactionRepository.findOne({ where: { id } });
            if (!transaction) {
                throw new NotFoundException('Transaction not found');
            }
            transaction.user_updated_id = user.id;
            await this.transactionRepository.save(transaction);
            await this.transactionRepository.softDelete(id);
        } catch (error) {
            if (error instanceof NotFoundException) {
                this.logger.warn('Transaction not found', 'TransactionsService');
                throw error;
            }
            this.logger.error('Error deleting transaction', error.stack, 'TransactionsService');
            throw new InternalServerErrorException('Error deleting transaction');
        }
    }
}