import { Controller, Get, UseGuards } from "@nestjs/common";
import { Public } from "../auth/decorators/public.decorator";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { AuthenticatedUserDto } from "../users/dto/user.dto";
const packageJson = require('../../../package.json');

@Controller('status')
export class StatusController {

    @Public()
    @Get()
    getStatus() {
        return { 
            name: packageJson.name, 
            version: packageJson.version 
        };
    }

    @UseGuards(JwtAuthGuard)
    @Get('user-info')
    getUserInfo(@CurrentUser() user: AuthenticatedUserDto) {
        return {
            message: 'Informações do usuário autenticado',
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        };
    }
}