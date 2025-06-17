import { DataSource } from 'typeorm';
import { TbUser } from '../domain/user.entity';

export const userProvider = [
    {
        provide: 'USER_REPOSITORY',
        useFactory: (dataSource: DataSource) => dataSource.getRepository(TbUser),
        inject: ['DATA_SOURCE'],
    },
];