import { Exclude } from 'class-transformer';
import { Column, Entity, Index } from 'typeorm';
import { AbstractEntity } from './abstract.entity';

@Entity()
export class LessorEntity extends AbstractEntity {
  @Column()
  name: string;

  @Index({ unique: true })
  @Column()
  email: string;

  @Exclude()
  @Column()
  nationality: string;

  @Column({ nullable: true })
  civilState?: string;

  @Column({ nullable: true })
  job?: string;

  @Column({ nullable: true })
  document: string;

  @Column({ nullable: true })
  registerNumber: string;

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
}
