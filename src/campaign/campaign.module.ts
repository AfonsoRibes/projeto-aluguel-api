import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Campaign } from '../entities/campaign/campaign.entity';
import { CampaignController } from './campaign.controller';
import { CampaignService } from './campaign.service';
import { CampaignRepository } from '../entities/campaign/campaign.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Campaign])],
  controllers: [CampaignController],
  providers: [CampaignService, CampaignRepository],
  exports: [CampaignService],
})
export class CampaignModule {}
