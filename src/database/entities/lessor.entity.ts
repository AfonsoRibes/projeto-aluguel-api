import { Column, Entity, Index } from 'typeorm';
import { AbstractEntity } from './abstract.entity';

@Entity('lessor')
export class LessorEntity extends AbstractEntity {
  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 150 })
  email: string;

  @Column({ type: 'varchar', length: 100 })
  nationality: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  civilState?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  job?: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  document?: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  registerNumber?: string;

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

  @Column({ type: 'int', nullable: true })
  number: number;
}
