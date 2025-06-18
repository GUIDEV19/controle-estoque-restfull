import { Global, Module } from '@nestjs/common';
import { CustomLoggerService } from './services/logger.service';
import { FormatHalService } from './services/formatHal.service';
import { JsonToHalInterceptor } from '../interceptors/json-to-hal.interceptor';

@Global()
@Module({
  providers: [CustomLoggerService, FormatHalService, JsonToHalInterceptor],
  exports: [CustomLoggerService, FormatHalService, JsonToHalInterceptor],
})
export class CommonModule {} 