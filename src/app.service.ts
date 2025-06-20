import { Injectable } from '@nestjs/common';
import { prisma } from './common/services/prisma.service';
import { PeriodFilter } from './types/period-filter';
import { getCurrentWeekRange, getCurrentMonthRange } from './utils/date.util';

@Injectable()
export class AppService {
  public async filterByDate(date: Date): Promise<{
    appointmentCount: number;
    taskCount: number;
    eventCount: number;
    associateCount: number;
    lawsuitCount: number;
    newAssociateCount: number;
  }> {
    let gte: Date = new Date(
      Date.UTC(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        0,
        0,
        0,
      ),
    );
    let lte: Date = new Date(
      Date.UTC(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
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
    newAssociateCount: number;
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
    const appointmentCount = await prisma.appointment.count({
      where: {
        deletedAt: null,
        createdAt: {
          gte,
          lte,
        },
      },
    });
    const taskCount = await prisma.task.count({
      where: {
        deletedAt: null,
        createdAt: {
          gte,
          lte,
        },
      },
    });
    const eventCount = await prisma.event.count({
      where: {
        deletedAt: null,
        createdAt: {
          gte,
          lte,
        },
      },
    });
    const associateCount = await prisma.associate.count({
      where: {
        deletedAt: null,
        createdAt: {
          lte,
        },
      },
    });
    const newAssociateCount = await prisma.associate.count({
      where: {
        deletedAt: null,
        createdAt: {
          gte,
          lte,
        },
      },
    });
    const lawsuitCount = await prisma.lawsuit.count({
      where: {
        deletedAt: null,
        createdAt: {
          gte,
          lte,
        },
      },
    });
    const lawsuits = await prisma.lawsuit.findMany({
      where: {
        deletedAt: null,
        createdAt: {
          gte,
          lte,
        },
      },
    });
    const documentCount = lawsuits.reduce(
      (count, lawsuit) => count + (lawsuit.fileNames?.length || 0),
      0,
    );
    return {
      appointmentCount: appointmentCount,
      taskCount: taskCount,
      eventCount: eventCount,
      associateCount: associateCount,
      lawsuitCount: lawsuitCount,
      documentCount: documentCount,
      newAssociateCount: newAssociateCount,
    };
  }
}
