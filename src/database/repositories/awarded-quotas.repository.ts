import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { BaseRepository } from './base.repository';
import { AwardedQuotaEntity } from '../entities/awarded-quota.entity';

@Injectable()
export class AwardedQuotaRepository extends BaseRepository<AwardedQuotaEntity> {
  constructor(
    @InjectRepository(AwardedQuotaEntity)
    private readonly awardedQuotaRepo: MongoRepository<AwardedQuotaEntity>,
  ) {
    super(awardedQuotaRepo);
  }
}
