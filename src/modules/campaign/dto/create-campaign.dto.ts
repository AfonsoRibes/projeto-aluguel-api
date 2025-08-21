import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ObjectId, Schema } from 'mongoose';
import { PaymentDueDateEnum } from '../../../shared/enums/payment-due-date.enum';
import { RafflePlatformEnum } from '../../../shared/enums/raffe-plataform.enum';
import { RaffleSelectionTypeEnum } from '../../../shared/enums/reffle-selection-type.enum';
import { Types } from 'mongoose';

export class CreateCampaignDto {
  @ApiProperty({ example: 'Campanha de Natal' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Descrição da campanha de natal' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 100 })
  @IsNumber()
  ticketNumber: number;

  @ApiProperty({ example: 10.5 })
  @IsNumber()
  ticketValue: number;

  @ApiProperty({
    enum: RafflePlatformEnum,
    example: RafflePlatformEnum.INSTAGRAM,
  })
  @IsEnum(RafflePlatformEnum)
  rafflePlataform: RafflePlatformEnum;

  @ApiProperty({
    enum: RaffleSelectionTypeEnum,
    example: RaffleSelectionTypeEnum.RANDOM,
  })
  @IsEnum(RaffleSelectionTypeEnum)
  RaffleSelectionType: RaffleSelectionTypeEnum;

  @ApiPropertyOptional({ example: 5 })
  @IsOptional()
  @IsNumber()
  quotaLimitPerPerson?: number;

  @ApiPropertyOptional({ example: '2025-12-25T00:00:00Z' })
  @IsOptional()
  releaseDate?: Schema.Types.Date;

  @ApiProperty({
    enum: PaymentDueDateEnum,
    example: PaymentDueDateEnum.ONE_DAY,
  })
  @IsEnum(PaymentDueDateEnum)
  PaymentDueDate: PaymentDueDateEnum;

  @ApiProperty({ example: true })
  @IsBoolean()
  showTopThree: boolean;

  @ApiProperty({ example: false })
  @IsBoolean()
  randomQuotas: boolean;

  @ApiPropertyOptional({ example: 'reserva@email.com' })
  @IsOptional()
  @IsString()
  reservationEmail?: string;

  @ApiProperty({
    example: '64fa1234bcf86cd799439011',
    description: 'Id do usuário dono da campanha',
  })
  @IsNotEmpty()
  userId: ObjectId;
}
