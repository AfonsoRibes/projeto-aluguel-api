import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AwardedQuotaEntity } from './entities/awarded-quota.entity';
import { CampaignPrizeEntity } from './entities/campaign-prize.entity';
import { CampaignEntity } from './entities/campaign.entity';
import { PromotionEntity } from './entities/promotion.entity';
import { UserEntity } from './entities/user.entity';
import { AwardedQuotaRepository } from './repositories/awarded-quotas.repository';
import { CampaignRepository } from './repositories/campaign.repository';
import { PromotionRepository } from './repositories/promotion.repository';
import { UserRepository } from './repositories/user.repository';

const entities = [
  UserEntity,
  CampaignEntity,
  AwardedQuotaEntity,
  PromotionEntity,
  CampaignPrizeEntity,
];

const repositories = [
  UserRepository,
  CampaignRepository,
  AwardedQuotaRepository,
  PromotionRepository,
  CampaignRepository,
];

@Module({
  imports: [TypeOrmModule.forFeature(entities)],
  providers: [...repositories],
  exports: [...repositories, TypeOrmModule],
})
export class DatabaseModule {}
