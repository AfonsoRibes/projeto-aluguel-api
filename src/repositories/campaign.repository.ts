import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { CampaignEntity } from '../entities/campaign.entity';
import { BaseRepository } from './base.repository';

@Injectable()
export class CampaignRepository extends BaseRepository<CampaignEntity> {
  constructor(
    @InjectRepository(CampaignEntity)
    private readonly campaignRepo: MongoRepository<CampaignEntity>,
  ) {
    super(campaignRepo);
  }
}
