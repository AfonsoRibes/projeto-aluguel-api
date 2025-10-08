import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PropertyEntity } from '../../database/entities/property.entity';

@Injectable()
export class PropertyService {
  constructor(
    @InjectRepository(PropertyEntity)
    private readonly propertyRepository: Repository<PropertyEntity>,
  ) {}

  async buscar() {
    return this.propertyRepository.find();
  }

  async criar(data: Partial<PropertyEntity>) {
    const property = this.propertyRepository.create(data);
    return this.propertyRepository.save(property);
  }
}
