import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateTransactionDto {
    @IsNotEmpty()
    @IsNumber()
    origin_id: number;

    @IsNotEmpty()
    @IsNumber()
    destination_id: number;

    @IsNotEmpty()
    @IsString()
    type: 'sale' | 'buy' | 'transfer';

    @IsNotEmpty()
    @IsString()
    status: 'pending' | 'approved' | 'rejected';

    @IsNotEmpty()
    @IsNumber()
    price: number;

    @IsNotEmpty()
    @IsNumber()
    user_created_id: number;

    @IsNotEmpty()
    @IsNumber()
    user_updated_id: number;
}

export class UpdateTransactionDto {
    @IsOptional()
    @IsNumber()
    origin_id?: number;

    @IsOptional()
    @IsNumber()
    destination_id?: number;

    @IsOptional()
    @IsString()
    type?: 'sale' | 'buy' | 'transfer';

    @IsOptional()
    @IsString()
    status?: 'pending' | 'approved' | 'rejected';

    @IsOptional()
    @IsNumber()
    price?: number;
}