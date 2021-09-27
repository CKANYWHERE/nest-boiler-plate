import {
  Injectable,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class RefreshAuthGuard extends AuthGuard('jwt-refresh-token') {
  constructor(private jwtService: JwtService) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    const { refresh_token } = request.body;
    request.user = this.validateToken(refresh_token);
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
