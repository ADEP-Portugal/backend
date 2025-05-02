import {
  LawsuitStatus,
  LawsuitOrderType,
  DocumentType,
  PaymentStatus,
  LawsuitType,
} from '@prisma/client';
import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateLawsuitRequest {
  @IsNotEmpty()
  @IsString()
  client: string;

  @IsDateString()
  @IsNotEmpty()
  @IsString()
  birthday: string;

  @IsNotEmpty()
  @IsString()
  phone: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  status: LawsuitStatus;

  @IsNotEmpty()
  @IsString()
  orderType: LawsuitOrderType;

  @IsOptional()
  @IsString()
  documentType: DocumentType;

  @IsOptional()
  @IsString()
  document: string;

  @IsOptional()
  @IsString()
  documentEmissionDate: string;

  @IsOptional()
  @IsString()
  documentExpirationDate: string;

  @IsDateString()
  @IsNotEmpty()
  @IsString()
  orderDate: string;

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

  @IsNotEmpty()
  @IsString()
  paymentStatus: PaymentStatus;

  @IsNotEmpty()
  @IsString()
  type: LawsuitType;

  @IsOptional()
  fileNames: string[];
}
