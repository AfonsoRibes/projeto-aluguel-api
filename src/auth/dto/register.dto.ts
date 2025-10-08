import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class RegisterDto {

  @ApiProperty({
    example: 'nome',
    description: 'Nome do usuário',
  })
  @IsString()
  @IsNotEmpty()
  name: string;


  @ApiProperty({
    example: 'usuario@exemplo.com',
    description: 'Email do usuário',
  })
  @IsString()
  @IsNotEmpty()
  email: string;


  @ApiProperty({ example: 'senhaSegura123', description: 'Senha do usuário' })
  @IsString()
  @IsNotEmpty()
  password: string;
}
