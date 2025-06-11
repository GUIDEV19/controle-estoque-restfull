
import { Module } from '@nestjs/common';
import { entityProviders } from './provider/entity.provider';
import { EntityService } from './bussines/entity.service';
import { DatabaseModule } from 'src/config/database.module';
import { EntityController } from './controller/entity.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [EntityController],
  providers: [
    ...entityProviders,
    EntityService,
  ],
})
export class EntityModule {}
