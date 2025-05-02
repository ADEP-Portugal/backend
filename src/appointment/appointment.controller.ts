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
import { AppointmentService } from './appointment.service';
import { AppointmentResponse, CreateAppointmentRequest, UpdateAppointmentRequest } from './models';
import { PeriodFilter } from 'src/types/period-filter';
import { AuthCookieGuardion } from 'src/common/guards/auth-cookie.guard';

@ApiTags('appointments')
@Controller('appointments')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @ApiBearerAuth()
  @Get()
  @UseGuards(AuthCookieGuardion)
  @HttpCode(HttpStatus.OK)
  async fetchAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('client') client?: string,
    @Query('period') period?: PeriodFilter,
  ) {
    if (page && limit) {
      return this.appointmentService.fetchAllPaginated(page, limit, client, period);
    }
    return this.appointmentService.fetchAll(client, period);
  }

  @ApiBearerAuth()
  @Get(':id')
  @UseGuards(AuthCookieGuardion)
  @HttpCode(HttpStatus.OK)
  async fetchById(@Param('id') id: string): Promise<AppointmentResponse> {
    return this.appointmentService.fetchById(id);
  }

  @ApiBearerAuth()
  @Post()
  @UseGuards(AuthCookieGuardion)
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createRequest: CreateAppointmentRequest): Promise<void> {
    return await this.appointmentService.create(createRequest);
  }

  @ApiBearerAuth()
  @Put(':id')
  @UseGuards(AuthCookieGuardion)
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: string,
    @Body() updateRequest: UpdateAppointmentRequest,
  ): Promise<AppointmentResponse> {
    return this.appointmentService.update(id, updateRequest);
  }

  @ApiBearerAuth()
  @Delete(':id')
  @UseGuards(AuthCookieGuardion)
  @HttpCode(HttpStatus.OK)
  async delete(@Param('id') id: string): Promise<void> {
    return this.appointmentService.delete(id);
  }
}