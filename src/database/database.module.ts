import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PropertyEntity } from './entities/property.entity';
import { UserEntity } from './entities/user.entity';
import { AwardedQuotaRepository } from './repositories/awarded-quotas.repository';
import { CampaignRepository } from './repositories/campaign.repository';
import { PromotionRepository } from './repositories/promotion.repository';
import { UserRepository } from './repositories/user.repository';

const entities = [UserEntity, PropertyEntity];

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
