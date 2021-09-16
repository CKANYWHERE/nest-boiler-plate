import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { compare } from 'bcrypt';
import { User } from '../user/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepo } from '../user/user.repo';
import { Repository } from 'typeorm';
import { LoginUserDto } from '../user/dto/login-user.dto';

@Injectable()
export class AuthService {
  constructor(
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

  async login(user: LoginUserDto) {
    const payload = { username: user.email };
    return { access_token: this.jwtService.sign(payload) };
  }
}
