import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PropertyController } from './property.controller';
import { PropertyService } from './property.service';
import { PropertyEntity } from '../../database/entities/property.entity';
import { PagamentosController } from './pagamentos.controller';
import { RentEntity } from '../../database/entities/rent.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PropertyEntity, RentEntity])],
  controllers: [PropertyController, PagamentosController],
  providers: [PropertyService],
  exports: [PropertyService],
})
export class PropertyModule {}
