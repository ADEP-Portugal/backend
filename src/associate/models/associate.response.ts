import type {
  Associate,
  AvailabilityToWork,
  DocumentType,
  EducationLevel,
  Event,
  Gender,
  Nationality,
  QuotaStatus,
} from '@prisma/client';

export class AssociateResponse {
  id: string;

  fullName: string;

  email: string;

  gender: Gender;

  phone: string;

  birthday: Date;

  nationality: Nationality;

  educationLevel: EducationLevel;

  motherLanguage: string | null;

  availabilityToWork: AvailabilityToWork[];

  address: string;

  profissionalExperience: string | null;

  areaInterest: string[];

  associateNumber: string | null;

  cardExpirationDate: Date | null;

  quotaStatus: QuotaStatus;

  documentType: DocumentType | null;

  document: string | null;

  documentExpirationDate: Date | null;

  employmentStatus: string | null;

  nif: string | null;

  static fromAssociateEntity(entity: Associate): AssociateResponse {
    const response = new AssociateResponse();
    response.id = entity.id;
    response.fullName = entity.fullName;
    response.email = entity.email;
    response.gender = entity.gender;
    response.phone = entity.phone;
    response.birthday = entity.birthday;
    response.nationality = entity.nationality;
    response.educationLevel = entity.educationLevel;
    response.motherLanguage = entity.motherLanguage;
    response.availabilityToWork = entity.availabilityToWork;
    response.address = entity.address;
    response.profissionalExperience = entity.profissionalExperience;
    response.areaInterest = entity.areaInterest;
    response.associateNumber = entity.associateNumber;
    response.cardExpirationDate = entity.cardExpirationDate;
    response.quotaStatus = entity.quotaStatus;
    response.documentType = entity.documentType;
    response.document = entity.document;
    response.documentExpirationDate = entity.documentExpirationDate;
    response.employmentStatus = entity.employmentStatus;
    response.nif = entity.nif;
    return response;
  }
}
