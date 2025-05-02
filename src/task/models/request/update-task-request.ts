import { TaskStatus, Priority } from '@prisma/client';
import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateTaskRequest {
  @IsNotEmpty()
  @IsString()
  client: string;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  phone: string;

  @IsOptional()
  @IsString()
  priority: Priority;

  @IsOptional()
  @IsString()
  status: TaskStatus;

  @IsDateString()
  @IsNotEmpty()
  @IsString()
  deadline: string;

  @IsNotEmpty()
  @IsString()
  responsible: string;

  @IsNotEmpty()
  @IsString()
  description: string;
  
  @IsOptional()
  @IsString()
  lawsuitId: string;
}
