import { Controller, Get, Post, Put, Delete, Body, HttpException, HttpStatus, Headers, Param } from '@nestjs/common';
import { AppService } from './app.service';

interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  telefone?: string;
  endereco?: string;
  cep?: string;
  rg?: string;
  cpf?: string;
  banco?: string;
  agencia?: string;
  conta?: string;
  pix?: string;
  deleted: boolean;
}

interface Morador {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  cpf: string;
  rg: string;
  dataNascimento: string;
  dataInicioContrato: string;
  dataFimContrato: string;
  diaVencimento: number;
  unidadeId: number;
  imovelId: number;
}

interface Unidade {
  id: number;
  numeroUnidade: number;
  valorAluguel: number;
  instalacaoAgua?: number;
  instalacaoLuz?: number;
  comodos?: number;
  ocupada: boolean;
  imovelId: number;
  morador?: Morador;
}

interface Imovel {
  id: number;
  name: string;
  address: string;
  neighborhood: string;
  state: string;
  rentPrice: number;
  Unidades: Unidade[];
}

interface Pagamento {
  id: number;
  moradorId: number;
  valor: number;
  dataVencimento: string;
  dataPagamento?: string;
  status: 'pendente' | 'pago' | 'atrasado';
  mes: number;
  ano: number;
}

@Controller()
export class AppController {
  private users: User[] = [
    {
      id: '1',
      email: 'teste@teste.com',
      password: '$2b$10$MTIzNDU2',
      name: 'Usuário Teste',
      telefone: '(11) 99999-9999',
      endereco: 'Rua Teste, 123',
      cep: '01234-567',
      rg: '12.345.678-9',
      cpf: '123.456.789-00',
      banco: 'Banco do Brasil',
      agencia: '1234',
      conta: '12345-6',
      pix: 'teste@teste.com',
      deleted: false
    }
  ];
  
  private tokens = new Map<string, string>();
  private moradores: Morador[] = [];
  private pagamentos: Pagamento[] = [];

  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  private hashPassword(password: string): string {
    return `$2b$10$${Buffer.from(password).toString('base64')}`;
  }

  private verifyPassword(password: string, hash: string): boolean {
    return this.hashPassword(password) === hash;
  }

