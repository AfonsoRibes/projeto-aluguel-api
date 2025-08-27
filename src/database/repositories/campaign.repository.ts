import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ObjectId } from 'mongodb';
import { MongoRepository } from 'typeorm';
import { CampaignEntity } from '../entities/campaign.entity';
import { UserEntity } from '../entities/user.entity';
import { BaseRepository } from './base.repository';

@Injectable()
export class CampaignRepository extends BaseRepository<CampaignEntity> {
  constructor(
    @InjectRepository(CampaignEntity)
    private readonly campaignRepo: MongoRepository<CampaignEntity>,

    @InjectRepository(UserEntity)
    private readonly userRepository: MongoRepository<UserEntity>,
  ) {
    super(campaignRepo);
  }

  async getById(_id: ObjectId) {
    const campaign = await this.campaignRepo.findOneOrFail({
      where: { _id: new ObjectId(_id) },
    });

    console.log(campaign);
    return campaign;
  }

  async getUserCampaigns(userId: ObjectId) {
    return this.campaignRepo.find({
      where: { userId: userId },
    });
  }
}
