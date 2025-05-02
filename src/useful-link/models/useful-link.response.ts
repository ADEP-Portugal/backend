import type { Event, UsefulLink, UsefulLinkCategory } from '@prisma/client';

export class UsefulLinkResponse {
  id: string;

  title: string;

  url: string;

  category: UsefulLinkCategory;

  description: string | null;	

  static fromUsefulLinkEntity(entity: UsefulLink): UsefulLinkResponse {
    const response = new UsefulLinkResponse();
    response.id = entity.id;
    response.title = entity.title;
    response.url = entity.url;
    response.category = entity.category;
    response.description = entity.description;
    return response;
  }
}
