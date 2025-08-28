import { Body, Controller, Delete, Get, Put, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ObjectId } from 'mongodb';
import { UserId } from '../../auth/decorator/user.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  // @UseGuards(JwtAuthGuard)
  // @ApiBearerAuth()
  @ApiOperation({ summary: 'Get dados dos usuários' })
  @ApiResponse({ status: 200, description: 'Usuários retornados com sucesso.' })
  // @ApiResponse({ status: 401, description: 'Não autorizado.' })
  get() {
    return this.userService.getAll();
  }

  @Put()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualizar dados do usuário' })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({ status: 200, description: 'Usuário atualizado com sucesso.' })
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
  update(@UserId() userId: ObjectId, @Body() dto: UpdateUserDto) {
    return this.userService.update(userId, dto);
  }

  @Delete()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Deletar conta do usuário' })
  @ApiResponse({ status: 200, description: 'Usuário deletado com sucesso.' })
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
  delete(@UserId() userId: ObjectId) {
    return this.userService.delete(userId);
  }
}
