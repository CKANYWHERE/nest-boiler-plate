import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepo } from './user.repo';

@Injectable()
export class UserService {
  constructor(private userRepo: UserRepo) {}

  async create(createUserDto: CreateUserDto) {
    return await this.userRepo.save(createUserDto);
  }

  async findAll() {
    return await this.userRepo.find();
  }

  async findOne(id: string) {
    return await this.userRepo.findOne({ id: id });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    return await this.userRepo.update(
      { id: id },
      {
        useYN: updateUserDto.useYN,
        name: updateUserDto.name,
        pw: updateUserDto.pw,
      },
    );
  }

  async remove(id: string) {
    return await this.userRepo.delete({ id: id });
  }
}
