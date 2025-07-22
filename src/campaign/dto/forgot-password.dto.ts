import { ApiProperty } from '@nestjs/swagger';

export class ForgotPasswordDto {
  @ApiProperty({
    example: 'usuario@exemplo.com',
    description: 'Email do usuário para recuperar senha',
  })
  email: string;
}
