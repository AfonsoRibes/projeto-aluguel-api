import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ObjectId } from 'mongodb';
import { User, UserId } from '../../auth/decorator/user.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { UserEntity } from '../../database/entities/user.entity';
import { CampaignService } from './campaign.service';
import { CreateCampaignDto } from './dto/create-campaign.dto';

@ApiTags('campaign')
@Controller('campaign')
export class CampaignController {
  constructor(private readonly campaignService: CampaignService) {}

  @Patch('pay/:id')
  @ApiOperation({ summary: 'Pagar uma campanha' })
  @ApiResponse({ status: 200, description: 'Campanha paga com sucesso.' })
  @ApiParam({ name: 'id', description: 'ID da campanha', type: String })
  payCampaign(@Param('id') id: ObjectId) {
    return this.campaignService.payCampaign(id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get campanha dos usuários' })
  @ApiResponse({ status: 200, description: 'Usuários retornados com sucesso.' })
  @ApiParam({ name: 'id', description: 'ID da campanha', type: String })
  getById(@Param('id') id: ObjectId) {
    return this.campaignService.getById(id);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get campanha dos usuários' })
  @ApiResponse({ status: 200, description: 'Usuários retornados com sucesso.' })
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
  getUserCampaign(@User() user: UserEntity) {
    return this.campaignService.getUserCampaigns(user._id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Registra uma nova campanha' })
  @ApiBody({ type: CreateCampaignDto })
  @ApiResponse({ status: 201, description: 'Campanha registrado com sucesso.' })
  @ApiResponse({ status: 400, description: 'Dados inválidos.' })
  register(@User() user: UserEntity, @Body() dto: CreateCampaignDto) {
    return this.campaignService.create(dto, user._id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Deleta uma campanha' })
  @ApiParam({ name: 'id', description: 'ID da campanha', type: String })
  @ApiResponse({ status: 204, description: 'Campanha apagada com sucesso.' })
  delete(@UserId() userId: ObjectId, @Param('id') id: string) {
    return this.campaignService.delete(userId, new ObjectId(id));
  }
}
