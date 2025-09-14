import { ObjectId } from 'mongodb';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { PaymentDueDateEnum } from '../../shared/enums/payment-due-date.enum';
import { RafflePlatformEnum } from '../../shared/enums/raffe-plataform.enum';
import { RaffleSelectionTypeEnum } from '../../shared/enums/reffle-selection-type.enum';
import { AbstractEntity } from './abstract.entity';
import { AwardedQuotaEntity } from './awarded-quota.entity';
import { CampaignPrizeEntity } from './campaign-prize.entity';
import { UserEntity } from './user.entity';

@Entity('campaign')
export class CampaignEntity extends AbstractEntity {
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

  @Column({ type: 'string', nullable: true })
  contactPhone?: string;

  @Column({ type: 'number', nullable: true })
  minQuota?: number;

  @Column({ type: 'number', nullable: true })
  maxQuota?: number;

  @Column({ type: 'date', nullable: true })
  releaseDate?: Date;

  @Column({
    type: 'enum',
    enum: PaymentDueDateEnum,
  })
  PaymentDueDate: PaymentDueDateEnum;

  @Column({ type: 'boolean', default: 'false' })
  paid: boolean;

  @Column({ type: 'boolean' })
  showTopThree: boolean;

  @Column({ type: 'boolean' })
  randomQuotas: boolean;

  @Column({ type: 'string', nullable: true })
  reservationEmail: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @Column()
  userId: ObjectId;

  @OneToMany(() => AwardedQuotaEntity, (awarded) => awarded.campaigns)
  awardedQuotas: AwardedQuotaEntity[];

  @OneToMany(
    () => CampaignPrizeEntity,
    (campaignPrize) => campaignPrize.campaigns,
  )
  campaignPrizes: CampaignPrizeEntity[];

  @Column({ type: 'boolean', default: false })
  isPromotionActive: boolean;

  @Column({ type: 'string', nullable: true })
  promotionText?: string;

  @Column({ type: 'number', nullable: true })
  discountPercentage?: number;
}
