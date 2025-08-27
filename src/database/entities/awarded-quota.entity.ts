import { Column, Entity, ManyToOne } from 'typeorm';
import { AbstractEntity } from './abstract.entity';
import { CampaignEntity } from './campaign.entity';

@Entity()
export class AwardedQuotaEntity extends AbstractEntity {
  @Column({ type: 'string', name: 'quota' })
  quota: string;

  @Column({ type: 'string', name: 'prize' })
  prize: string;

  @ManyToOne(() => CampaignEntity, (campaign) => campaign.awardedQuotas)
  campaigns: CampaignEntity;
}
