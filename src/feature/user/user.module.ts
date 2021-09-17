import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepo } from './user.repo';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserRepo]),
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY ? process.env.JWT_SECRET_KEY : 'dev',
      signOptions: { expiresIn: 30 },
    }),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
