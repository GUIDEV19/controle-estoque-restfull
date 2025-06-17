import { BadRequestException, Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { TbUser } from '../domain/user.entity';
import { UserDto, UpdateUserDto } from '../dto/user.dto';
import { CustomLoggerService } from 'src/common/services/logger.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
    constructor(
        @Inject('USER_REPOSITORY')
        private userRepository: Repository<TbUser>,
        private readonly logger: CustomLoggerService,
    ) {}

    async findAll(): Promise<TbUser[]> {
        try {
            const users = await this.userRepository.find();
            if (users.length === 0) {
                throw new NotFoundException('Users not found');
            }
            return users;
        } catch (error) {
            if (error instanceof NotFoundException) {
                this.logger.warn('Users not found error', 'UserService');
                throw error;
            }
            this.logger.error('Error fetching users', 'UserService');
            throw new InternalServerErrorException('Error fetching users');
        }
    }

    async findByEmail(email: string): Promise<TbUser | any> {
        try {
            const user = await this.userRepository.findOne({ where: { email } });
            if (!user) {
                throw new NotFoundException('User not found');
            }
            return user;
        } catch (error) {
            if (error instanceof NotFoundException) {
                this.logger.warn('User not found error', 'UserService');
                throw error;
            }
            this.logger.error('Error fetching user', error.stack, 'UserService');
            throw new InternalServerErrorException('Error fetching user');
        }
    }

    async findOne(id: number): Promise<TbUser | any> {
        try {
            const user = await this.userRepository.findOne({ where: { id } });
            if (!user) {
                throw new NotFoundException('User not found');
            }
            return user;
        } catch (error) {
            if (error instanceof NotFoundException) {
                this.logger.warn('User not found error', 'UserService');
                throw error;
            }
            this.logger.error('Error fetching user', error.stack, 'UserService');
            throw new InternalServerErrorException('Error fetching user');
        }
    }

    async save(user: UserDto): Promise<TbUser> {
        try {
            const userExists = await this.userRepository.findOne({ where: { email: user.email } });
            if (userExists) {
                throw new BadRequestException('User already exists');
            }

            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(user.password, saltRounds);

            const newUser = this.userRepository.create({
                ...user,
                password: hashedPassword
            });
            
            if (!newUser) {
                throw new BadRequestException('User not created');
            }

            return this.userRepository.save(newUser);
        } catch (error) {
            if (error instanceof BadRequestException) {
                this.logger.warn('User already exists error', 'UserService');
                throw error;
            }
            this.logger.error('Error saving user', error.stack, 'UserService');
            throw new InternalServerErrorException('Error saving user');
        }
    }

    async update(id: number, user: UpdateUserDto): Promise<TbUser> {
        try {
            const userExists = await this.userRepository.findOne({ where: { id } });
            if (!userExists) {
                throw new NotFoundException('User not found');
            }

            let hashedPassword = userExists.password;
            if (user.password && user.password !== userExists.password) {
                const saltRounds = 10;
                hashedPassword = await bcrypt.hash(user.password, saltRounds);
            }

            const updatedUser = this.userRepository.create({
                ...userExists,
                ...user,
                password: hashedPassword
            });
            
            if (!updatedUser) {
                throw new BadRequestException('User not updated');
            }

            return this.userRepository.save(updatedUser);
        } catch (error) {
            if (error instanceof NotFoundException || error instanceof BadRequestException) {
                this.logger.warn('User not found or user not updated error', 'UserService');
                throw error;
            }
            this.logger.error('Error updating user', error.stack, 'UserService');
            throw new InternalServerErrorException('Error updating user');
        }
    }

    async delete(id: number): Promise<void> {
        try {
            const userExists = await this.userRepository.findOne({ where: { id } });
            if (!userExists) {
                throw new NotFoundException('User not found');
            }

            await this.userRepository.softDelete(id);
        } catch (error) {
            if (error instanceof NotFoundException) {
                this.logger.warn('User not found error', 'UserService');
                throw error;
            }
            this.logger.error('Error deleting user', error.stack, 'UserService');
            throw new InternalServerErrorException('Error deleting user');
        }
    }
}