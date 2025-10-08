
import { LoginDto } from './dto/login.dto';

import { Body, Controller, Post, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';

@Controller('usuario')
export class UsuarioController {
  constructor(private readonly authService: AuthService) {}

  @Post('registrar')
  registrar(@Body() dto: RegisterDto) {
    console.log('DTO recebido em /usuario/registrar:', dto);
    if (!dto.name || !dto.email || !dto.password) {
      throw new BadRequestException('name, email e password são obrigatórios');
    }
    return this.authService.register(dto.name, dto.email, dto.password);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto.login, dto.password);
  }
}
