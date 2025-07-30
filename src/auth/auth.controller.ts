import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserEntity } from '../entities/user/user.entity';
import { AuthService } from './auth.service';
import { User } from './decorator/user.decorator';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Registrar novo usuário' })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({ status: 201, description: 'Usuário registrado com sucesso.' })
  @ApiResponse({ status: 400, description: 'Dados inválidos.' })
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto.name, dto.email, dto.password);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login de usuário' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: 'Login realizado com sucesso.' })
  @ApiResponse({ status: 401, description: 'Credenciais inválidas.' })
  login(@Body() dto: LoginDto) {
    console.log(dto);

    return this.authService.login(dto.login, dto.password);
  }

  @ApiBearerAuth()
  @Get('details')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Retorna dados do usuário autenticado (me)' })
  @ApiResponse({
    status: 200,
    description: 'Dados do usuário logado.',
    type: UserEntity,
  })
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
  getProfile(@User() user: Omit<UserEntity, 'password'>) {
    return user;
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Atualizar token de acesso usando refresh token' })
  @ApiBody({ schema: { properties: { refreshToken: { type: 'string' } } } })
  @ApiResponse({ status: 200, description: 'Token atualizado com sucesso.' })
  refresh(@Body('refreshToken') token: string) {
    return this.authService.refreshToken(token);
  }

  @Post('forgot-password')
  @ApiOperation({ summary: 'Solicitar recuperação de senha' })
  @ApiBody({ type: ForgotPasswordDto })
  @ApiResponse({
    status: 200,
    description: 'Token para reset de senha enviado (simulado).',
  })
  forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto.email);
  }

  @Post('reset-password')
  @ApiOperation({ summary: 'Resetar senha com token' })
  @ApiBody({ type: ResetPasswordDto })
  @ApiResponse({ status: 200, description: 'Senha resetada com sucesso.' })
  @ApiResponse({ status: 401, description: 'Token inválido ou expirado.' })
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto.token, dto.newPassword);
  }
}
