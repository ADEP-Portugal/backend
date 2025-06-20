import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { prisma } from '../common/services/prisma.service';
import {
  LawsuitResponse,
  CreateLawsuitRequest,
  UpdateLawsuitRequest,
} from './models';
import { SummaryLawsuitResponse } from './models/summary-lawsuit.response';
import { PeriodFilter } from 'src/types/period-filter';
import { getCurrentWeekRange, getCurrentMonthRange } from 'src/utils/date.util';
import { LawsuitStatus } from '@prisma/client';

@Injectable()
export class LawsuitService {
  public async fetchSummary(): Promise<SummaryLawsuitResponse[]> {
    const summaryLawsuits = await prisma.lawsuit.findMany({
      where: {
        deletedAt: null,
      },
      select: {
        id: true,
        client: true,
        orderType: true,
      },
    });
    return summaryLawsuits.map((summaryLawsuit) =>
      SummaryLawsuitResponse.fromLawsuitEntity(summaryLawsuit),
    );
  }

  public async fetchAll(
    client?: string,
    period?: PeriodFilter,
    archived?: boolean,
  ): Promise<LawsuitResponse[]> {
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
    const lawsuits = await prisma.lawsuit.findMany({
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
            mode: 'insensitive',
          },
        }),
        ...(period && {
          orderDate: {
            gte,
            lte,
          },
        }),
        ...(archived
          ? {
              status: { equals: LawsuitStatus.ARCHIVED },
            }
          : {
              status: {
                not: LawsuitStatus.ARCHIVED,
              },
            }),
      },
      orderBy: {
        orderDate: 'desc',
      },
    });
    return lawsuits.map((lawsuit) =>
      LawsuitResponse.fromLawsuitEntity(lawsuit, lawsuit.user.fullName),
    );
  }

  public async fetchAllPaginated(
    page: number,
    limit: number,
    client?: string,
    period?: PeriodFilter,
    archived?: boolean,
  ): Promise<{
    total: number;
    page: number;
    limit: number;
    data: LawsuitResponse[];
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
        orderDate: {
          gte,
          lte,
        },
      }),
      ...(archived
        ? {
            status: {
              equals: LawsuitStatus.ARCHIVED,
            },
          }
        : {
            status: {
              not: LawsuitStatus.ARCHIVED,
            },
          }),
    };
    const lawsuits = await prisma.lawsuit.findMany({
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
        orderDate: 'desc',
      },
    });
    return {
      total: await prisma.lawsuit.count({
        where: whereClause,
      }),
      page,
      limit,
      data: lawsuits.map((lawsuit) =>
        LawsuitResponse.fromLawsuitEntity(lawsuit, lawsuit.user.fullName),
      ),
    };
  }

  public async fetchById(id: string): Promise<LawsuitResponse> {
    try {
      const lawsuit = await prisma.lawsuit.findUnique({
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

      if (!lawsuit) {
        throw new NotFoundException();
      }

      return LawsuitResponse.fromLawsuitEntity(lawsuit, lawsuit.user.fullName);
    } catch (err) {
      Logger.error(JSON.stringify(err));
      throw err;
    }
  }

  public async create(createRequest: CreateLawsuitRequest): Promise<void> {
    await prisma.lawsuit.create({
      data: {
        ...createRequest,
        ...(createRequest.documentEmissionDate &&
          createRequest.documentEmissionDate != '' && {
            documentEmissionDate: new Date(createRequest.documentEmissionDate),
          }),
        ...(createRequest.documentExpirationDate && {
          documentExpirationDate: new Date(
            createRequest.documentExpirationDate,
          ),
        }),
        birthday: new Date(createRequest.birthday),
        orderDate: new Date(createRequest.orderDate),
        deadline: new Date(createRequest.deadline),
      },
    });
  }

  public async update(
    id: string,
    updateRequest: UpdateLawsuitRequest,
  ): Promise<LawsuitResponse> {
    try {
      const appointment = await prisma.lawsuit.findUnique({
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

      const updatedAppointment = await prisma.lawsuit.update({
        where: {
          id,
        },
        data: {
          ...updateRequest,
          ...(updateRequest.documentEmissionDate && {
            documentEmissionDate: new Date(updateRequest.documentEmissionDate),
          }),
          ...(updateRequest.documentExpirationDate && {
            documentExpirationDate: new Date(
              updateRequest.documentExpirationDate,
            ),
          }),
          birthday: new Date(updateRequest.birthday),
          orderDate: new Date(updateRequest.orderDate),
          deadline: new Date(updateRequest.deadline),
          updatedAt: new Date(),
        },
      });

      return LawsuitResponse.fromLawsuitEntity(
        updatedAppointment,
        appointment.user.fullName,
      );
    } catch (err) {
      Logger.error(JSON.stringify(err));
      throw err;
    }
  }

  public async delete(id: string): Promise<void> {
    try {
      const lawsuit = await prisma.lawsuit.findUnique({
        where: {
          id,
          deletedAt: null,
        },
      });

      if (!lawsuit) {
        throw new NotFoundException();
      }

      await prisma.lawsuit.update({
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
