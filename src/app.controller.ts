import { Controller, Get, HttpStatus } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('status')
  getStatus(): { status: number, version: string } {
    return {
      version: process.env.npm_package_version || '0.0.0',
      status: HttpStatus.OK
    };
  }
}
