import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Put,
  Query,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from './user.service';
import { Usr } from './user.decorator';
import { UpdateUserRequest, UserResponse } from './models';
import { AuthUser } from '../auth/auth-user';
import { JwtPayload } from 'src/auth/jwt-payload';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiBearerAuth()
  @Get()
  @HttpCode(HttpStatus.OK)
  async fetchAll() {
    return await this.userService.fetchAll();
  }

  @ApiBearerAuth()
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async updateUser(
    @Param('id') id: string,
    @Body() updateRequest: UpdateUserRequest,
    @Usr() user: JwtPayload,
  ): Promise<void> {
    if (id !== user.id) {
      throw new UnauthorizedException();
    }
    await this.userService.updateUser(id, updateRequest);
  }
}
