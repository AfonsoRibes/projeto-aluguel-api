import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { PromotionEntity } from '../entities/promotion.entity';
import { BaseRepository } from './base.repository';

@Injectable()
export class PromotionRepository extends BaseRepository<PromotionEntity> {
  constructor(
    @InjectRepository(PromotionEntity)
    private readonly promotionRepo: MongoRepository<PromotionEntity>,
  ) {
    super(promotionRepo);
  }
}
