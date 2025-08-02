import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({ required: false })
  name?: string;

  @ApiProperty({ required: false })
  email?: string;

  @ApiProperty({ required: false })
  phone?: string;

  @ApiProperty({ required: false })
  whatsappGroup?: string;

  @ApiProperty({ required: false })
  telegramGroup?: string;

  @ApiProperty({ required: false })
  instagramProfile?: string;

  @ApiProperty({ required: false })
  tiktokProfile?: string;

  @ApiProperty({ required: false })
  youtubeChannel?: string;
}
