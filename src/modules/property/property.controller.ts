import { Controller, Get, Post, Body } from '@nestjs/common';
import { PropertyService } from './property.service';
import { PropertyEntity } from '../../database/entities/property.entity';

@Controller('imoveis')
export class PropertyController {
  constructor(private readonly propertyService: PropertyService) {}

  @Get('buscar')
  async buscar() {
    return this.propertyService.buscar();
  }

  @Post('add')
  async add(@Body() data: Partial<PropertyEntity>) {
    return this.propertyService.criar(data);
  }
}
