import { Injectable } from '@nestjs/common';
import { PrismaService } from './common/services/prisma.service';
import { PeriodFilter } from './types/period-filter';
import { getCurrentWeekRange, getCurrentMonthRange } from './utils/date.util';

@Injectable()
export class AppService {
  constructor(private readonly prisma: PrismaService) {}

  public async filterByDate(date: Date): Promise<{
    appointmentCount: number;
    taskCount: number;
    eventCount: number;
    associateCount: number;
    lawsuitCount: number;
  }> {
    let gte: Date = new Date(
      Date.UTC(
        date.getFullYear(),
        date.getMonth(),
        date.getDate() + 1,
        0,
        0,
        0,
      ),
    );
    let lte: Date = new Date(
      Date.UTC(
        date.getFullYear(),
        date.getMonth(),
        date.getDate() + 1,
        23,
        59,
        59,
      ),
    );
    return await this.generateReport(gte, lte);
  }

  public async filterByPeriod(period: PeriodFilter): Promise<{
    appointmentCount: number;
    taskCount: number;
    eventCount: number;
    associateCount: number;
    lawsuitCount: number;
  }> {
    let gte: Date | undefined = undefined;
    let lte: Date | undefined = undefined;
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
        break;
      default:
        break;
    }
    return await this.generateReport(gte, lte);
  }

  public async generateReport(gte: Date | undefined, lte: Date | undefined) {
    const appointmentCount = await this.prisma.appointment.count({
      where: {
        deletedAt: null,
        createdAt: {
          gte,
          lte,
        },
      },
    });
    const taskCount = await this.prisma.task.count({
      where: {
        deletedAt: null,
        createdAt: {
          gte,
          lte,
        },
      },
    });
    const eventCount = await this.prisma.event.count({
      where: {
        deletedAt: null,
        createdAt: {
          gte,
          lte,
        },
      },
    });
    const associateCount = await this.prisma.associate.count({
      where: {
        deletedAt: null,
        createdAt: {
          gte,
          lte,
        },
      },
    });
    const lawsuitCount = await this.prisma.lawsuit.count({
      where: {
        deletedAt: null,
        createdAt: {
          gte,
          lte,
        },
      },
    });
    return {
      appointmentCount: appointmentCount,
      taskCount: taskCount,
      eventCount: eventCount,
      associateCount: associateCount,
      lawsuitCount: lawsuitCount,
    };
  }
}
