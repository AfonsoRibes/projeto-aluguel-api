import { ObjectId } from 'mongodb';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { AbstractEntity } from './abstract.entity';
import { UserEntity } from './user.entity';

@Entity()
export class PropertyEntity extends AbstractEntity {
  @Column({ type: 'string', name: 'name' })
  name: string;

  @Column({ type: 'string', name: 'cep' })
  cep: string;

  @Column({ type: 'string', name: 'address' })
  address: string;

  @Column({ type: 'string', name: 'neighborhood' })
  neighborhood: string;

  @Column({ type: 'string', name: 'state' })
  state: string;

  @Column({ type: 'string', name: 'complement' })
  complement: string;

  @Column({ type: 'number', name: 'number' })
  number: number;

  //comercial/residencial
  @Column({ type: 'string', name: 'purpose' })
  purpose: string;

  @Column({ type: 'string', name: 'guarantee' })
  guarantee: string;

  @Column({ type: 'number', name: 'rentPrice' })
  rentPrice: number;

  @Column({ type: 'number', name: 'condominiumPrice' })
  condominiumPrice: number;

  @Column({ type: 'number', name: 'propertyTax' })
  propertyTax: number;

  @Column({ type: 'date', name: 'initialContractDate' })
  initialContractDate: Date;

  @Column({ type: 'date', name: 'finalContractDate' })
  finalContractDate: Date;

  @Column({ type: 'date', name: 'finalDate', nullable: true })
  finalDate: Date;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @Column()
  userId: ObjectId;
}
