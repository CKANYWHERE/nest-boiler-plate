import { IsDefined, IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ description: 'id' })
  email: string;

  @IsDefined()
  @IsNotEmpty()
  @ApiProperty({ description: '비밀번호' })
  password: string;
}
