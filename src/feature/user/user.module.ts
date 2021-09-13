import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepo } from './user.repo';

@Module({
  imports: [TypeOrmModule.forFeature([UserRepo])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
