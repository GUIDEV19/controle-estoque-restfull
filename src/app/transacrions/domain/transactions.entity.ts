import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('TbTransaction')
export class Transaction {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    origin_id: number;

    @Column()
    destination_id: number;

    @Column({
        type: 'enum',
        enum: ['sale', 'buy', 'transfer'],
        default: 'sale'
    })
    type: 'sale' | 'buy' | 'transfer';

    @Column({
        type: 'enum',
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    })
    status: 'pending' | 'approved' | 'rejected';

    @Column()
    price: number;

    @Column()
    user_created_id: number;

    @Column()
    user_updated_id: number;

    @CreateDateColumn({
        type: 'timestamp',
    })
    created_at: Date;

    @UpdateDateColumn({
        type: 'timestamp',
    })
    updated_at: Date;

    @DeleteDateColumn({
        type: 'timestamp',
        name: 'deleted_at',
        nullable: true
    })
    deleted_at: Date;
}