import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { databaseProviders } from './config/database.provider';
import { EntityModule } from './app/entitys/entity.module';
import { CommonModule } from './common/common.module';
import { UserModule } from './app/users/user.module';
import { AuthModule } from './app/auth/auth.module';
import { JwtAuthGuard } from './app/auth/guards/jwt-auth.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CommonModule,
    EntityModule,
    UserModule,
    AuthModule,
  ],
  controllers: [],
  providers: [
    ...databaseProviders,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
