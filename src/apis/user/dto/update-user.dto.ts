import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsDefined, IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ description: 'id' })
  id: string;

  @IsDefined()
  @IsNotEmpty()
  @ApiProperty({ description: '비밀번호' })
  pw: string;

  @IsDefined()
  @IsNotEmpty()
  @ApiProperty({ description: '이름' })
  name: string;

  @IsDefined()
  @IsNotEmpty()
  @ApiProperty({ description: '사용여부 사용시:Y, 아니면 N' })
  useYN: string;
}
