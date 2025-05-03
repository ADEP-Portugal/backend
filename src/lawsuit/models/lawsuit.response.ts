import type { DocumentType, Lawsuit, LawsuitOrderType, LawsuitStatus, LawsuitType, PaymentStatus, FileName, Prisma } from '@prisma/client';

type LawsuitWithFiles = Prisma.LawsuitGetPayload<{
  include: {
    fileNames: true;
  };
}>;


export class LawsuitResponse {
  id: string;

  client: string;

  birthday: Date;

  phone: string;

  email: string;

  orderType: LawsuitOrderType;

  status: LawsuitStatus;

  documentType: DocumentType | null;

  document: string | null;;

  description: string;

  responsible: string;

  orderDate: Date;

  deadline: Date;

  documentEmissionDate: Date | null;

  documentExpirationDate: Date | null;

  paymentStatus: PaymentStatus;

  type: LawsuitType;

  fileNames: FileName[];

  static fromLawsuitEntity(entity: LawsuitWithFiles, responsible: string): LawsuitResponse {
    const response = new LawsuitResponse();
    response.id = entity.id;
    response.client = entity.client;
    response.description = entity.description;
    response.responsible = responsible;
    response.birthday = entity.birthday;
    response.phone = entity.phone;
    response.email = entity.email;
    response.orderType = entity.orderType;
    response.status = entity.status;
    response.documentType = entity.documentType;
    response.document = entity.document;
    response.orderDate = entity.orderDate;
    response.deadline = entity.deadline;
    response.documentEmissionDate = entity.documentEmissionDate;
    response.documentExpirationDate = entity.documentExpirationDate;
    response.paymentStatus = entity.paymentStatus;
    response.type = entity.type;
    response.fileNames = entity.fileNames.map((fileName) => fileName.name);
    return response;
  }
}
