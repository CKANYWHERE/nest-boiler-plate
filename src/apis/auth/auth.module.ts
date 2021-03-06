import { CacheModule, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local-auth/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepo } from '../user/user.repo';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt/jwt.strategy';
import * as redisStore from 'cache-manager-ioredis';
import { DateModule } from '../../common/date/date.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserRepo]),
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY,
      signOptions: { expiresIn: 3600 },
    }),
    CacheModule.register({
      store: redisStore,
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
    }),
    DateModule,
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  controllers: [AuthController],
  exports: [JwtModule],
})
export class AuthModule {}
