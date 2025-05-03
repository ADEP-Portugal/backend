import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/services/prisma.service';
import { getCurrentMonthRange, getCurrentWeekRange } from 'src/utils/date.util';
import {
  AppointmentResponse,
  CreateAppointmentRequest,
  UpdateAppointmentRequest,
} from './models';
import { PeriodFilter } from 'src/types/period-filter';
import { AppointmentType } from '@prisma/client';

@Injectable()
export class AppointmentService {
  constructor(private readonly prisma: PrismaService) {}

  public async fetchAll(
    client?: string,
    period?: PeriodFilter,
  ): Promise<AppointmentResponse[]> {
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
    const appointments = await this.prisma.appointment.findMany({
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
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
    return appointments.map((appointment) =>
      AppointmentResponse.fromAppointmentEntity(
        appointment,
        appointment.user.id,
        appointment.user.fullName,
      ),
    );
  }

  public async fetchAllPaginated(
    page: number,
    limit: number,
    client?: string,
    period?: PeriodFilter,
  ): Promise<{
    total: number;
    page: number;
    limit: number;
    data: AppointmentResponse[];
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
      ...(client && {
        client: {
          contains: client,
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
    const appointments = await this.prisma.appointment.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
          },
        },
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: {
        date: 'desc',
      },
    });
    return {
      total: await this.prisma.appointment.count({
        where: whereClause,
      }),
      page,
      limit,
      data: appointments.map((appointment) =>
        AppointmentResponse.fromAppointmentEntity(
          appointment,
          appointment.user.id,
          appointment.user.fullName,
        ),
      ),
    };
  }

  public async fetchById(id: string): Promise<AppointmentResponse> {
    try {
      const appointment = await this.prisma.appointment.findUnique({
        include: {
          user: {
            select: {
              id: true,
              fullName: true,
            },
          },
        },
        where: {
          id,
          deletedAt: null,
        },
      });

      if (!appointment) {
        throw new NotFoundException();
      }

      return AppointmentResponse.fromAppointmentEntity(
        appointment,
        appointment.user.id,
        appointment.user.fullName,
      );
    } catch (err) {
      Logger.error(JSON.stringify(err));
      throw err;
    }
  }

  public async create(createRequest: CreateAppointmentRequest): Promise<void> {
    await this.prisma.appointment.create({
      data: {
        ...createRequest,
        date: new Date(createRequest.date),
        type: createRequest.type as AppointmentType,
      },
    });
  }

  public async update(
    id: string,
    updateRequest: UpdateAppointmentRequest,
  ): Promise<AppointmentResponse> {
    try {
      const appointment = await this.prisma.appointment.findUnique({
        include: {
          user: {
            select: {
              id: true,
              fullName: true,
            },
          },
        },
        where: {
          id,
          deletedAt: null,
        },
      });

      if (!appointment) {
        throw new NotFoundException();
      }

      const updatedAppointment = await this.prisma.appointment.update({
        where: {
          id,
        },
        data: {
          ...updateRequest,
          date: new Date(updateRequest.date),
          type: updateRequest.type as AppointmentType,
          updatedAt: new Date(),
        },
      });

      return AppointmentResponse.fromAppointmentEntity(
        updatedAppointment,
        appointment.user.id,
        appointment.user.fullName,
      );
    } catch (err) {
      Logger.error(JSON.stringify(err));
      throw err;
    }
  }

  public async delete(id: string): Promise<void> {
    try {
      const appointment = await this.prisma.appointment.findUnique({
        where: {
          id,
          deletedAt: null,
        },
      });

      if (!appointment) {
        throw new NotFoundException();
      }

      await this.prisma.appointment.update({
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
