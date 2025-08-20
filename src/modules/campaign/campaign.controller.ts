import { Body, Controller, Delete, Param, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CampaignService } from './campaign.service';
import { CreateCampaignDto } from './dto/create-campaign.dto';

@ApiTags('campaign')
@Controller('campaign')
export class CampaignController {
  constructor(private readonly campaignService: CampaignService) {}

  @Post()
  @ApiOperation({ summary: 'Registra uma nova campanha' })
  @ApiBody({ type: CreateCampaignDto })
  @ApiResponse({ status: 201, description: 'Campanha registrado com sucesso.' })
  @ApiResponse({ status: 400, description: 'Dados inválidos.' })
  register(@Body() dto: CreateCampaignDto) {
    return this.campaignService.create(dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deleta uma campanha' })
  @ApiParam({ name: 'id', description: 'ID da campanha', type: String })
  @ApiResponse({ status: 204, description: 'Campanha apagada com sucesso.' })
  delete(@Param('id') id: string) {
    return this.campaignService.delete(id);
  }

  // @Get()
  // @ApiOperation({ summary: 'Lista todas as campanhas' })
  // @ApiResponse({
  //   status: 200,
  //   description: 'Lista de campanhas retornada com sucesso.',
  // })
  // getAll() {
  //   return this.campaignService.findAll();
  // }
}
