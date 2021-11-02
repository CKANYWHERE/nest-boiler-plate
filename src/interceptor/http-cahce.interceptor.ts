import { CacheInterceptor, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class HttpCacheInterceptor extends CacheInterceptor {
  trackBy(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request>();
    return `api:${request.url}`;
  }
}
