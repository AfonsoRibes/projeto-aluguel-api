import { ObjectId } from 'mongodb';
import { Column, Entity, ManyToOne, ObjectIdColumn } from 'typeorm';
import { CampaignEntity } from './campaign.entity';

@Entity()
export class CampaignPrizeEntity {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column({ type: 'string', name: 'name' })
  name: string;

  @ManyToOne(() => CampaignEntity, (campaign) => campaign.campaignPrizes)
  campaigns: CampaignEntity;
}
