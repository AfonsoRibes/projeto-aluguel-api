import { Exclude } from 'class-transformer';
import { Column, Entity, Index } from 'typeorm';
import { AbstractEntity } from './abstract.entity';

@Entity()
export class UserEntity extends AbstractEntity {
  @Column()
  name: string;

  @Index({ unique: true })
  @Column()
  email: string;

  @Exclude()
  @Column()
  password: string;

  @Column({ nullable: true })
  refreshToken?: string;

  @Column({ nullable: true })
  resetToken?: string;

  @Column({ nullable: true })
  phone?: string;
}
