import { Exclude } from 'class-transformer';
import { Column, Entity, Index } from 'typeorm';
import { AbstractEntity } from './abstract.entity';

@Entity('user')
export class UserEntity extends AbstractEntity {
  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 150 })
  email: string;

  @Exclude()
  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  refreshToken?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  resetToken?: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone?: string;
}
