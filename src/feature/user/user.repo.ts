import { Injectable } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
@EntityRepository(User)
export class UserRepo extends Repository<User> {}