  private generateToken(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  private imoveis: Imovel[] = [
    {
      id: 1,
      name: 'Apartamento Centro',
      address: 'Rua das Flores, 123',
      neighborhood: 'Centro',
      state: 'SP',
      rentPrice: 1500,
      Unidades: [
        { id: 1, numeroUnidade: 101, valorAluguel: 1500, ocupada: false, imovelId: 1 },
        { id: 2, numeroUnidade: 102, valorAluguel: 1600, ocupada: false, imovelId: 1 }
      ]
    },
    {
      id: 2,
      name: 'Casa Jardins',
      address: 'Av. Paulista, 456',
      neighborhood: 'Jardins',
      state: 'SP',
      rentPrice: 2500,
      Unidades: [
        { id: 3, numeroUnidade: 201, valorAluguel: 2500, ocupada: false, imovelId: 2 },
        { id: 4, numeroUnidade: 202, valorAluguel: 2700, ocupada: false, imovelId: 2 }
      ]
    }
  ];

  @Get('imoveis/buscar')
  buscarImoveis() {
    return this.imoveis;
  }

  @Get('auth/details')
  authDetails(@Headers('authorization') auth?: string) {
    const token = auth?.replace('Bearer ', '');
    if (!token || !this.tokens.has(token)) {
      throw new HttpException('Token inválido', HttpStatus.UNAUTHORIZED);
    }
    
    const userId = this.tokens.get(token);
    const user = this.users.find(u => u.id === userId && !u.deleted);
    
    if (!user) {
      throw new HttpException('Usuário não encontrado', HttpStatus.UNAUTHORIZED);
    }
    
    return { id: user.id, name: user.name, email: user.email };
  }

  @Post('auth/login')
  login(@Body() body: any) {
    const { login, password } = body;
    const user = this.users.find(u => u.email === login && !u.deleted);
    
    if (!user) {
      throw new HttpException('Usuário não encontrado', HttpStatus.UNAUTHORIZED);
    }
    
    if (user.deleted) {
      throw new HttpException('Esta conta foi excluída', HttpStatus.UNAUTHORIZED);
    }
    
    if (!this.verifyPassword(password, user.password)) {
      throw new HttpException('Senha incorreta', HttpStatus.UNAUTHORIZED);
    }
    
    const token = this.generateToken();
    this.tokens.set(token, user.id);
    
    return {
      accessToken: token,
      refreshToken: this.generateToken()
    };
  }

  @Post('auth/register')
  register(@Body() body: any) {
    const { name, email, password } = body;
    
    if (this.users.find(u => u.email === email && !u.deleted)) {
      throw new HttpException('Email já cadastrado', HttpStatus.BAD_REQUEST);
    }
    
    const newUser: User = {
      id: (this.users.length + 1).toString(),
      email,
      password: this.hashPassword(password),
      name,
      deleted: false
    };
    
    this.users.push(newUser);
    
    const token = this.generateToken();
    this.tokens.set(token, newUser.id);
    
    return {
      accessToken: token,
      refreshToken: this.generateToken()
    };
  }

  @Get('pagamentos/buscar/todos')
  buscarPagamentos() {
    return this.pagamentos.map(p => {
      const morador = this.moradores.find(m => m.id === p.moradorId);
      return {
        ...p,
        moradorNome: morador?.nome || 'Morador não encontrado'
      };
    });
  }

  @Post('pagamentos/buscar')
  buscarPagamentosMorador(@Body() body: any) {
    const { moradorId } = body;
    return this.pagamentos.filter(p => p.moradorId === moradorId);
  }

  @Put('pagamentos/registrar')
  registrarPagamento(@Body() body: any) {
    const { pagamentoId, dataPagamento } = body;
    const pagamento = this.pagamentos.find(p => p.id === pagamentoId);
    
    if (!pagamento) {
      throw new HttpException('Pagamento não encontrado', HttpStatus.NOT_FOUND);
    }
    
    pagamento.dataPagamento = dataPagamento;
    pagamento.status = 'pago';
    
    return { message: 'Pagamento registrado com sucesso!' };
  }

  @Post('imoveis/deletar/morador')
  deletarMorador(@Body() body: any) {
    const { moradorId, unidadeId } = body;
    
    const moradorIndex = this.moradores.findIndex(m => m.id === moradorId);
    if (moradorIndex === -1) {
      throw new HttpException('Morador não encontrado', HttpStatus.NOT_FOUND);
    }
    
    this.moradores.splice(moradorIndex, 1);
    
    for (const imovel of this.imoveis) {
      const unidade = imovel.Unidades.find(u => u.id === unidadeId);
      if (unidade) {
        unidade.ocupada = false;
        delete unidade.morador;
        break;
      }
    }
    
    this.pagamentos = this.pagamentos.filter(p => p.moradorId !== moradorId);
    
    return { message: 'Morador removido com sucesso!' };
  }

  @Post('imoveis/deletar/unidade')
  deletarUnidade(@Body() body: any) {
    const { unidadeId } = body;
    
    for (const imovel of this.imoveis) {
      const unidadeIndex = imovel.Unidades.findIndex(u => u.id === unidadeId);
      if (unidadeIndex !== -1) {
        const unidade = imovel.Unidades[unidadeIndex];
        
        if (unidade.morador) {
          this.moradores = this.moradores.filter(m => m.id !== unidade.morador!.id);
          this.pagamentos = this.pagamentos.filter(p => p.moradorId !== unidade.morador!.id);
        }
        
        imovel.Unidades.splice(unidadeIndex, 1);
        return { message: 'Unidade removida com sucesso!' };
      }
    }
    
    throw new HttpException('Unidade não encontrada', HttpStatus.NOT_FOUND);
  }

  @Put('imoveis/atualizar/unidade')
  atualizarUnidade(@Body() body: any) {
    const { id, numeroUnidade, valorAluguel, instalacaoAgua, instalacaoLuz, comodos } = body;
    
    for (const imovel of this.imoveis) {
      const unidade = imovel.Unidades.find(u => u.id === id);
      if (unidade) {
        unidade.numeroUnidade = numeroUnidade;
        unidade.valorAluguel = valorAluguel;
        unidade.instalacaoAgua = instalacaoAgua;
        unidade.instalacaoLuz = instalacaoLuz;
        unidade.comodos = comodos;
        
        return { message: 'Unidade atualizada com sucesso!' };
      }
    }
    
    throw new HttpException('Unidade não encontrada', HttpStatus.NOT_FOUND);
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
      rentPrice: 0,
      Unidades: []
    };
    this.imoveis.push(novoImovel);
    return { message: 'Imóvel cadastrado com sucesso' };
  }

