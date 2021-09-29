import {
  Body,
  Controller,
  HttpException,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from '../user/dto/login-user.dto';
import { LocalAuthGuard } from './local-auth.guard';
import { RefreshAuthGuard } from './refresh-auth.guard';
import { RefreshDto } from './dto/refresh.dto';
import { Request, Response } from 'express';
import { DateService } from '../../commcon/date/date.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private dateService: DateService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
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
