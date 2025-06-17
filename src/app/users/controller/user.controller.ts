import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { UserService } from "../bussines/user.service";
import { UserDto, UpdateUserDto } from "../dto/user.dto";
import { Public } from "../../auth/decorators/public.decorator";

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get()
    async findAll() {
        return this.userService.findAll();
    }

    @Public()
    @Post()
    async save(
        @Body() user: UserDto
    ) {
        return this.userService.save(user);
    }

    @Put(':id')
    async update(
        @Param('id') id: number,
        @Body() user: UpdateUserDto
    ) {
        return this.userService.update(id, user);
    }

    @Delete(':id')
    async delete(
        @Param('id') id: number
    ) {
        return this.userService.delete(id);
    }
}