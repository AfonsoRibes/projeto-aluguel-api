import { Injectable } from '@nestjs/common';
import { CampaignRepository } from '../entities/campaign/campaign.repository';
import { CreateCampaignDto } from './dto/register.dto';

@Injectable()
export class CampaignService {
  constructor(private readonly campaignRepository: CampaignRepository) {}

  async create(dto: CreateCampaignDto) {
    return this.campaignRepository.create(dto);
  }

  async findAll() {
    return this.campaignRepository.getAll();
  }

  async delete(id: string) {
    return this.campaignRepository.delete(id);
  }
}
