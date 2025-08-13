import { ApiProperty } from '@nestjs/swagger';

export class CreateCampaignDto {
  @ApiProperty({
    example: 'campanha 1',
    description: 'Nome da campanha',
  })
  name: string;

  @ApiProperty({
    example: 100,
    description: 'Valor da campanha',
  })
  value: number;
}
