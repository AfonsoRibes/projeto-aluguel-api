import { ObjectId } from 'mongodb';
import { Column, Entity, ObjectIdColumn, OneToMany } from 'typeorm';
import { CampaignEntity } from './campaign.entity';

@Entity()
export class PromotionEntity {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column({ type: 'number', name: 'quantity' })
  quantity: number;

  @Column({ type: 'number', name: 'price' })
  price: number;

  @OneToMany(() => CampaignEntity, (campaign) => campaign.promotion)
  campaigns: CampaignEntity[];
}
