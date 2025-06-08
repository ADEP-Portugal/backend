import { AssociateRecord } from "./associate-record";

export class SummaryAssociateResponse {
  id: string;

  fullName: string;

  phone: string;

  gender: string | null;

  birthday: Date;

  email: string;

  document: string | null;

  documentType: string | null;

  documentExpirationDate: Date | null;

  documentEmissionDate: Date | null;

  static fromAssociateEntity(entity: AssociateRecord): SummaryAssociateResponse {
    const response = new SummaryAssociateResponse();
    response.id = entity.id;
    response.fullName = entity.fullName;
    response.phone = entity.phone;
    response.gender = entity.gender;
    response.birthday = entity.birthday;
    response.email = entity.email;
    response.document = entity.document;
    response.documentType = entity.documentType;
    response.documentExpirationDate = entity.documentExpirationDate;
    response.documentEmissionDate = entity.documentEmissionDate;
    return response;
  }
}
