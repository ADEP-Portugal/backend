import {
  IsDateString,
  IsMilitaryTime,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  MaxLength,
} from 'class-validator';

export class UpdateEventRequest {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsDateString()
  @IsNotEmpty()
  date: string;

  @IsNotEmpty()
  @IsMilitaryTime()
  time: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(500)
  location: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(500)
  description: string;
}
