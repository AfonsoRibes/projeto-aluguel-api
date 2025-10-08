import { Controller, Get, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  private imoveis = [
    {
      id: 1,
      name: 'Apartamento Centro',
      address: 'Rua das Flores, 123',
      neighborhood: 'Centro',
      state: 'SP',
      rentPrice: 1500
    },
    {
      id: 2,
      name: 'Casa Jardins',
      address: 'Av. Paulista, 456',
      neighborhood: 'Jardins',
      state: 'SP',
      rentPrice: 2500
    }
  ];

  @Get('imoveis/buscar')
  buscarImoveis() {
    return this.imoveis;
  }

  @Get('auth/details')
  authDetails() {
    return { id: '1', name: 'Usuário Teste', email: 'teste@teste.com' };
  }

  @Post('auth/login')
  login(@Body() body: any) {
    return {
      accessToken: 'fake-token-123',
      refreshToken: 'fake-refresh-123'
    };
  }

  @Post('auth/register')
  register(@Body() body: any) {
    return {
      accessToken: 'fake-token-123',
      refreshToken: 'fake-refresh-123'
    };
  }

  @Get('pagamentos/buscar/todos')
  buscarPagamentos() {
    return [];
  }

  @Get('properties')
  getProperties() {
    return [];
  }

  @Post('imoveis/add')
  addImovel(@Body() body: any) {
    const novoImovel = {
      id: this.imoveis.length + 1,
      name: body.nomePredio || body.name,
      address: `${body.rua || ''}, ${body.bairro || ''} - ${body.cidade || ''}`,
      neighborhood: body.bairro,
      state: body.estado,
      rentPrice: 0
    };
    this.imoveis.push(novoImovel);
    return { message: 'Imóvel cadastrado com sucesso' };
  }

  @Post('imoveis/add/unidade')
  addUnidade(@Body() body: any) {
    return { message: 'Unidade cadastrada com sucesso!' };
  }

  @Post('imoveis/buscar/unidades')
  buscarUnidades(@Body() body: any) {
    return [];
  }
}
