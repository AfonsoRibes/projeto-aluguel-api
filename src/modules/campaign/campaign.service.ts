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
    const campaigns = await this.campaignRepository.getUserCampaigns(userId);

    const enrichedCampaigns = await Promise.all(
      campaigns.map(async (campaign) => {
        const awardedQuotas = await this.awardedQuotaRepository.find({
          campaignId: campaign._id, // Use campaignId directly as confirmed earlier
        });

        const soldTickets = awardedQuotas.reduce(
          (totalSold, awardedQuota) => {
            // Assuming awardedQuota.quota is a string like "(quota: 1, 2, 3)"
            const matches = awardedQuota.quota.match(/\d+/g); // Extract all numbers from the string
            if (matches) {
              // Count the number of individual quotas
              return totalSold + matches.length;
            }
            return totalSold;
          },
          0,
        );

        const collectedAmount = awardedQuotas.reduce(
          (sum, awardedQuota) => {
            // Assuming each awarded quota contributes its campaign's ticketValue
            // If a single awardedQuota can represent multiple actual quotas,
            // and each quota has a value of campaign.ticketValue, then we need to multiply.
            const matches = awardedQuota.quota.match(/\d+/g); // Extract all numbers from the string
            if (matches) {
              const numberOfIndividualQuotas = matches.length;
              return sum + (numberOfIndividualQuotas * campaign.ticketValue);
            }
            return sum;
          },
          0,
        );

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
      campaignId: campaignId,
    });
  }
}
