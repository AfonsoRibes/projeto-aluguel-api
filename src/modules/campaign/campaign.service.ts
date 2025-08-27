import { Injectable } from '@nestjs/common';
import { DeepPartial } from 'typeorm';
import { CampaignEntity } from '../../entities/campaign.entity';
import { CampaignRepository } from '../../repositories/campaign.repository';
import { CreateCampaignDto } from './dto/create-campaign.dto';

@Injectable()
export class CampaignService {
  constructor(private readonly campaignRepository: CampaignRepository) {}

  async getAll() {
    return this.campaignRepository.findAll();
  }

  // async getUserCampaigns(userId: ObjectId) {
  //   console.log(userId);

  //   return this.campaignRepository.getUserCampaigns(userId);
  // }

  async create(dto: CreateCampaignDto) {
    return this.campaignRepository.create({
      ...dto,
    } as DeepPartial<CampaignEntity>);
  }

  // async findAll() {
  //   return this.campaignRepository.getAll();
  // }

  async delete(id: string) {
    return this.campaignRepository.delete(id);
  }
}
