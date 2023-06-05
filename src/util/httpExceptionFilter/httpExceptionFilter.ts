import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Inject,
  InternalServerErrorException,
  Logger,
  LoggerService,
} from '@nestjs/common';
import {Request, Response} from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(@Inject(Logger) private readonly logger: LoggerService) {}

  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    if (!(exception instanceof HttpException)) {
      exception = new InternalServerErrorException();
    }

    const response = (exception as HttpException).getResponse();

    this.logger.error(
      JSON.stringify({
        timestamp: new Date(),
        url: req.url,
        ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
        query: req.query,
        body: req.body,
        res: response,
      }),
    );

    res.status((exception as HttpException).getStatus()).json(response);
  }
}
