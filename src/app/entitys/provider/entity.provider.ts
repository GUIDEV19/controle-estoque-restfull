
import { DataSource } from 'typeorm';
import { TbEntity } from '../domain/entity.entity';

export const entityProviders = [
  {
    provide: 'ENTITY_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(TbEntity),
    inject: ['DATA_SOURCE'],
  },
];
