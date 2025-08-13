import { ObjectId } from 'mongodb';
import { Date } from 'mongoose';
import { Column, Entity, JoinColumn, ManyToOne, ObjectIdColumn } from 'typeorm';
import { PaymentDueDateEnum } from '../../shared/enums/payment-due-date.enum';
import { RafflePlatformEnum } from '../../shared/enums/raffe-plataform.enum';
import { RaffleSelectionTypeEnum } from '../../shared/enums/reffle-selection-type.enum';
import { UserEntity } from '../user/user.entity';

@Entity()
export class Campaign {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column({ type: 'string' })
  title: string;

  @Column({ type: 'string' })
  description: string;

  @Column({ type: 'number' })
  ticketNumber: number;

  @Column({ type: 'number' })
  ticketValue: number;

  @Column({
    type: 'enum',
    enum: RafflePlatformEnum,
  })
  rafflePlataform: RafflePlatformEnum;

  @Column({
    type: 'enum',
    enum: RaffleSelectionTypeEnum,
  })
  RaffleSelectionType: RaffleSelectionTypeEnum;

  // @Column()
  //anexos

  // @Column()
  // FK Promoções

  @Column({
    type: 'string',
  })
  x: string;

  @Column({ type: 'number', nullable: true })
  quotaLimitPerPerson?: number;

  @Column({ type: 'date', nullable: true })
  releaseDate?: Date;

  @Column({
    type: 'enum',
    enum: PaymentDueDateEnum,
  })
  PaymentDueDate: PaymentDueDateEnum;

  // @Column({})
  // publishTax

  @Column({ type: 'boolean' })
  showTopThree: boolean;

  @Column({ type: 'string', nullable: true })
  reservationEmail: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @Column()
  userId: ObjectId;

  // --- FK Awarded Quotas ---
  @ManyToOne(() => AwardedQuotasEntity)
  @JoinColumn({ name: 'awarded_quotas_id' })
  awardedQuotas: AwardedQuotasEntity;

  @Column()
  awardedQuotasId: ObjectId;

  // --- FK Campaign Prize ---
  @ManyToOne(() => CampaignPrizeEntity)
  @JoinColumn({ name: 'campaign_prize_id' })
  campaignPrize: CampaignPrizeEntity;

  @Column()
  campaignPrizeId: ObjectId;

  // --- FK Promotion ---
  @ManyToOne(() => PromotionEntity)
  @JoinColumn({ name: 'promotion_id' })
  promotion: PromotionEntity;

  @Column()
  promotionId: ObjectId;
}
