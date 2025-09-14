import { ObjectId } from 'mongodb';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { AbstractEntity } from './abstract.entity';
import { CampaignEntity } from './campaign.entity';

@Entity()
export class AwardedQuotaEntity extends AbstractEntity {
  @Column({ type: 'string', name: 'quota' })
  quota: string;

  @Column({ type: 'string', name: 'prize' })
  prize: string;

  @Column({ type: 'string', name: 'buyer_name', nullable: false })
  buyerName: string;

  @Column({ type: 'string', name: 'campaign_id' })
  campaignId: ObjectId;

  @ManyToOne(() => CampaignEntity, (campaign) => campaign.awardedQuotas)
  @JoinColumn({ name: 'campaign_id' })
  campaigns: CampaignEntity;
}
