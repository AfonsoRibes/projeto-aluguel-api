import { Column, Entity, ManyToOne } from 'typeorm';
import { AbstractEntity } from './abstract.entity';
import { CampaignEntity } from './campaign.entity';

@Entity()
export class CampaignPrizeEntity extends AbstractEntity {
  @Column({ type: 'string', name: 'name' })
  name: string;

  @ManyToOne(() => CampaignEntity, (campaign) => campaign.campaignPrizes)
  campaigns: CampaignEntity;
}
