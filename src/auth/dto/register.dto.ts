import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({
    example: 'usuario@exemplo.com',
    description: 'Email do usuário',
  })
  email: string;

  @ApiProperty({ example: 'senhaSegura123', description: 'Senha do usuário' })
  password: string;
}
