import { IsDefined, IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RefreshDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ description: '유저이름' })
  username: string;

  @IsDefined()
  @IsNotEmpty()
  @ApiProperty({ description: '비밀번호' })
  x_transaction_id: string;
}
