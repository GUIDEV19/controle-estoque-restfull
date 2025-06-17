import { Module } from '@nestjs/common';
import { userProvider } from './provider/user.provider';
import { UserService } from './bussines/user.service';
import { UserController } from './controller/user.controller';
import { DatabaseModule } from 'src/config/database.module';

@Module({
    imports: [DatabaseModule],
    providers: [
        ...userProvider,
        UserService,
    ],
    controllers: [UserController],
    exports: [UserService],
})
export class UserModule {}