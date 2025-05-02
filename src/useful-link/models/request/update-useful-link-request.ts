import { UsefulLinkCategory } from '@prisma/client';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class UpdateUsefulLinkRequest {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  url: string;

  @IsNotEmpty()
  @IsString()
  category: UsefulLinkCategory;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description: string;
}
