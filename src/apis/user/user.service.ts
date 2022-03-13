import { HttpException, Injectable } from '@nestjs/common';
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
    const user = await this.userRepo.findOne({ id: id });
    if (!user) {
      throw new HttpException('NO_DATA_FOUND', 404);
    }
    return user;
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
