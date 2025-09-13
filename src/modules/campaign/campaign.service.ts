import { Injectable } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { DeepPartial } from 'typeorm';
import { AwardedQuotaEntity } from '../../database/entities/awarded-quota.entity';
import { CampaignEntity } from '../../database/entities/campaign.entity';
import { AwardedQuotaRepository } from '../../database/repositories/awarded-quotas.repository';
import { CampaignRepository } from '../../database/repositories/campaign.repository';
import { CreateCampaignDto } from './dto/create-campaign.dto';

@Injectable()
export class CampaignService {
  constructor(
    private readonly campaignRepository: CampaignRepository,
    private readonly awardedQuotaRepository: AwardedQuotaRepository,
  ) {}

  async payCampaign(_id: ObjectId, buyerName: string, selectedQuotas: string[]) {
    const campaign = await this.campaignRepository.findOneOrFail(
      {
        where: { _id },
      },
      'Campanha não encontrada',
    );

    const awardedQuota = await this.awardedQuotaRepository.create({
      quota: `(quota: ${selectedQuotas.join(', ')})`, // Join the selected quotas into a string
      prize: 'Default Prize', // Placeholder
      buyerName: buyerName,
      campaigns: campaign, // Associate with the campaign
    });

    return await this.campaignRepository.update(_id, { paid: true });
  }

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
    await this.campaignRepository.findOneOrFail(
      {
        where: { _id, userId },
      },
      'Campanha não encontrada',
    );
    return this.campaignRepository.delete(_id);
  }

    async getAwardedQuotasByCampaignId(campaignId: ObjectId): Promise<AwardedQuotaEntity[]> {
    return this.awardedQuotaRepository.find({
      where: { 'campaigns._id': campaignId },
    });
  }
}
