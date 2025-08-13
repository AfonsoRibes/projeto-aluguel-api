import { ObjectId } from 'mongodb';
import { Column, Entity, ObjectIdColumn, OneToMany } from 'typeorm';
import { CampaignEntity } from './campaign.entity';

@Entity()
export class CampaignPrizeEntity {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column({ type: 'string', name: 'name' })
  name: string;

  @OneToMany(() => CampaignEntity, (campaign) => campaign.campaignPrize)
  campaigns: CampaignEntity[];
}