  @Post('imoveis/add/unidade')
  addUnidade(@Body() body: any) {
    const { imovelId, numeroUnidade, valorAluguel, ocupada, instalacaoAgua, instalacaoLuz, comodos, morador, dataNascimento, rg, cpf, dataInicioContrato, dataFimContrato, diaVencimento, telefone, email } = body;
    
    const imovel = this.imoveis.find(i => i.id === imovelId);
    if (!imovel) {
      throw new HttpException('Imóvel não encontrado', HttpStatus.NOT_FOUND);
    }
    
    const novaUnidade: Unidade = {
      id: Date.now(),
      numeroUnidade,
      valorAluguel,
      instalacaoAgua,
      instalacaoLuz,
      comodos,
      ocupada,
      imovelId
    };
    
    if (ocupada && morador) {
      const novoMorador: Morador = {
        id: Date.now() + 1,
        nome: morador,
        email: email || '',
        telefone: telefone || '',
        cpf: cpf || '',
        rg: rg || '',
        dataNascimento,
        dataInicioContrato,
        dataFimContrato,
        diaVencimento,
        unidadeId: novaUnidade.id,
        imovelId
      };
      
      this.moradores.push(novoMorador);
      novaUnidade.morador = novoMorador;
      
      this.gerarPagamentosRecorrentes(novoMorador, valorAluguel);
    }
    
    imovel.Unidades.push(novaUnidade);
    
    return { message: ocupada ? 'Unidade cadastrada com sucesso!' : 'Unidade cadastrada como vaga!' };
  }

  private gerarPagamentosRecorrentes(morador: Morador, valor: number) {
    const inicio = new Date(morador.dataInicioContrato);
    const fim = new Date(morador.dataFimContrato);
    
    let atual = new Date(inicio);
    while (atual <= fim) {
      const vencimento = new Date(atual.getFullYear(), atual.getMonth(), morador.diaVencimento);
      
      const pagamento: Pagamento = {
        id: Date.now() + Math.random(),
        moradorId: morador.id,
        valor,
        dataVencimento: vencimento.toISOString().split('T')[0],
        status: vencimento < new Date() ? 'atrasado' : 'pendente',
        mes: atual.getMonth() + 1,
        ano: atual.getFullYear()
      };
      
      this.pagamentos.push(pagamento);
      atual.setMonth(atual.getMonth() + 1);
    }
  }

  @Post('imoveis/buscar/unidades')
  buscarUnidades(@Body() body: any) {
    const { imovelId } = body;
    const imovel = this.imoveis.find(i => i.id === imovelId);
    return imovel ? imovel.Unidades : [];
  }

  @Post('imoveis/add/morador')
  addMorador(@Body() body: any) {
    const { unidadeId, imovelId, nome, email, telefone, cpf, rg, dataNascimento, dataInicioContrato, dataFimContrato, diaVencimento } = body;
    
    const imovel = this.imoveis.find(i => i.id === imovelId);
    if (!imovel) {
      throw new HttpException('Imóvel não encontrado', HttpStatus.NOT_FOUND);
    }
    
    const unidade = imovel.Unidades.find(u => u.id === unidadeId);
    if (!unidade) {
      throw new HttpException('Unidade não encontrada', HttpStatus.NOT_FOUND);
    }
    
    const novoMorador: Morador = {
      id: Date.now(),
      nome,
      email,
      telefone,
      cpf,
      rg,
      dataNascimento,
      dataInicioContrato,
      dataFimContrato,
      diaVencimento,
      unidadeId,
      imovelId
    };
    
    this.moradores.push(novoMorador);
    unidade.morador = novoMorador;
    unidade.ocupada = true;
    
    this.gerarPagamentosRecorrentes(novoMorador, unidade.valorAluguel);
    
    return { message: 'Morador cadastrado com sucesso!' };
  }

