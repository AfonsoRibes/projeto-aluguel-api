import { ObjectId } from 'mongodb';
import { Column, Entity, ManyToOne, ObjectIdColumn } from 'typeorm';
import { CampaignEntity } from './campaign.entity';

@Entity()
export class AwardedQuotaEntity {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column({ type: 'string', name: 'quota' })
  quota: string;

  @Column({ type: 'string', name: 'prize' })
  prize: string;

  @ManyToOne(() => CampaignEntity, (campaign) => campaign.awardedQuotas)
  campaigns: CampaignEntity;
}
