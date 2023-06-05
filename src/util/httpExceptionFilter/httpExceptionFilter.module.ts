import {Module, Logger} from '@nestjs/common';
import {APP_FILTER} from '@nestjs/core';
import {HttpExceptionFilter} from './httpExceptionFilter';

@Module({
  providers: [Logger, {provide: APP_FILTER, useClass: HttpExceptionFilter}],
})
export class HttpExceptionFilterModule {}
