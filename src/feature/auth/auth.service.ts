import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { compare } from 'bcrypt';
import { User } from '../user/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepo } from '../user/user.repo';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepo) private usersRepository: Repository<User>,
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.usersRepository.findOne({
      where: { email },
    });
    if (!user || (user && user.pw === password)) return null;
    return user; // select * from user where id = user.id;
  }

  async login(user: any) {
    //   const payload = { username: user.username, sub: user.id };
    //   return { access_token: this.jwtService.sign(payload) };
  }
}
