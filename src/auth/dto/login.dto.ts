import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    example: 'usuario@exemplo.com',
    description: 'Email do usuário',
  })
  login: string;

  @ApiProperty({ example: 'senhaSegura123', description: 'Senha do usuário' })
  password: string;
}
