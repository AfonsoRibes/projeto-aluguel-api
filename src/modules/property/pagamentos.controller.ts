import { Controller, Get } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RentEntity } from '../../database/entities/rent.entity';

@Controller('pagamentos')
export class PagamentosController {
  constructor(
    @InjectRepository(RentEntity)
    private readonly rentRepository: Repository<RentEntity>,
  ) {}

  @Get('buscar/todos')
  async buscarTodos() {
    // Aqui você pode customizar para retornar os dados que o frontend espera
    const pagamentos = await this.rentRepository.find();
    return pagamentos;
  }
}
