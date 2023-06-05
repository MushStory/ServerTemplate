import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {LoggerService, ValidationPipe} from '@nestjs/common';
import * as compression from 'compression';
import * as bodyParser from 'body-parser';
import {WinstonLoggerService} from './util/logger/winstonLogger.service';
import {ConfigService} from '@nestjs/config';

async function bootstrap() {
  // NestJS 앱 생성
  const app = await NestFactory.create(AppModule, {
    cors: true,
  });

  // configService 가져오기
  const configService = app.get(ConfigService);

  // winston logger 가져오기
  const logger: LoggerService = app.get(WinstonLoggerService).getWinstonModuleSetting();

  // 전역 설정
  app.useLogger(logger);
  app.use(compression());
  app.use(bodyParser.json({limit: configService.get('BODY_PARSER_LIMIT')}));
  app.use(bodyParser.urlencoded({extended: true, limit: configService.get('BODY_PARSER_LIMIT')}));
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
bootstrap();
