import type {
  DocumentType,
  Lawsuit,
  LawsuitOrderType,
  LawsuitStatus,
  LawsuitType,
  PaymentStatus,
} from '@prisma/client';

export class SummaryLawsuitResponse {
  id: string;

  client: string;

  orderType: LawsuitOrderType;

  static fromLawsuitEntity(entity: {
    id: string;
    client: string | null;
    orderType: LawsuitOrderType;
  }): SummaryLawsuitResponse {
    const response = new SummaryLawsuitResponse();
    response.id = entity.id;
    response.client = entity.client || '';
    response.orderType = entity.orderType;
    return response;
  }
}
