
import { Entity, Column, PrimaryGeneratedColumn, DeleteDateColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('TbEntity')
export class TbEntity {
  @PrimaryGeneratedColumn()
  idEntity: number;

  @Column({ length: 255 })
  name: string;

  @Column({ type: 'enum', enum: ['unity', 'people', 'supplier'] })
  type: string;

  @Column({ length: 255 })
  document: string;

  @Column({ type: 'int', nullable: true })
  daughter: number;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deleted_at: Date;
}
