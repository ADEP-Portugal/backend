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
import { LawsuitService } from './lawsuit.service';
import {
  LawsuitResponse,
  CreateLawsuitRequest,
  UpdateLawsuitRequest,
} from './models';
import { SummaryLawsuitResponse } from './models/summary-lawsuit.response';
import { AuthCookieGuardion } from 'src/common/guards/auth-cookie.guard';

@ApiTags('lawsuits')
@Controller('lawsuits')
export class LawsuitController {
  constructor(private readonly lawsuitService: LawsuitService) {}

  @ApiBearerAuth()
  @Get()
  
  @HttpCode(HttpStatus.OK)
  async fetchAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('client') client?: string,
  ) {
    if (page && limit) {
      return this.lawsuitService.fetchAllPaginated(page, limit, client);
    }
    return this.lawsuitService.fetchAll(client);
  }

  @ApiBearerAuth()
  @Get('summary')
  
  @HttpCode(HttpStatus.OK)
  async fetchSummary(): Promise<SummaryLawsuitResponse[]> {
    return this.lawsuitService.fetchSummary();
  }

  @ApiBearerAuth()
  @Get(':id')
  
  @HttpCode(HttpStatus.OK)
  async fetchById(@Param('id') id: string): Promise<LawsuitResponse> {
    return this.lawsuitService.fetchById(id);
  }

  @ApiBearerAuth()
  @Post()
  
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createRequest: CreateLawsuitRequest): Promise<void> {
    return await this.lawsuitService.create(createRequest);
  }

  @ApiBearerAuth()
  @Put(':id')
  
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: string,
    @Body() updateRequest: UpdateLawsuitRequest,
  ): Promise<LawsuitResponse> {
    return this.lawsuitService.update(id, updateRequest);
  }

  @ApiBearerAuth()
  @Delete(':id')
  
  @HttpCode(HttpStatus.OK)
  async delete(@Param('id') id: string): Promise<void> {
    return this.lawsuitService.delete(id);
  }
}
