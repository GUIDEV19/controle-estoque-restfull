import { Entity, Column, PrimaryGeneratedColumn, DeleteDateColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('TbUser')
export class TbUser {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 255 })
    name: string;

    @Column({ length: 255 })
    email: string;

    @Column({ length: 255 })
    password: string;

    @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
    updated_at: Date;

    @DeleteDateColumn({ type: 'timestamp', name: 'deleted_at', nullable: true })
    deleted_at: Date;
}