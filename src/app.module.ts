import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { databaseProviders } from './config/database.provider';
import { EntityModule } from './app/entitys/entity.module';
import { CommonModule } from './common/common.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CommonModule,
    EntityModule,
  ],
  controllers: [],
  providers: [
    ...databaseProviders
  ],
})
export class AppModule {}
