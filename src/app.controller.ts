import { Controller, Get, Post, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Request, Response } from 'express';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from './feature/user/entities/user.entity';

@Controller('/')
@ApiTags('Root API')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/get-csrf')
  @ApiOperation({
    summary: 'csrf 관련 핸들러',
    description:
      '항상 root 에들어올때 불러서 해당 XSRF-TOKEN 쿠키값을 request header에 x-csrf-token 의 값으로 넣어준다',
  })
  @ApiCreatedResponse({ description: 'csrf 토큰생성', type: String })
  getHello(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): any {
    res.cookie('XSRF-TOKEN', req.csrfToken());
    return { message: 'Success' };
  }

  @Post('/')
  @ApiOperation({
    summary: 'csrf 테스트용',
    description: '테스트용',
  })
  @ApiCreatedResponse({ description: 'csrf 토큰 테스트용', type: String })
  postHello(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): string {
    return 'CSRF COMPLETE';
  }
}
