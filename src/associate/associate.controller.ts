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
import { AssociateService } from './associate.service';
import { AssociateResponse } from './models';
import { CreateAssociateRequest } from './models/request/create-associate-request';
import { UpdateAssociateRequest } from './models/request/update-associate-request';
import { SummaryAssociateResponse } from './models/summary-associate.response';
import { PeriodFilter } from 'src/types/period-filter';
import { ExpirationDateAssociateResponse } from './models/expiration-date-associate.response';
import { AuthCookieGuardion } from 'src/common/guards/auth-cookie.guard';

@ApiTags('associates')
@Controller('associates')
export class AssociateController {
  constructor(private readonly associateService: AssociateService) {}

  @ApiBearerAuth()
  @Get()
  @UseGuards(AuthCookieGuardion)
  @HttpCode(HttpStatus.OK)
  async fetchAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('name') name?: string,
    @Query('phone') phone?: string,
    @Query('associateNumber') associateNumber?: string,
    @Query('birthday') birthday?: PeriodFilter,
  ) {
    if (page && limit) {
      return this.associateService.fetchAllPaginated(page, limit, name, birthday);
    }
    return this.associateService.fetchAll(name, birthday, phone, associateNumber);
  }

  @ApiBearerAuth()
  @Get('expiry-date')
  @UseGuards(AuthCookieGuardion)
  @HttpCode(HttpStatus.OK)
  async expiryDate(): Promise<ExpirationDateAssociateResponse[]> {
    return this.associateService.fetchExpirationDate();
  }

  @ApiBearerAuth()
  @Get('summary')
  @UseGuards(AuthCookieGuardion)
  @HttpCode(HttpStatus.OK)
  async fetchSummary(): Promise<SummaryAssociateResponse[]> {
    return this.associateService.fetchSummary();
  }

  @ApiBearerAuth()
  @Get(':id')
  @UseGuards(AuthCookieGuardion)
  @HttpCode(HttpStatus.OK)
  async fetchById(@Param('id') id: string): Promise<AssociateResponse> {
    return this.associateService.fetchById(id);
  }

  @ApiBearerAuth()
  @Post()
  @UseGuards(AuthCookieGuardion)
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createRequest: CreateAssociateRequest): Promise<void> {
    return await this.associateService.create(createRequest);
  }

  @ApiBearerAuth()
  @Put(':id')
  @UseGuards(AuthCookieGuardion)
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: string,
    @Body() updateRequest: UpdateAssociateRequest,
  ): Promise<AssociateResponse> {
    return this.associateService.update(id, updateRequest);
  }

  @ApiBearerAuth()
  @Delete(':id')
  @UseGuards(AuthCookieGuardion)
  @HttpCode(HttpStatus.OK)
  async delete(@Param('id') id: string): Promise<void> {
    return this.associateService.delete(id);
  }
}
