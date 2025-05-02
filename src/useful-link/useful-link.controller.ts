import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UsefulLinkService } from './useful-link.service';
import { UsefulLinkResponse } from './models';
import { CreateUsefulLinkRequest } from './models/request/create-useful-link-request';
import { UpdateUsefulLinkRequest } from './models/request/update-useful-link-request';
import { AuthCookieGuardion } from 'src/common/guards/auth-cookie.guard';

@ApiTags('useful-links')
@Controller('useful-links')
export class UsefulLinkController {
  constructor(private readonly eventService: UsefulLinkService) {}

  @ApiBearerAuth()
  @Get()
  @UseGuards(AuthCookieGuardion)
  @HttpCode(HttpStatus.OK)
  async fetchAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('title') title?: string,
  ) {
    if (page && limit) {
      return this.eventService.fetchAllPaginated(page, limit, title);
    }
    return this.eventService.fetchAll(title);
  }

  @ApiBearerAuth()
  @Get(':id')
  @UseGuards(AuthCookieGuardion)
  @HttpCode(HttpStatus.OK)
  async fetchById(@Param('id') id: string): Promise<UsefulLinkResponse> {
    return this.eventService.fetchById(id);
  }

  @ApiBearerAuth()
  @Post()
  @UseGuards(AuthCookieGuardion)
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createRequest: CreateUsefulLinkRequest): Promise<void> {
    return await this.eventService.create(createRequest);
  }

  @ApiBearerAuth()
  @Put(':id')
  @UseGuards(AuthCookieGuardion)
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: string,
    @Body() updateRequest: UpdateUsefulLinkRequest,
  ): Promise<UsefulLinkResponse> {
    return this.eventService.update(id, updateRequest);
  }

  @ApiBearerAuth()
  @Delete(':id')
  @UseGuards(AuthCookieGuardion)
  @HttpCode(HttpStatus.OK)
  async delete(@Param('id') id: string): Promise<void> {
    return this.eventService.delete(id);
  }
}
