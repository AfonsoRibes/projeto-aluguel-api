import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm';
import { AbstractEntity } from './abstract.entity';
import { CampaignEntity } from './campaign.entity';
import { ObjectId } from 'mongodb';

@Entity()
export class AwardedQuotaEntity extends AbstractEntity {
  @Column({ type: 'string', name: 'quota' })
  quota: string;

  @Column({ type: 'string', name: 'prize' })
  prize: string;

  @Column({ type: 'string', name: 'buyer_name', nullable: false })
  buyerName: string;

  @Column({ type: 'string', name: 'campaign_id' }) // New column for foreign key
  campaignId: ObjectId; // Type should be ObjectId

    @ManyToOne(() => CampaignEntity, (campaign) => campaign.awardedQuotas)
  @JoinColumn({ name: 'campaign_id' }) // Link to the new column
  campaigns: CampaignEntity;

}