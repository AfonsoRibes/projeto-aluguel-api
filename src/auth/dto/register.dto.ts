import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({
    example: 'nome',
    description: 'Nome do usuário',
  })
  name: string;

  @ApiProperty({
    example: 'usuario@exemplo.com',
    description: 'Email do usuário',
  })
  email: string;

  @ApiProperty({ example: 'senhaSegura123', description: 'Senha do usuário' })
  password: string;
}
