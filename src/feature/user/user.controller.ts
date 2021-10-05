import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Version,
  UseGuards,
  Req,
  Inject,
  CACHE_MANAGER,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from './entities/user.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request } from 'express';
import { Cache } from 'cache-manager';

@Controller('user')
@ApiTags('유저 API')
export class UserController {
  constructor(
    private readonly userService: UserService,
    @Inject(CACHE_MANAGER) private redisManager: Cache,
  ) {}

  @Version('1')
  @ApiOperation({ summary: '유저 생성 API', description: '유저를 생성한다.' })
  @ApiCreatedResponse({ description: '유저를 생성한다.', type: User })
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Version('1')
  @Get()
  @ApiOperation({
    summary: '모든 유저 가져오는 API',
    description: '모든 유저를 리턴한다.',
  })
  @UseGuards(JwtAuthGuard)
  @ApiCreatedResponse({ description: '모든 유저를 리턴한다.', type: [User] })
  async findAll(@Req() req: Request) {
    let userData = await this.redisManager.get(`api:${req.url}`);
    if (!userData) {
      userData = await this.userService.findAll();
      await this.redisManager.set(`api:${req.url}`, userData, { ttl: 86400 });
      return userData;
    }
    return userData;
  }

  @Version('1')
  @Get(':id')
  @ApiOperation({
    summary: '한명의 유저 가져오는 API',
    description: '한명의 유저를 리턴한다.',
  })
  @ApiCreatedResponse({ description: '유저를 리턴한다.', type: User })
  async findOne(@Req() req: Request, @Param('id') id: string) {
    let userData = await this.redisManager.get(`api:${req.url}`);
    if (!userData) {
      userData = await this.userService.findOne(id);
      await this.redisManager.set(`api:${req.url}`, userData, { ttl: 86400 });
      return userData;
    }
    return userData;
  }

  @Version('1')
  @Patch(':id')
  @ApiOperation({
    summary: '유저 update API',
    description: '한명의 유저를 update 한다.',
  })
  @ApiCreatedResponse({ description: '한명의 유저를 update 한다.', type: User })
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return await this.userService.update(id, updateUserDto);
  }

  @Version('1')
  @Delete(':id')
  @ApiOperation({
    summary: '유저 delete API',
    description: '한명의 유저를 삭제 한다.',
  })
  @ApiCreatedResponse({ description: '한명의 유저를 삭제 한다.', type: User })
  async remove(@Param('id') id: string) {
    return await this.userService.remove(id);
  }
}
