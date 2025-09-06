import { Injectable } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { DeepPartial } from 'typeorm';
import { CampaignEntity } from '../../database/entities/campaign.entity';
import { CampaignRepository } from '../../database/repositories/campaign.repository';
import { CreateCampaignDto } from './dto/create-campaign.dto';

@Injectable()
export class CampaignService {
  constructor(private readonly campaignRepository: CampaignRepository) {}

  async getAll() {
    return this.campaignRepository.findAll();
  }

  async getById(id: ObjectId) {
    return this.campaignRepository.getById(id);
  }

  async getUserCampaigns(userId: ObjectId) {
    return this.campaignRepository.getUserCampaigns(userId);
  }

  async create(dto: CreateCampaignDto, userId: ObjectId) {
    return this.campaignRepository.create({
      ...dto,
      userId,
    } as DeepPartial<CampaignEntity>);
  }

  // async findAll() {
  //   return this.campaignRepository.getAll();
  // }

  async delete(userId: ObjectId, _id: ObjectId) {
    const campaign = await this.campaignRepository.findById(_id);
    return this.campaignRepository.delete(_id);
  }
}
