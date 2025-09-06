import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ObjectId } from 'mongodb';
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

  async getById(_id: ObjectId) {
    return await this.campaignRepo.findOneOrFail({
      where: { _id: new ObjectId(_id) },
    });
  }

  async getUserCampaigns(userId: ObjectId) {
    return await this.campaignRepo.find({
      where: { userId: userId },
    });
  }
}
