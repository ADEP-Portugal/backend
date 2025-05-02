import type { Event } from '@prisma/client';

export class EventResponse {
  id: string;

  name: string;

  date: Date;

  time: string;

  location: string;

  description: string;

  static fromEventEntity(entity: Event): EventResponse {
    const response = new EventResponse();
    response.id = entity.id;
    response.name = entity.name;
    response.date = entity.date;
    response.time = entity.time;
    response.location = entity.location;
    response.description = entity.description;
    return response;
  }
}
