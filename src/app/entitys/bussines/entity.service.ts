import { Injectable, Inject, NotFoundException, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { TbEntity } from '../domain/entity.entity';
import { CustomLoggerService } from '../../../common/services/logger.service';
import { EntityDto } from '../dto/entity.dto';

@Injectable()
export class EntityService {
  constructor(
    @Inject('ENTITY_REPOSITORY')
    private entityRepository: Repository<TbEntity>,
    private readonly logger: CustomLoggerService,
  ) { }

  async findAll(): Promise<TbEntity[]> {
    try {
      const entities = await this.entityRepository.find();
      if (entities.length === 0) {
        throw new NotFoundException('No se encontraron entidades');
      }
      return entities;
    } catch (error) {
      if (error instanceof NotFoundException) {
        this.logger.error('Entity not found error', error.stack, 'EntityService');
        throw error;
      }
      this.logger.error('Error fetching entities', error.stack, 'EntityService');
      throw new InternalServerErrorException('Error al obtener las entidades');
    }
  }

  async findByDocument(document: string): Promise<TbEntity | any> {
    try {
      const entity = await this.entityRepository.findOne({ where: { document } });
      return entity;
    } catch (error) {
      this.logger.error('Error fetching entity by document', error.stack, 'EntityService');
    }
  }

  async save(entity: EntityDto): Promise<TbEntity> {
    try {
      const entityExists = await this.findByDocument(entity.document);
      if (entityExists) {
        this.logger.error('Entity already exists', 'EntityService');
        throw new BadRequestException('Entity already exists');
      }
      const newEntity = await this.entityRepository.save(entity);
      return newEntity;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error('Error saving entity', error.stack, 'EntityService');
      throw new InternalServerErrorException('Error al guardar la entidad');
    }
  }
}
