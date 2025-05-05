import {
  AvailabilityToWork,
  DocumentType,
  EducationLevel,
  Gender,
  QuotaStatus,
} from '@prisma/client';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';

export class CreateAssociateRequest {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  fullName: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  gender: Gender;

  @IsNotEmpty()
  @IsString()
  phone: string;

  @IsNotEmpty()
  @IsString()
  birthday: string;

  @IsNotEmpty()
  @IsString()
  nationality: string;

  @IsNotEmpty()
  @IsString()
  educationLevel: EducationLevel;

  @IsOptional()
  @IsString()
  motherLanguage: string;

  @IsOptional()
  availabilityToWork: AvailabilityToWork[];

  @IsNotEmpty()
  @IsString()
  address: string;

  @IsOptional()
  @IsString()
  profissionalExperience: string;

  @IsOptional()
  areaInterest: string[];

  @IsOptional()
  @IsString()
  associateNumber: string;

  @IsOptional()
  @IsString()
  cardExpirationDate: string;

  @IsOptional()
  @IsString()
  quotaStatus: QuotaStatus;

  @IsOptional()
  @IsString()
  documentType: DocumentType;

  @IsOptional()
  @IsString()
  document: string;

  @IsOptional()
  @IsString()
  documentExpirationDate: string;

  @IsOptional()
  @IsString()
  employmentStatus: string;

  @IsOptional()
  @IsString()
  nif: string;
}
