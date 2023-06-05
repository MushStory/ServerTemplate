import {WinstonModule, utilities as nestWinstonModuleUtilities} from 'nest-winston';
import {Injectable, LoggerService} from '@nestjs/common';
import * as winston from 'winston';
import {ConfigService} from '@nestjs/config';
const S3StreamLogger = require('s3-streamlogger').S3StreamLogger;

@Injectable()
export class WinstonLoggerService {
  constructor(private readonly configService: ConfigService) {}

  getWinstonModuleSetting(): LoggerService {
    // 로그 레벨 설정
    const level = process.env.NODE_ENV === 'prod' ? 'info' : 'silly';

    // 출력 포맷 설정
    const format = winston.format.combine(
      winston.format.timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
      winston.format.printf(
        info => `[${info.timestamp}] ${this.configService.get('APP_NAME')} ${info.level} ${info.message}`,
      ),
    );

    // S3 스트림 생성
    const s3Stream = new winston.transports.Stream({
      stream: new S3StreamLogger({
        bucket: this.configService.get('S3_BUCKET_NAME'),
        folder: this.configService.get('S3_BUCKET_LOG_FOLDER_NAME'),
        access_key_id: this.configService.get('IAM_ACCESS_KEY_ID'),
        secret_access_key: this.configService.get('IAM_ACCESS_KEY_SECRET'),
      }),
      level: level,
      format: format,
    });

    // 콘솔 스트림 생성
    const consoleStream = new winston.transports.Console({
      level: level,
      format: winston.format.combine(
        nestWinstonModuleUtilities.format.nestLike(this.configService.get('APP_NAME'), {prettyPrint: true}),
      ),
    });

    // Winston logger 반환
    return WinstonModule.createLogger({
      transports: [s3Stream, consoleStream],
    });
  }
}
