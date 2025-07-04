import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Transaction } from 'src/app/transacrions/domain/transactions.entity';
import { Product } from 'src/app/products/domain/products.entity';
import { TbUser } from 'src/app/users/domain/user.entity';

@Entity()
export class TransactionItem {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'int' })
    quantity: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    price_total: number;

    @ManyToOne(() => Transaction, (transaction) => transaction.id)
    @JoinColumn({ name: 'transaction_id' })
    transaction: Transaction;

    @ManyToOne(() => Product, (product) => product.id)
    @JoinColumn({ name: 'product_id' })
    product: Product;

    @ManyToOne(() => TbUser, (user) => user.id)
    @JoinColumn({ name: 'user_created_id' })
    user_created: TbUser;

    @ManyToOne(() => TbUser, (user) => user.id)
    @JoinColumn({ name: 'user_updated_id' })
    user_updated: TbUser;

    @CreateDateColumn({ name: 'created_at' })
    created_at: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updated_at: Date;

    @DeleteDateColumn({ name: 'deleted_at' })
    deleted_at: Date;
}