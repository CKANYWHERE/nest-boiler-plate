import {
  Injectable,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Inject,
  CACHE_MANAGER,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import { Cache } from 'cache-manager';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class RefreshAuthGuard extends AuthGuard('jwt-refresh-token') {
  constructor(
    private jwtService: JwtService,
    @Inject(CACHE_MANAGER) private redisManager: Cache,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    if (!request.cookies._u_session || !request.cookies._trx_id) {
      throw new HttpException('SESSION_NULL', 401);
    }
    const { _u_session } = request.cookies;
    const data = (await this.redisManager.get(`auth:${_u_session}`)) as any;
    if (request.cookies._trx_id !== data.uuid) {
      throw new HttpException('INVALID_SESSION', 401);
    }
    delete data.uuid;
    const uuid = uuidv4();
    const newSession = { ...data, uuid: uuid };
    await this.redisManager.set(`auth:${_u_session}`, newSession, {
      ttl: 0,
    });
    request.body.trx_id = uuid;
    request.user = this.validateToken(data.refresh);
    return true;
  }

  validateToken(token: string) {
    const secretKey = process.env.JWT_REFRESH_KEY;

    try {
      const verify = this.jwtService.verify(token, { secret: secretKey });
      return verify;
    } catch (e) {
      console.log(e);
      switch (e.message) {
        // 토큰에 대한 오류를 판단합니다.
        case 'invalid token':
        case 'jwt malformed':
        case 'invalid signature':
        case 'no user':
          throw new HttpException('INVALID_TOKEN', 401);

        case 'jwt expired':
          throw new HttpException('TOKEN_EXPIRED', 410);

        default:
          throw new HttpException('SERVER_ERR', 500);
      }
    }
  }
}
