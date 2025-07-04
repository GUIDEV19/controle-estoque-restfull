import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class TransactionItemDto {
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  quantity: number;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  price_total: number;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  product_id: number;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  transaction_id: number;
}