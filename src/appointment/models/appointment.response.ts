import type { Appointment } from '@prisma/client';

export class AppointmentResponse {
  id: string;

  client: string;

  reason: string;

  date: Date;

  time: string;

  type: string;

  description: string;

  responsible: string;

  userId: string;

  gender: string;

  associate: boolean;

  phone: string | undefined;

  static fromAppointmentEntity(entity: Appointment, userId: string, responsible: string): AppointmentResponse {
    const response = new AppointmentResponse();
    response.id = entity.id;
    response.client = entity.client;
    response.date = entity.date;
    response.time = entity.time;
    response.reason = entity.reason;
    response.type = entity.type;
    response.description = entity.description;
    response.userId = userId;
    response.responsible = responsible;
    response.gender = entity.gender;
    response.associate = entity.associate;
    response.phone = entity.phone;
    return response;
  }
}
