import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { BaseRepository } from './base.repository';
import { AwardedQuotaEntity } from '../entities/awarded-quota.entity';
import { ObjectId } from 'mongodb';

@Injectable()
export class AwardedQuotaRepository extends BaseRepository<AwardedQuotaEntity> {
  constructor(
    @InjectRepository(AwardedQuotaEntity)
    private readonly awardedQuotaRepo: MongoRepository<AwardedQuotaEntity>,
  ) {
    super(awardedQuotaRepo);
  }

  async findTopBuyers(campaignId: ObjectId) {
    return this.repository
      .aggregate([
        { $match: { campaignId: new ObjectId(campaignId) } },
        {
          $group: {
            _id: '$buyerName',
            quotaCount: {
              $sum: {
                $ifNull: [
                  '$quotaCount',
                  {
                    $cond: {
                      if: { $and: [{ $ne: ['$quota', null] }, { $gte: [{ $strLenCP: '$quota' }, 9] }] },
                      then: {
                        $size: {
                          $split: [
                            { $ifNull: [ { $substr: ['$quota', 8, { $subtract: [{ $strLenCP: '$quota' }, 9] }] }, "" ] },
                            ', ',
                          ],
                        },
                      },
                      else: 0,
                    },
                  },
                ],
              },
            },
          },
        },
        { $sort: { quotaCount: -1 } },
        { $limit: 3 },
        {
          $project: {
            _id: 0,
            buyerName: '$_id',
            quotaCount: 1,
          },
        },
      ])
      .toArray();
  }
}
