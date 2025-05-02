import { LawsuitOrderType, Priority, Task, TaskStatus } from '@prisma/client';

export class TaskResponse {
  id: string;

  title: string;

  client: string;

  phone: string;

  priority: Priority;

  description: string;

  responsible: string;

  status: TaskStatus;

  deadline: Date;

  lawsuitClient: string;

  lawsuitOrderType: string;

  lawsuitId: string;

  static fromTaskEntity(
    entity: Task,
    responsible: string,
    lawsuit: { client: string; orderType: LawsuitOrderType, id: string } | null,
  ): TaskResponse {
    const response = new TaskResponse();
    response.id = entity.id;
    response.client = entity.client;
    response.description = entity.description;
    response.responsible = responsible;
    response.phone = entity.phone;
    response.deadline = entity.deadline;
    response.priority = entity.priority;
    response.status = entity.status;
    response.title = entity.title;
    if (lawsuit) {
      response.lawsuitClient = lawsuit.client;
      response.lawsuitOrderType = lawsuit.orderType;
      response.lawsuitId = lawsuit.id;
    }
    return response;
  }
}
