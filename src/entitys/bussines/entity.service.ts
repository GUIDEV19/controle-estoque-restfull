import { Injectable, Inject, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { TbEntity } from '../domain/entity.entity';
import { CustomLoggerService } from '../../common/services/logger.service';
import { EntityDto } from '../dto/entity.dto';

@Injectable()
export class EntityService {
  constructor(
    @Inject('ENTITY_REPOSITORY')
    private entityRepository: Repository<TbEntity>,
    private readonly logger: CustomLoggerService,
  ) {}

  async findAll(): Promise<TbEntity[]> {
    try{
      const entities = await this.entityRepository.find();
      if(entities.length === 0){
        throw new NotFoundException('No se encontraron entidades');
      }
      return entities;
    }catch(error){
      if(error instanceof NotFoundException){
        this.logger.error('Entity not found error', error.stack, 'EntityService');
        throw error;
      }
      this.logger.error('Error fetching entities', error.stack, 'EntityService');
      throw new InternalServerErrorException('Error al obtener las entidades');
    }
  }

  async save(entity: EntityDto): Promise<TbEntity> {
    try{
      const newEntity = await this.entityRepository.save(entity);
      return newEntity;
    }catch(error){
      this.logger.error('Error saving entity', error.stack, 'EntityService');
      throw new InternalServerErrorException('Error al guardar la entidad');
    }
  }
}
