import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { LogService } from '../common/log/log.service';

@Injectable()
export class LogInterceptor implements NestInterceptor {
  constructor(private readonly logService: LogService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<void> {
    const request = context.switchToHttp().getRequest();
    return next.handle().pipe(
      tap(async () => {
        await this.logService.createApiCallLog(
          request.body,
          request.headers,
          request.url,
          request.method,
          request.cookies._u_session,
        );
      }),
    );
  }
}
