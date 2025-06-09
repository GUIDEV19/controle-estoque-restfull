import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { databaseProviders } from './config/database.provider';
import { EntityModule } from './entitys/entity.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    EntityModule,
  ],
  controllers: [],
  providers: [
    ...databaseProviders
  ],
})
export class AppModule {}
