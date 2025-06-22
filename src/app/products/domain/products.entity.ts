import { Category } from "src/app/categories/domain/categories.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn, JoinColumn } from "typeorm";

@Entity('TbProduct')
export class Product {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column()
    quantity: number;

    @Column()
    price: number;
    
    @Column({ name: 'category_id' })
    category_id: number;

    @Column({ name: 'user_created_id' })
    user_created_id: number;

    @Column({ name: 'user_updated_id' })
    user_updated_id: number;

    @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
    updated_at: Date;

    @DeleteDateColumn({ type: 'timestamp', name: 'deleted_at' })
    deleted_at: Date;

    @ManyToOne(() => Category, { eager: true })
    @JoinColumn({ name: 'category_id' })
    category: Category;
}