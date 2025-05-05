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
import { EventService } from './event.service';
import { EventResponse } from './models';
import { CreateEventRequest } from './models/request/create-event-request';
import { UpdateEventRequest } from './models/request/update-event-request';
import { PeriodFilter } from '../types/period-filter';
import { AuthCookieGuardion } from 'src/common/guards/auth-cookie.guard';

@ApiTags('events')
@Controller('events')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @ApiBearerAuth()
  @Get()
  
  @HttpCode(HttpStatus.OK)
  async fetchAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('name') name?: string,
    @Query('period') period?: PeriodFilter,
  ) {
    if (page && limit) {
      return this.eventService.fetchAllPaginated(page, limit, name, period);
    }
    return this.eventService.fetchAll(name, period);
  }

  @ApiBearerAuth()
  @Get(':id')
  
  @HttpCode(HttpStatus.OK)
  async fetchById(@Param('id') id: string): Promise<EventResponse> {
    return this.eventService.fetchById(id);
  }

  @ApiBearerAuth()
  @Post()
  
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createRequest: CreateEventRequest): Promise<void> {
    return await this.eventService.create(createRequest);
  }

  @ApiBearerAuth()
  @Put(':id')
  
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: string,
    @Body() updateRequest: UpdateEventRequest,
  ): Promise<EventResponse> {
    return this.eventService.update(id, updateRequest);
  }

  @ApiBearerAuth()
  @Delete(':id')
  
  @HttpCode(HttpStatus.OK)
  async delete(@Param('id') id: string): Promise<void> {
    return this.eventService.delete(id);
  }
}
