import {
  CACHE_MANAGER,
  HttpException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { User } from '../user/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepo } from '../user/user.repo';
import { Repository } from 'typeorm';
import { LoginUserDto } from '../user/dto/login-user.dto';
import { Cache } from 'cache-manager';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  constructor(
    @Inject(CACHE_MANAGER) private redisManager: Cache,
    @InjectRepository(UserRepo) private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async autoLogin(email: string, refreshToken: string) {
    if (!email || !refreshToken) {
      throw new HttpException('TOKEN_NULL', 401);
    }
    const data = (await this.redisManager.get(`auth:${email}`)) as any;
    if (!data) {
      throw new HttpException('CANNOT_FIND_SESSION', 401);
    }
    if (data.refresh !== refreshToken || data.email !== email) {
      throw new HttpException('INVALID_AUTHORIZATION', 401);
    }
    const uuid = uuidv4();
    const newRefreshToken = this.jwtService.sign(
      { username: email },
      {
        secret: process.env.JWT_REFRESH_KEY,
        expiresIn: 2592000,
      },
    );
    await this.redisManager.set(
      `auth:${email}`,
      { email: email, uuid: uuid, refresh: newRefreshToken },
      {
        ttl: 0,
      },
    );
    return {
      access_token: this.jwtService.sign(
        { username: email },
        {
          secret: process.env.JWT_SECRET_KEY,
          expiresIn: 3600,
        },
      ),
      refresh_token: newRefreshToken,
      uuid: uuid,
      email: email,
    };
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.usersRepository.findOne({
      where: { id: email },
    });
    if (!user || user.pw !== password) return null;
    return user; // select * from user where id = user.id;
  }

  async refreshToken(email: string) {
    return {
      access_token: this.jwtService.sign(
        { username: email },
        {
          secret: process.env.JWT_SECRET_KEY,
          expiresIn: 3600,
        },
      ),
    };
  }

  async login(user: LoginUserDto) {
    const payload = { username: user.email };
    const uuid = uuidv4();
    const refreshToken = this.jwtService.sign(
      { payload },
      {
        secret: process.env.JWT_REFRESH_KEY,
        expiresIn: 2592000,
      },
    );
    await this.redisManager.set(
      `auth:${user.email}`,
      { email: user.email, uuid: uuid, refresh: refreshToken },
      {
        ttl: 0,
      },
    );
    return {
      access_token: this.jwtService.sign(payload, {
        secret: process.env.JWT_SECRET_KEY,
        expiresIn: 3600,
      }),
      refresh_token: refreshToken,
      uuid: uuid,
      email: user.email,
    };
  }
}
