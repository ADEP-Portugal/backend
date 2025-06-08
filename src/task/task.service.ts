import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { prisma } from '../common/services/prisma.service';
import { TaskResponse, CreateTaskRequest, UpdateTaskRequest } from './models';
import { Priority, TaskStatus } from '@prisma/client';

@Injectable()
export class TaskService {
  public async fetchAll(
    client?: string,
    status?: string,
    priority?: string,
  ): Promise<TaskResponse[]> {
    const tasks = await prisma.task.findMany({
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
            mode: 'insensitive',
          },
        }),
        ...(status &&
          status !== 'ALL' && {
            status: status as TaskStatus,
          }),
        ...(priority &&
          priority !== 'ALL' && {
            priority: priority as Priority,
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
    status?: string,
    priority?: string,
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
          mode: 'insensitive',
        },
      }),
      ...(status &&
        status !== 'ALL' && {
          status: status as TaskStatus,
        }),
      ...(priority &&
        priority !== 'ALL' && {
          priority: priority as Priority,
        }),
    };
    const tasks = await prisma.task.findMany({
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
      total: await prisma.task.count({
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
      const task = await prisma.task.findUnique({
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
    await prisma.task.create({
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
      const task = await prisma.task.findUnique({
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

      const updatedAppointment = await prisma.task.update({
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
      const task = await prisma.task.findUnique({
        where: {
          id,
          deletedAt: null,
        },
      });

      if (!task) {
        throw new NotFoundException();
      }

      await prisma.task.update({
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
