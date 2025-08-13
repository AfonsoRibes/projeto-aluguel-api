import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Campaign } from '../../entities/campaign/campaign.entity';
import { CampaignRepository } from '../../entities/campaign/campaign.repository';
import { CampaignController } from './campaign.controller';
import { CampaignService } from './campaign.service';

@Module({
  imports: [TypeOrmModule.forFeature([Campaign])],
  controllers: [CampaignController],
  providers: [CampaignService, CampaignRepository],
  exports: [CampaignService],
})
export class CampaignModule {}
