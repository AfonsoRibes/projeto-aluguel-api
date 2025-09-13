import { IsString, IsNotEmpty, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PayCampaignDto {
  @ApiProperty({ description: 'Nome do comprador das cotas' })
  @IsString()
  @IsNotEmpty()
  buyerName: string;

  @ApiProperty({ description: 'Cotas selecionadas', type: [String] })
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  selectedQuotas: string[];
}
