import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ObjectId } from 'mongodb';
import { MongoRepository } from 'typeorm';
import { CampaignEntity } from '../entities/campaign.entity';
import { BaseRepository } from './base.repository';
import { UserRepository } from './user.repository';

@Injectable()
export class CampaignRepository extends BaseRepository<CampaignEntity> {
  constructor(
    @InjectRepository(CampaignEntity)
    private readonly campaignRepo: MongoRepository<CampaignEntity>,
    private readonly userRepository: UserRepository,
  ) {
    super(campaignRepo);
  }

  async getUserCampaigns(userId: ObjectId) {
    const campaigns = await this.campaignRepo.find({
      where: { userId }, // busca pelo ObjectId
    });

    // buscar usuários manualmente
    const userIds = campaigns.map((c) => c.userId);
    const users = await this.userRepository.findByIds(userIds);

    // combinar manualmente
    return campaigns.map((c) => ({
      ...c,
      user: users.find((u) => u._id.equals(c.userId)) || null,
    }));
  }
}
