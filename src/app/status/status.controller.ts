import { Controller, Get } from "@nestjs/common";
import { Public } from "../auth/decorators/public.decorator";
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
}