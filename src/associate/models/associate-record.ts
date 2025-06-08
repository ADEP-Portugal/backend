import { Gender } from '@prisma/client';

export class AssociateRecord {
  id: string;

  fullName: string;

  phone: string;

  gender: Gender | null;

  birthday: Date;

  email: string;

  document: string | null;
  
  documentType: string | null;

  documentExpirationDate: Date | null;
  
  documentEmissionDate: Date | null;
}

export class ExpirationDateAssociateRecord {
  id: string;

  fullName: string;

  documentExpirationDate: Date | null;
}
