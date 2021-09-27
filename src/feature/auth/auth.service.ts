import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { compare } from 'bcrypt';
import { User } from '../user/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepo } from '../user/user.repo';
import { Repository } from 'typeorm';
import { LoginUserDto } from '../user/dto/login-user.dto';
import { RefreshDto } from './dto/refresh.dto';
import { Cache } from 'cache-manager';
import { v4 as uuid } from 'uuid';

@Injectable()
export class AuthService {
  constructor(
    @Inject(CACHE_MANAGER) private redisManager: Cache,
    @InjectRepository(UserRepo) private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.usersRepository.findOne({
      where: { id: email },
    });
    if (!user || user.pw !== password) return null;
    return user; // select * from user where id = user.id;
  }

  async refreshToken(refresh: RefreshDto) {
    return {
      access_token: this.jwtService.sign(refresh, {
        secret: process.env.JWT_SECRET_KEY,
        expiresIn: 3600,
      }),
    };
  }

  async login(user: LoginUserDto) {
    const payload = { username: user.email };
    const transactionId = uuid();
    const refreshToken = this.jwtService.sign(
      { ...payload, x_transaction_id: transactionId },
      {
        secret: process.env.JWT_REFRESH_KEY,
        expiresIn: 864000,
      },
    );

    return {
      access_token: this.jwtService.sign(payload, {
        secret: process.env.JWT_SECRET_KEY,
        expiresIn: 3600,
      }),
      refresh_token: refreshToken,
    };
  }
}
