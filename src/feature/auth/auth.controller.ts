import {
  Body,
  Controller,
  Get,
  HttpException,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
  Version,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from '../user/dto/login-user.dto';
import { LocalAuthGuard } from './local-auth.guard';
import { RefreshAuthGuard } from './refresh-auth.guard';
import { RefreshDto } from './dto/refresh.dto';
import { Request, Response } from 'express';
import { DateService } from '../../commcon/date/date.service';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from '../user/entities/user.entity';

@Controller('auth')
@ApiTags('인증 API')
export class AuthController {
  constructor(
    private authService: AuthService,
    private dateService: DateService,
  ) {}

  @Post('auto-login')
  @Version('1')
  @ApiOperation({
    summary: '오토 로그인 API',
    description:
      '로그인 성공시 새로운 access-token, refresh-token 을 리턴한다.',
  })
  @ApiCreatedResponse({ description: '성공시 성공 메시지 리턴', type: Object })
  async autoLogin(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { access_token, refresh_token, uuid, email } =
      await this.authService.autoLogin(
        req.cookies._u_session,
        req.cookies._ur_token,
      );
    res.cookie('_ur_token', refresh_token, {
      httpOnly: true,
      expires: this.dateService.calculateRefreshToken(),
    });
    res.cookie('_trx_id', uuid, {
      httpOnly: true,
      expires: this.dateService.calculateRefreshToken(),
    });
    res.cookie('_u_session', email, {
      httpOnly: true,
      expires: this.dateService.calculateRefreshToken(),
    });
    return { access_token: access_token };
  }

  @Version('1')
  @ApiOperation({
    summary: '로그인 API',
    description: '로그인시 csrf, access_token, refresh_token 을 리턴한다.',
  })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiCreatedResponse({ description: '성공시 성공 메시지 리턴', type: Object })
  async login(
    @Body() loginDto: LoginUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { access_token, refresh_token, uuid, email } =
      await this.authService.login(loginDto);
    res.cookie('_ur_token', refresh_token, {
      httpOnly: true,
      expires: this.dateService.calculateRefreshToken(),
    });
    res.cookie('_trx_id', uuid, {
      httpOnly: true,
      expires: this.dateService.calculateRefreshToken(),
    });
    res.cookie('_u_session', email, {
      httpOnly: true,
      expires: this.dateService.calculateRefreshToken(),
    });
    return { access_token: access_token };
  }

  @UseGuards(RefreshAuthGuard)
  @Patch('refresh')
  @Version('1')
  @ApiOperation({
    summary: '리프레시 토큰 API',
    description: '쿠키에 담겨 새로운 access_token 과 _trx_id를 리턴한다.',
  })
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    if (!req.cookies._u_session) {
      throw new HttpException('INVALID_SESSION', 401);
    }
    res.cookie('_trx_id', req.body.trx_id, {
      httpOnly: true,
    });
    return await this.authService.refreshToken(req.cookies._u_session);
  }
}
