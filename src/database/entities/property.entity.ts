import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { AbstractEntity } from './abstract.entity';
import { UserEntity } from './user.entity';

@Entity('property')
export class PropertyEntity extends AbstractEntity {
  @Column({ type: 'varchar', length: 150 })
  name: string;

  @Column({ type: 'varchar', length: 10 })
  cep: string;

  @Column({ type: 'varchar', length: 255 })
  address: string;

  @Column({ type: 'varchar', length: 100 })
  neighborhood: string;

  @Column({ type: 'varchar', length: 50 })
  state: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  complement: string;

  @Column({ type: 'int' })
  number: number;

  @Column({ type: 'varchar', length: 50 })
  purpose: string;

  @Column({ type: 'varchar', length: 50 })
  guarantee: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  rentPrice: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  condominiumPrice: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  propertyTax: number;

  @Column({ type: 'date' })
  initialContractDate: Date;

  @Column({ type: 'date' })
  finalContractDate: Date;

  @Column({ type: 'date', nullable: true })
  finalDate?: Date;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @Column()
  userId: number;
}
