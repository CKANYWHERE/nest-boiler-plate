import { IsDefined, IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AutoLoginDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ description: '유저 아이디' })
  user_id: string;

  @IsDefined()
  @IsNotEmpty()
  @ApiProperty({ description: '사용자 토큰' })
  user_token: string;
}
