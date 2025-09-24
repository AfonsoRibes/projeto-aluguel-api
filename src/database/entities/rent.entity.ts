import { ObjectId } from 'mongodb';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { AbstractEntity } from './abstract.entity';
import { UserEntity } from './user.entity';

@Entity()
export class RentEntity extends AbstractEntity {
  @Column({ type: 'string', name: 'name' })
  name: string;

  @Column({ type: 'string', name: 'address' })
  address: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @Column()
  userId: ObjectId;
}
