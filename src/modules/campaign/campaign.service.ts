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

  async payCampaign(
    _id: ObjectId,
    buyerName: string,
    selectedQuotas: string[],
    pricePaid: number,
  ) {
    const campaign = await this.campaignRepository.findOneOrFail(
      {
        where: { _id },
      },
      'Campanha não encontrada',
    );

    const awardedQuota = await this.awardedQuotaRepository.create({
      quota: `(quota: ${selectedQuotas.join(', ')})`,
      prize: 'Default Prize',
      buyerName: buyerName,
      campaigns: campaign,
      campaignId: campaign._id,
      pricePaid,
      quotaCount: selectedQuotas.length,
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
    const campaigns = await this.campaignRepository.getUserCampaigns(userId);

    const enrichedCampaigns = await Promise.all(
      campaigns.map(async (campaign) => {
        const awardedQuotas = await this.awardedQuotaRepository.find({
          campaignId: new ObjectId(campaign._id),
        });

        const soldTickets = awardedQuotas.reduce((totalSold, awardedQuota) => {
          const matches = awardedQuota.quota.match(/\d+/g);
          if (matches) {
            return totalSold + matches.length;
          }
          return totalSold;
        }, 0);

        const collectedAmount = awardedQuotas.reduce((sum, awardedQuota) => {
          return sum + (awardedQuota.pricePaid || 0);
        }, 0);

        return {
          ...campaign,
          soldTickets,
          collectedAmount,
        };
      }),
    );

    return enrichedCampaigns;
  }

  async create(dto: CreateCampaignDto, userId: ObjectId) {
    return this.campaignRepository.create({
      ...dto,
      userId,
    } as DeepPartial<CampaignEntity>);
  }

  async delete(userId: ObjectId, _id: ObjectId) {
    await this.campaignRepository.findOneOrFail(
      {
        where: { _id, userId },
      },
      'Campanha não encontrada',
    );
    return this.campaignRepository.delete(_id);
  }

  async getAwardedQuotasByCampaignId(
    campaignId: ObjectId,
  ): Promise<AwardedQuotaEntity[]> {
    return this.awardedQuotaRepository.find({
      campaignId: campaignId,
    });
  }

  async getTopBuyers(campaignId: ObjectId) {
    return this.awardedQuotaRepository.findTopBuyers(campaignId);
  }
}
