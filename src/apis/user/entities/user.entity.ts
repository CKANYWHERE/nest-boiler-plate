import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class User extends BaseEntity {
  @PrimaryColumn({ name: 'id' })
  @ApiProperty({ description: 'id' })
  id: string;

  @Column({ name: 'pw' })
  @ApiProperty({ description: '비밀번호' })
  pw: string;

  @Column({ name: 'name' })
  @ApiProperty({ description: '이름' })
  name: string;

  @Column({ name: 'useYN' })
  @ApiProperty({ description: '사용여부' })
  useYN: string;

  @CreateDateColumn({ name: 'registerDate', type: Date })
  @ApiProperty({ description: '등록일자' })
  regDate: Date;
}
