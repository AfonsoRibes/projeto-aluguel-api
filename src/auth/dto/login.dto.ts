import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'usuario@exemplo.com',
    description: 'Email do usuário',
  })
  @IsString()
  @IsEmail()
  login: string;

  @ApiProperty({ example: 'senhaSegura123', description: 'Senha do usuário' })
  @IsString()
  password: string;
}
