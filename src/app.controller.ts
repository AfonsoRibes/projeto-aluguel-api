import { Controller, Get, Post, Put, Delete, Body, HttpException, HttpStatus, Headers, Param } from '@nestjs/common';
import { AppService } from './app.service';
import { DataService } from './data.service';

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
  tempoContratoPadrao?: number;
  vencimentoPadrao?: number;
  reajusteAnual?: number;
  boletoAutomatico?: boolean;
  descontoPagamentoAntecipado?: boolean;
  valorDescontoAntecipado?: number;
  notificacoesPadrao?: number;
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
  private data: any;

  constructor(private readonly appService: AppService, private readonly dataService: DataService) {
    this.data = this.dataService.loadData();
    if (this.data.users.length === 0) {
      this.data.users = [{
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
        tempoContratoPadrao: 12,
        vencimentoPadrao: 5,
        reajusteAnual: 0,
        boletoAutomatico: false,
        descontoPagamentoAntecipado: false,
        valorDescontoAntecipado: 0,
        notificacoesPadrao: 5,
        deleted: false
      }];
      this.saveData();
    }
  }

  private saveData() {
    this.dataService.saveData(this.data);
  }

  private get users() { return this.data.users; }
  private get tokens() { return this.data.tokens; }
  private get imoveis() { return this.data.imoveis; }
  private get moradores() { return this.data.moradores; }
  private get pagamentos() { return this.data.pagamentos; }

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



  @Get('imoveis/buscar')
  buscarImoveis() {
    return this.imoveis;
  }

  @Get('auth/details')
  authDetails(@Headers('authorization') auth?: string) {
    const token = auth?.replace('Bearer ', '');
    if (!token || !this.tokens[token]) {
      throw new HttpException('Token inválido', HttpStatus.UNAUTHORIZED);
    }
    
    const userId = this.tokens[token];
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
    this.tokens[token] = user.id;
    this.saveData();
    
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
    this.tokens[token] = newUser.id;
    this.saveData();
    
    return {
      accessToken: token,
      refreshToken: this.generateToken()
    };
  }

  @Get('pagamentos/buscar/todos')
  buscarPagamentos() {
    return this.pagamentos.map(p => {
      const morador = this.moradores.find(m => m.id === p.moradorId);
      const imovel = this.imoveis.find(i => i.id === morador?.imovelId);
      const unidade = imovel?.Unidades.find(u => u.id === morador?.unidadeId);
      
      return {
        ...p,
        moradorNome: morador?.nome || 'Morador não encontrado',
        Moradore: {
          nome: morador?.nome || 'Morador não encontrado',
          ativo: true,
          Unidade: {
            Imovei: {
              id: imovel?.id,
              nomePredio: imovel?.name
            }
          }
        }
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
    
    this.data.pagamentos = this.data.pagamentos.filter(p => p.moradorId !== moradorId);
    
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
          this.data.moradores = this.data.moradores.filter(m => m.id !== unidade.morador!.id);
          this.data.pagamentos = this.data.pagamentos.filter(p => p.moradorId !== unidade.morador!.id);
        }
        
        imovel.Unidades.splice(unidadeIndex, 1);
        return { message: 'Unidade removida com sucesso!' };
      }
    }
    
    throw new HttpException('Unidade não encontrada', HttpStatus.NOT_FOUND);
  }

  @Put('imoveis/atualizar/unidade')
  atualizarUnidade(@Body() body: any) {
    const { unidadeId, moradorId, numeroUnidade, valorAluguel, instalacaoAgua, instalacaoLuz, comodos, nome, rg, cpf, telefone, email, inicioContrato, fimContrato, diaVencimento } = body;
    
    for (const imovel of this.imoveis) {
      const unidade = imovel.Unidades.find(u => u.id === unidadeId);
      if (unidade) {
        unidade.numeroUnidade = numeroUnidade;
        unidade.valorAluguel = valorAluguel;
        unidade.instalacaoAgua = instalacaoAgua;
        unidade.instalacaoLuz = instalacaoLuz;
        if (comodos) unidade.comodos = comodos;
        
        if (moradorId) {
          const morador = this.moradores.find(m => m.id === moradorId);
          if (morador) {
            morador.nome = nome;
            morador.rg = rg;
            morador.cpf = cpf;
            morador.telefone = telefone;
            morador.email = email;
            morador.dataInicioContrato = inicioContrato;
            morador.dataFimContrato = fimContrato;
            morador.diaVencimento = diaVencimento;
          }
        }
        
        this.saveData();
        return { message: 'Dados atualizados com sucesso!' };
      }
    }
    
    throw new HttpException('Unidade não encontrada', HttpStatus.NOT_FOUND);
  }

  @Get('properties')
  getProperties() {
    return [];
  }

  @Get('test')
  test() {
    console.log('ENDPOINT TEST CHAMADO');
    return { message: 'Servidor funcionando!' };
  }

  @Post('test-post')
  testPost(@Body() body: any) {
    console.log('ENDPOINT TEST POST CHAMADO');
    console.log('Body:', body);
    return { message: 'POST funcionando!', data: body };
  }

  @Post('test-validation')
  testValidation(@Body() body: any) {
    console.log('TEST VALIDATION CHAMADO');
    throw new HttpException('Preencha os seguintes campos: Nome, Email, Telefone', HttpStatus.BAD_REQUEST);
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
    this.saveData();
    return { message: 'Imóvel cadastrado com sucesso' };
  }

  @Post('imoveis/add/unidade')
  addUnidade(@Body() body: any) {
    const { imovelId, numeroUnidade, valorAluguel, ocupada, instalacaoAgua, instalacaoLuz, comodos, morador, dataNascimento, rg, cpf, dataInicioContrato, dataFimContrato, diaVencimento, telefone, email } = body;
    
    const imovel = this.imoveis.find(i => i.id === parseInt(imovelId));
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
    this.saveData();
    
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
    if (!imovel) return [];
    
    const unidades = imovel.Unidades.map(unidade => {
      const morador = this.moradores.find(m => m.unidadeId === unidade.id);
      return {
        ...unidade,
        morador: morador || unidade.morador,
        ocupada: unidade.ocupada
      };
    });
    
    this.saveData();
    return unidades;
  }

  @Post('imoveis/add/morador')
  @Post('imoveis/criar/contrato')
  addMorador(@Body() body: any) {
    
    const { unidadeId, imovelId, nome, email, telefone, cpf, rg, dataNascimento, dataInicioContrato, dataFimContrato, diaVencimento } = body;
    
    const camposFaltando: string[] = [];
    
    if (!nome || (typeof nome === 'string' && nome.trim() === '')) {
      camposFaltando.push('Nome do morador');
    }
    if (!email || (typeof email === 'string' && email.trim() === '')) {
      camposFaltando.push('E-mail');
    }
    if (!telefone || (typeof telefone === 'string' && telefone.trim() === '')) {
      camposFaltando.push('Telefone');
    }
    if (!cpf || (typeof cpf === 'string' && cpf.trim() === '')) {
      camposFaltando.push('CPF');
    }
    if (!rg || (typeof rg === 'string' && rg.trim() === '')) {
      camposFaltando.push('RG');
    }
    if (!dataNascimento || (typeof dataNascimento === 'string' && dataNascimento.trim() === '')) {
      camposFaltando.push('Data de Nascimento');
    }
    if (!dataInicioContrato || (typeof dataInicioContrato === 'string' && dataInicioContrato.trim() === '')) {
      camposFaltando.push('Início do contrato');
    }
    if (!dataFimContrato || (typeof dataFimContrato === 'string' && dataFimContrato.trim() === '')) {
      camposFaltando.push('Fim do contrato');
    }
    if (!diaVencimento || diaVencimento === 0 || diaVencimento === '0' || diaVencimento === '') {
      camposFaltando.push('Dia de vencimento');
    }
    
    if (camposFaltando.length > 0) {
      throw new HttpException(`Preencha os seguintes campos: ${camposFaltando.join(', ')}`, HttpStatus.BAD_REQUEST);
    }
    
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
    this.saveData();
    
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
        const morador = this.moradores.find(m => m.unidadeId === unidadeId);
        
        const moradorFormatado = morador ? {
          id: morador.id,
          nome: morador.nome,
          telefone: morador.telefone,
          cpf: morador.cpf,
          rg: morador.rg,
          contrato: '',
          inicioContrato: morador.dataInicioContrato,
          fimContrato: morador.dataFimContrato,
          diaVencimento: morador.diaVencimento,
          ativo: true
        } : null;
        
        return {
          ...unidade,
          imovel: {
            id: imovel.id,
            name: imovel.name,
            address: imovel.address
          },
          Moradores: moradorFormatado ? [moradorFormatado] : []
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
      pix: user.pix || '',
      tempoContratoPadrao: user.tempoContratoPadrao || 12,
      vencimentoPadrao: user.vencimentoPadrao || 5,
      reajusteAnual: user.reajusteAnual || 0,
      boletoAutomatico: user.boletoAutomatico || false,
      descontoPagamentoAntecipado: user.descontoPagamentoAntecipado || false,
      valorDescontoAntecipado: user.valorDescontoAntecipado || 0,
      notificacoesPadrao: user.notificacoesPadrao || 5
    };
  }

  @Post('usuario/atualizar-usuario')
  atualizarUsuario(@Body() body: any) {
    const { id, nome, telefone, endereco, cep, rg, cpf, banco, agencia, conta, pix, tempoContratoPadrao, vencimentoPadrao, reajusteAnual, boletoAutomatico, descontoPagamentoAntecipado, valorDescontoAntecipado, notificacoesPadrao } = body;
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
    user.tempoContratoPadrao = tempoContratoPadrao;
    user.vencimentoPadrao = vencimentoPadrao;
    user.reajusteAnual = reajusteAnual;
    user.boletoAutomatico = boletoAutomatico;
    user.descontoPagamentoAntecipado = descontoPagamentoAntecipado;
    user.valorDescontoAntecipado = valorDescontoAntecipado;
    user.notificacoesPadrao = notificacoesPadrao;
    
    this.saveData();
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
    this.saveData();
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
    
    this.saveData();
    return { message: 'Conta excluída com sucesso!' };
  }
}
