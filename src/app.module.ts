import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {HttpExceptionFilterModule} from './util/httpExceptionFilter/httpExceptionFilter.module';
import {TypeOrmModule, TypeOrmModuleOptions} from '@nestjs/typeorm';
import {AuthModule} from './api/auth/auth.module';
import {WinstonLoggerModule} from './util/logger/winstonLogger.module';
import {ConfigModule} from '@nestjs/config';
import {getDataSourceConfig} from './db/data-source-config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    WinstonLoggerModule,
    TypeOrmModule.forRoot(getDataSourceConfig() as TypeOrmModuleOptions),
    HttpExceptionFilterModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