  @Post('imoveis/buscar/unidades/morador')
  buscarMorador(@Body() body: any) {
    const { unidadeId, imovelId } = body;
    const morador = this.moradores.find(m => m.unidadeId === unidadeId && m.imovelId === imovelId);
    return morador || null;
  }

  @Get('imoveis/buscar/unidades/morador/:id')
  buscarMoradorPorId(@Param('id') id: string) {
    const morador = this.moradores.find(m => m.id === parseInt(id));
    if (!morador) {
      throw new HttpException('Morador não encontrado', HttpStatus.NOT_FOUND);
    }
    return morador;
  }

  @Get('imoveis/consultar/:id')
  detalharUnidade(@Param('id') id: string) {
    const unidadeId = parseInt(id);
    
    for (const imovel of this.imoveis) {
      const unidade = imovel.Unidades.find(u => u.id === unidadeId);
      if (unidade) {
        return {
          ...unidade,
          imovel: {
            id: imovel.id,
            name: imovel.name,
            address: imovel.address
          },
          morador: unidade.morador
        };
      }
    }
    
    throw new HttpException('Unidade não encontrada', HttpStatus.NOT_FOUND);
  }

  @Post('usuario/encontrar-usuario-id')
  buscarUsuario(@Body() body: any) {
    const { id } = body;
    const user = this.users.find(u => u.id === id && !u.deleted);
    
    if (!user) {
      throw new HttpException('Usuário não encontrado', HttpStatus.NOT_FOUND);
    }
    
    return {
      id: user.id,
      nome: user.name,
      email: user.email,
      telefone: user.telefone || '',
      endereco: user.endereco || '',
      cep: user.cep || '',
      rg: user.rg || '',
      cpf: user.cpf || '',
      banco: user.banco || '',
      agencia: user.agencia || '',
      conta: user.conta || '',
      pix: user.pix || ''
    };
  }

  @Post('usuario/atualizar-usuario')
  atualizarUsuario(@Body() body: any) {
    const { id, nome, telefone, endereco, cep, rg, cpf, banco, agencia, conta, pix } = body;
    const user = this.users.find(u => u.id === id && !u.deleted);
    
    if (!user) {
      throw new HttpException('Usuário não encontrado', HttpStatus.NOT_FOUND);
    }
    
    user.name = nome || user.name;
    user.telefone = telefone;
    user.endereco = endereco;
    user.cep = cep;
    user.rg = rg;
    user.cpf = cpf;
    user.banco = banco;
    user.agencia = agencia;
    user.conta = conta;
    user.pix = pix;
    
    return { message: 'Configurações atualizadas com sucesso!' };
  }

  @Post('usuario/alterar-senha')
  alterarSenha(@Body() body: any) {
    const { id, senhaAtual, novaSenha } = body;
    const user = this.users.find(u => u.id === id && !u.deleted);
    
    if (!user) {
      throw new HttpException('Usuário não encontrado', HttpStatus.NOT_FOUND);
    }
    
    if (!this.verifyPassword(senhaAtual, user.password)) {
      throw new HttpException('Senha atual incorreta', HttpStatus.BAD_REQUEST);
    }
    
    user.password = this.hashPassword(novaSenha);
    return { message: 'Senha atualizada com sucesso!' };
  }



  @Post('usuario/registrar')
  registrarUsuario(@Body() body: any) {
    const { name, email, password } = body;
    
    if (this.users.find(u => u.email === email && !u.deleted)) {
      throw new HttpException('Email já cadastrado', HttpStatus.BAD_REQUEST);
    }
    
    const newUser: User = {
      id: (this.users.length + 1).toString(),
      email,
      password: this.hashPassword(password),
      name,
      deleted: false
    };
    
    this.users.push(newUser);
    
    return { message: 'Usuário criado com sucesso!' };
  }

  @Post('usuario/excluir-conta')
  excluirConta(@Body() body: any) {
    const { id } = body;
    const userIndex = this.users.findIndex(u => u.id === id);
    
    if (userIndex === -1) {
      throw new HttpException('Usuário não encontrado', HttpStatus.NOT_FOUND);
    }
    
    this.users.splice(userIndex, 1);
    
    for (const [token, userId] of this.tokens.entries()) {
      if (userId === id) {
        this.tokens.delete(token);
      }
    }
    
    return { message: 'Conta excluída com sucesso!' };
  }
}
