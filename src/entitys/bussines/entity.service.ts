
import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { TbEntity } from '../domain/entity.entity';

@Injectable()
export class EntityService {
  constructor(
    @Inject('ENTITY_REPOSITORY')
    private entityRepository: Repository<TbEntity>,
  ) {}

  async findAll(): Promise<TbEntity[]> {
    return this.entityRepository.find();
  }
}
