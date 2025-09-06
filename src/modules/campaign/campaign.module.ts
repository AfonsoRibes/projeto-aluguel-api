import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CampaignEntity } from '../../database/entities/campaign.entity';
import { CampaignController } from './campaign.controller';
import { CampaignService } from './campaign.service';
import { CampaignRepository } from '../../database/repositories/campaign.repository';
import { MongoRepository } from 'typeorm';
import { UserEntity } from '../../database/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CampaignEntity, UserEntity])],
  controllers: [CampaignController],
  providers: [CampaignService, CampaignRepository, MongoRepository],
  exports: [CampaignService],
})
export class CampaignModule {}
