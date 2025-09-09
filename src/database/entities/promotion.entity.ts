import { Column, Entity, ManyToOne } from 'typeorm';
import { AbstractEntity } from './abstract.entity';
import { CampaignEntity } from './campaign.entity';

@Entity()
export class PromotionEntity extends AbstractEntity {
  @Column({ type: 'number', name: 'quantity' })
  quantity: number;

  @Column({ type: 'number', name: 'price' })
  price: number;

  
}
