import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/services/prisma.service';
import { TaskResponse, CreateTaskRequest, UpdateTaskRequest } from './models';
import { Prisma } from '@prisma/client';

type TaskWithUserAndLawsuit = Prisma.TaskGetPayload<{
  include: {
    user: {
      select: {
        id: true;
        fullName: true;
      };
    };
    lawsuit: {
      select: {
        id: true;
        client: true;
        orderType: true;
      };
    };
  };
}>;

@Injectable()
export class TaskService {
  constructor(private readonly prisma: PrismaService) {}

  public async fetchAll(client?: string): Promise<TaskResponse[]> {
    const tasks: TaskWithUserAndLawsuit[] = await this.prisma.task.findMany({
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
          },
        },
        lawsuit: {
          select: {
            id: true,
            client: true,
            orderType: true,
          },
        },
      },
      where: {
        deletedAt: null,
        ...(client && {
          client: {
            contains: client,
          },
        }),
      },
    });
    return tasks.map((task) =>
      TaskResponse.fromTaskEntity(task, task.user.fullName, task.lawsuit),
    );
  }

  public async fetchAllPaginated(
    page: number,
    limit: number,
    client?: string,
  ): Promise<{
    total: number;
    page: number;
    limit: number;
    data: TaskResponse[];
  }> {
    const whereClause: any = {
      deletedAt: null,
      ...(client && {
        client: {
          contains: client,
        },
      }),
    };
    const tasks = await this.prisma.task.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
          },
        },
        lawsuit: {
          select: {
            id: true,
            client: true,
            orderType: true,
          },
        },
      },
      skip: (page - 1) * limit,
      take: limit,
    });
    return {
      total: await this.prisma.task.count({
        where: whereClause,
      }),
      page,
      limit,
      data: tasks.map((task) =>
        TaskResponse.fromTaskEntity(task, task.user.fullName, task.lawsuit),
      ),
    };
  }

  public async fetchById(id: string): Promise<TaskResponse> {
    try {
      const task = await this.prisma.task.findUnique({
        include: {
          user: {
            select: {
              id: true,
              fullName: true,
            },
          },
          lawsuit: {
            select: {
              id: true,
              client: true,
              orderType: true,
            },
          },
        },
        where: {
          id,
          deletedAt: null,
        },
      });

      if (!task) {
        throw new NotFoundException();
      }

      return TaskResponse.fromTaskEntity(
        task,
        task.user.fullName,
        task.lawsuit,
      );
    } catch (err) {
      Logger.error(JSON.stringify(err));
      throw err;
    }
  }

  public async create(createRequest: CreateTaskRequest): Promise<void> {
    await this.prisma.task.create({
      data: {
        ...createRequest,
        deadline: new Date(createRequest.deadline),
      },
    });
  }

  public async update(
    id: string,
    updateRequest: UpdateTaskRequest,
  ): Promise<TaskResponse> {
    try {
      const task = await this.prisma.task.findUnique({
        include: {
          user: {
            select: {
              id: true,
              fullName: true,
            },
          },
          lawsuit: {
            select: {
              id: true,
              client: true,
              orderType: true,
            },
          },
        },
        where: {
          id,
          deletedAt: null,
        },
      });

      if (!task) {
        throw new NotFoundException();
      }

      const updatedAppointment = await this.prisma.task.update({
        where: {
          id,
        },
        data: {
          ...updateRequest,
          deadline: new Date(updateRequest.deadline),
        },
      });

      return TaskResponse.fromTaskEntity(
        updatedAppointment,
        task.user.fullName,
        task.lawsuit,
      );
    } catch (err) {
      Logger.error(JSON.stringify(err));
      throw err;
    }
  }

  public async delete(id: string): Promise<void> {
    try {
      const task = await this.prisma.task.findUnique({
        where: {
          id,
          deletedAt: null,
        },
      });

      if (!task) {
        throw new NotFoundException();
      }

      await this.prisma.task.update({
        where: {
          id,
        },
        data: {
          deletedAt: new Date(),
        },
      });
    } catch (err) {
      Logger.error(JSON.stringify(err));
      throw err;
    }
  }
}
