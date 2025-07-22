import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { Campaign } from './campaign.entity';

@Injectable()
export class CampaignRepository {
  constructor(
    @InjectRepository(Campaign)
    private readonly campaignRepo: MongoRepository<Campaign>,
  ) {}

  async create(data: Partial<Campaign>): Promise<Campaign> {
    const campaign = this.campaignRepo.create(data);
    return this.campaignRepo.save(campaign);
  }

  async getAll(): Promise<Campaign[]> {
    return this.campaignRepo.find();
  }

  async findById(id: string): Promise<Campaign | null> {
    return this.campaignRepo.findOne({ where: { id } });
  }

  async delete(id: string) {
    const objectId = new (require('mongodb').ObjectId)(id);
    return this.campaignRepo.deleteOne({ _id: objectId });
  }

  async update(id: string, data: Partial<Campaign>): Promise<Campaign | null> {
    const objectId = new (require('mongodb').ObjectId)(id);
    await this.campaignRepo.updateOne({ _id: objectId }, { $set: data });
    return this.campaignRepo.findOne({ where: { _id: objectId } });
  }
}
