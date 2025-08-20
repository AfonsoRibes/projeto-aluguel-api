import { ObjectId } from 'mongodb';
import { CreateDateColumn, ObjectIdColumn, UpdateDateColumn } from 'typeorm';

export abstract class AbstractEntity {
  @ObjectIdColumn()
  _id: ObjectId;

  @CreateDateColumn({ type: 'date' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'date' })
  updatedAt: Date;
}
