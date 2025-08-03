import { ObjectId } from 'mongodb';
import { Column, Entity, Index, ObjectIdColumn } from 'typeorm';

@Entity()
export class UserEntity {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  name: string;

  @Index({ unique: true })
  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  refreshToken?: string;

  @Column({ nullable: true })
  resetToken?: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true })
  instagramProfile?: string;

  @Column({ nullable: true })
  telegramGroup?: string;

  @Column({ nullable: true })
  tiktokProfile?: string;

  @Column({ nullable: true })
  whatsappGroup?: string;

  @Column({ nullable: true })
  youtubeChannel?: string;

  @Column({ nullable: true })
  customDomain?: string;

  @Column({ nullable: true })
  facebookPixel?: string;

  @Column({ nullable: true })
  googleTagManager?: string;
}