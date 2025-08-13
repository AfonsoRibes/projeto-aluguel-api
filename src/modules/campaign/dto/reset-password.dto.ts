// reset-password.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
  @ApiProperty({
    example: 'uuid-do-token-de-reset',
    description: 'Token recebido para resetar a senha',
  })
  token: string;

  @ApiProperty({
    example: 'novaSenha123',
    description: 'Nova senha para a conta',
  })
  newPassword: string;
}
