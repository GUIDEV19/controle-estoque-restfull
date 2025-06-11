import { Body, Controller, Get, Options, Post, Res, UseInterceptors } from '@nestjs/common';
import { JsonToHalInterceptor } from '../../../interceptors/json-to-hal.interceptor';
import { EntityService } from '../bussines/entity.service';
import { Response } from 'express';
import { EntityDto } from '../dto/entity.dto';

@Controller('entities')
@UseInterceptors(JsonToHalInterceptor)
export class EntityController {

  constructor(private readonly entityService: EntityService) {}

  @Options()
  options(@Res() response: Response) {
    response.set({
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
    });
    return response.status(200).json({
      allow: ['GET', 'OPTIONS'],
    });
  }

  @Get()
  async findAll() {
    return this.entityService.findAll();
  }

  @Post()
  async save(
    @Body() entity: EntityDto
  ) {
    return this.entityService.save(entity);
  }
}
