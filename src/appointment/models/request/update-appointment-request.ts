import { Gender } from '@prisma/client';
import {
  IsBoolean,
  IsDateString,
  IsMilitaryTime,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class UpdateAppointmentRequest {
  @IsNotEmpty()
  @IsString()
  client: string;

  @IsNotEmpty()
  @IsString()
  reason: string;

  @IsDateString()
  @IsNotEmpty()
  date: string;

  @IsNotEmpty()
  @IsMilitaryTime()
  time: string;

  @IsNotEmpty()
  @IsString()
  type: string;

  @IsNotEmpty()
  @IsString()
  responsible: string;

  @IsNotEmpty()
  @IsString()
  gender: Gender;

  @IsNotEmpty()
  @IsString()
  @MaxLength(500)
  description: string;

  @IsNotEmpty()
  @IsBoolean()
  associate: boolean;

  @IsOptional()
  @IsString()
  phone: string;
}
