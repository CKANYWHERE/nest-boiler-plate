import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { LogService } from '../common/log/log.service';
import { Request, Response } from 'express';
import { DateService } from '../common/date/date.service';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(
    private readonly logService: LogService,
    private readonly dateService: DateService,
  ) {}
  async catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    await this.logService.createErrorLog(
      request.body,
      request.headers,
      request.url,
      request.method,
      exception,
      request.cookies._u_session,
    );

    response.status(status).json({
      statusCode: status,
      timestamp: await this.dateService.getCurrentDate(),
      path: request.url,
    });
  }
}
