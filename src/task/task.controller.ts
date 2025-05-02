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
import { TaskService } from './task.service';
import { TaskResponse, CreateTaskRequest, UpdateTaskRequest } from './models';
import { AuthCookieGuardion } from 'src/common/guards/auth-cookie.guard';

@ApiTags('tasks')
@Controller('tasks')
export class TaskController {
  constructor(private readonly lawsuitService: TaskService) {}

  @ApiBearerAuth()
  @Get()
  @UseGuards(AuthCookieGuardion)
  @HttpCode(HttpStatus.OK)
  async fetchAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('client') client?: string,
    @Query('status') status?: string,
    @Query('priority') priority?: string,
  ) {
    if (page && limit) {
      return this.lawsuitService.fetchAllPaginated(page, limit, client);
    }
    return this.lawsuitService.fetchAll(client);
  }

  @ApiBearerAuth()
  @Get(':id')
  @UseGuards(AuthCookieGuardion)
  @HttpCode(HttpStatus.OK)
  async fetchById(@Param('id') id: string): Promise<TaskResponse> {
    return this.lawsuitService.fetchById(id);
  }

  @ApiBearerAuth()
  @Post()
  @UseGuards(AuthCookieGuardion)
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createRequest: CreateTaskRequest): Promise<void> {
    return await this.lawsuitService.create(createRequest);
  }

  @ApiBearerAuth()
  @Put(':id')
  @UseGuards(AuthCookieGuardion)
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: string,
    @Body() updateRequest: UpdateTaskRequest,
  ): Promise<TaskResponse> {
    return this.lawsuitService.update(id, updateRequest);
  }

  @ApiBearerAuth()
  @Delete(':id')
  @UseGuards(AuthCookieGuardion)
  @HttpCode(HttpStatus.OK)
  async delete(@Param('id') id: string): Promise<void> {
    return this.lawsuitService.delete(id);
  }
}