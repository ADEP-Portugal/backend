import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';
import { PeriodFilter } from './types/period-filter';

@ApiTags('health-check')
@Controller('')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  healthCheck(): void {}

  @Get('reports')
  @HttpCode(HttpStatus.OK)
  generateReport(@Query('date') date?: Date, @Query('period') period?: PeriodFilter) {
    if(!date && !period) {
      throw new Error('Either date or period must be provided');
    }
    if(date) {
      return this.appService.filterByDate(new Date(date));
    } else if(period) {
      return this.appService.filterByPeriod(period);
    }
  }
}
