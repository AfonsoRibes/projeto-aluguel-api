import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CampaignEntity } from '../../database/entities/campaign.entity';
import { CampaignController } from './campaign.controller';
import { CampaignService } from './campaign.service';
import { CampaignRepository } from '../../database/repositories/campaign.repository';
import { MongoRepository } from 'typeorm';
import { UserEntity } from '../../database/entities/user.entity';
import { AwardedQuotaEntity } from '../../database/entities/awarded-quota.entity';
import { AwardedQuotaRepository } from '../../database/repositories/awarded-quotas.repository';

@Module({
  imports: [TypeOrmModule.forFeature([CampaignEntity, UserEntity, AwardedQuotaEntity])],
  controllers: [CampaignController],
  providers: [CampaignService, CampaignRepository, AwardedQuotaRepository, MongoRepository],
  exports: [CampaignService],
})
export class CampaignModule {}

