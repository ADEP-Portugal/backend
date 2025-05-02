import { ExpirationDateAssociateRecord } from "./associate-record";

export class ExpirationDateAssociateResponse {
  id: string;

  fullName: string;

  documentExpirationDate: Date | null;

  static fromAssociateEntity(entity: ExpirationDateAssociateRecord): ExpirationDateAssociateResponse {
    const response = new ExpirationDateAssociateResponse();
    response.id = entity.id;
    response.fullName = entity.fullName;
    response.documentExpirationDate = entity.documentExpirationDate;
    return response;
  }
}
