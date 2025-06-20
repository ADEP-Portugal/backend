import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { prisma } from '../common/services/prisma.service';
import { EventResponse } from './models';
import { CreateEventRequest } from './models/request/create-event-request';
import { UpdateEventRequest } from './models/request/update-event-request';
import { PeriodFilter } from '../types/period-filter';
import { getCurrentMonthRange, getCurrentWeekRange } from 'src/utils/date.util';
import { AppointmentResponse } from 'src/appointment/models';

@Injectable()
export class EventService {
  public async fetchAll(
    name?: string,
    period?: PeriodFilter,
  ): Promise<EventResponse[]> {
    let gte: Date | undefined = undefined;
    let lte: Date | undefined = undefined;
    if (period) {
      switch (period) {
        case PeriodFilter.TODAY:
          gte = new Date();
          lte = new Date();
          break;
        case PeriodFilter.THIS_WEEK:
          const { startOfWeek, endOfWeek } = getCurrentWeekRange();
          gte = startOfWeek;
          lte = endOfWeek;
          break;
        case PeriodFilter.THIS_MONTH:
          const { startOfMonth, endOfMonth } = getCurrentMonthRange();
          gte = startOfMonth;
          lte = endOfMonth;
          break;
        case PeriodFilter.ALL:
          lte = undefined;
          break;
        default:
          lte = undefined;
          break;
      }
    }
    const events = await prisma.event.findMany({
      where: {
        deletedAt: null,
        ...(name && {
          name: {
            contains: name,
            mode: 'insensitive',
          },
        }),
        ...(period && {
          date: {
            gte,
            lte,
          },
        }),
      },
      orderBy: {
        date: 'desc',
      },
    });
    return events.map((event) => EventResponse.fromEventEntity(event));
  }

  public async fetchAllPaginated(
    page: number,
    limit: number,
    name?: string,
    period?: PeriodFilter,
  ): Promise<{
    total: number;
    page: number;
    limit: number;
    data: EventResponse[];
  }> {
    let gte: Date | undefined = undefined;
    let lte: Date | undefined = undefined;
    if (period) {
      switch (period) {
        case PeriodFilter.TODAY:
          gte = new Date();
          lte = new Date();
          break;
        case PeriodFilter.THIS_WEEK:
          const { startOfWeek, endOfWeek } = getCurrentWeekRange();
          gte = startOfWeek;
          lte = endOfWeek;
          break;
        case PeriodFilter.THIS_MONTH:
          const { startOfMonth, endOfMonth } = getCurrentMonthRange();
          gte = startOfMonth;
          lte = endOfMonth;
          break;
        case PeriodFilter.ALL:
          lte = undefined;
          break;
        default:
          lte = undefined;
          break;
      }
    }
    const whereClause: any = {
      deletedAt: null,
      ...(name && {
        name: {
          contains: name,
          mode: 'insensitive',
        },
      }),
      ...(period && {
        date: {
          gte,
          lte,
        },
      }),
    };
    const events = await prisma.event.findMany({
      where: whereClause,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: {
        date: 'desc',
      },
    });
    return {
      total: await prisma.event.count({
        where: whereClause,
      }),
      page,
      limit,
      data: events.map((event) => EventResponse.fromEventEntity(event)),
    };
  }

  public async fetchById(id: string): Promise<EventResponse> {
    try {
      const event = await prisma.event.findUnique({
        where: {
          id,
          deletedAt: null,
        },
      });

      if (!event) {
        throw new NotFoundException();
      }

      return EventResponse.fromEventEntity(event);
    } catch (err) {
      Logger.error(JSON.stringify(err));
      throw err;
    }
  }

  public async create(createRequest: CreateEventRequest): Promise<void> {
    await prisma.event.create({
      data: {
        ...createRequest,
        date: new Date(createRequest.date),
      },
    });
  }

  public async update(
    id: string,
    updateRequest: UpdateEventRequest,
  ): Promise<EventResponse> {
    try {
      const event = await prisma.event.findUnique({
        where: {
          id,
          deletedAt: null,
        },
      });

      if (!event) {
        throw new NotFoundException();
      }

      const updatedEvent = await prisma.event.update({
        where: {
          id,
        },
        data: {
          ...updateRequest,
          date: new Date(updateRequest.date),
          updatedAt: new Date(),
        },
      });

      return EventResponse.fromEventEntity(updatedEvent);
    } catch (err) {
      Logger.error(JSON.stringify(err));
      throw err;
    }
  }

  public async delete(id: string): Promise<void> {
    try {
      const event = await prisma.event.findUnique({
        where: {
          id,
          deletedAt: null,
        },
      });

      if (!event) {
        throw new NotFoundException();
      }

      await prisma.event.update({
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
