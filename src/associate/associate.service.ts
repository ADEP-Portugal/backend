import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { prisma } from '../common/services/prisma.service';
import { AssociateResponse, UpdateAssociateRequest } from './models';
import { CreateAssociateRequest } from './models/request/create-associate-request';
import { SummaryAssociateResponse } from './models/summary-associate.response';
import { PeriodFilter } from 'src/types/period-filter';
import { getCurrentWeekRange, getCurrentMonthRange } from 'src/utils/date.util';
import { Associate } from '@prisma/client';
import { ExpirationDateAssociateResponse } from './models/expiration-date-associate.response';

@Injectable()
export class AssociateService {
  public async fetchExpirationDate(): Promise<
    ExpirationDateAssociateResponse[]
  > {
    const today = new Date();
    let gte: Date = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
    );
    let lte: Date = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      today.getDate(),
    );
    const expirationDateAssociates = await prisma.associate.findMany({
      where: {
        deletedAt: null,
        documentExpirationDate: {
          gte,
          lte,
        },
      },
      select: {
        id: true,
        fullName: true,
        documentExpirationDate: true,
      },
    });
    return expirationDateAssociates.map((expirationDateAssociate) =>
      ExpirationDateAssociateResponse.fromAssociateEntity(
        expirationDateAssociate,
      ),
    );
  }

  public async fetchSummary(): Promise<SummaryAssociateResponse[]> {
    const summaryAssociates = await prisma.associate.findMany({
      where: {
        deletedAt: null,
      },
      select: {
        id: true,
        fullName: true,
        phone: true,
        gender: true,
        birthday: true,
        email: true,
        document: true,
        documentType: true,
        documentExpirationDate: true,
        documentEmissionDate: true,
      },
    });
    return summaryAssociates.map((summaryAssociate) =>
      SummaryAssociateResponse.fromAssociateEntity(summaryAssociate),
    );
  }

  public async fetchAll(
    name?: string,
    birthdayPeriod?: PeriodFilter,
    phone?: string,
    associateNumber?: string,
  ): Promise<AssociateResponse[]> {
    let day: number | undefined = undefined;
    let month: number | undefined = undefined;
    const params: any[] = [];
    let query = `
        SELECT *
        FROM "associate"
      WHERE "deletedAt" IS NULL
    `;
    if (name) {
      params.push(`${name}%`);
      query += ` AND "fullName" ILIKE $${params.length}`;
    }
    if (phone) {
      params.push(`${phone}%`);
      query += ` AND "phone" ILIKE $${params.length}`;
    }
    if (associateNumber) {
      params.push(`${associateNumber}%`);
      query += ` AND "associateNumber" ILIKE $${params.length}`;
    }
    if (birthdayPeriod) {
      const today = new Date();
      day = today.getDate() + 1;
      month = today.getMonth() + 1;
      params.push(day);
      query += ` AND EXTRACT(DAY FROM "birthday") = $${params.length}`;
      params.push(month);
      query += ` AND EXTRACT(MONTH FROM "birthday") = $${params.length}`;
    }
    query += `
      ORDER BY "associateNumber" DESC
    `;
    const associates: Array<Associate> = await prisma.$queryRawUnsafe(
      query,
      ...params,
    );
    return associates.map((associate) =>
      AssociateResponse.fromAssociateEntity(associate),
    );
  }

  public async fetchAllPaginated(
    page: number,
    limit: number,
    name?: string,
    birthdayPeriod?: PeriodFilter,
  ): Promise<{
    total: number;
    page: number;
    limit: number;
    data: AssociateResponse[];
  }> {
    let gte: Date | undefined = undefined;
    let lte: Date | undefined = undefined;
    if (birthdayPeriod) {
      switch (birthdayPeriod) {
        case PeriodFilter.TODAY:
          const today = new Date();
          const day = today.getDate();
          gte = new Date(1900, today.getMonth(), day);
          lte = new Date(2100, today.getMonth(), day, 23, 59, 59);
          break;
        case PeriodFilter.TOMORROW:
          const todayTomorrow = new Date();
          const dayTomorrow = todayTomorrow.getDate() + 1;
          gte = new Date(1900, todayTomorrow.getMonth(), dayTomorrow);
          lte = new Date(
            2100,
            todayTomorrow.getMonth(),
            dayTomorrow,
            23,
            59,
            59,
          );
          break;
        case PeriodFilter.THIS_WEEK:
          const { startOfWeek, endOfWeek } = getCurrentWeekRange();
          gte = new Date(1900, startOfWeek.getMonth(), startOfWeek.getDate());
          lte = new Date(
            2100,
            endOfWeek.getMonth(),
            endOfWeek.getDate(),
            23,
            59,
            59,
          );
          break;
        case PeriodFilter.THIS_MONTH:
          const { startOfMonth, endOfMonth } = getCurrentMonthRange();
          gte = new Date(1900, startOfMonth.getMonth(), startOfMonth.getDate());
          lte = new Date(
            2100,
            endOfMonth.getMonth(),
            endOfMonth.getDate(),
            23,
            59,
            59,
          );
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
        fullName: {
          startsWith: name,
          mode: 'insensitive',
        },
      }),
      ...(birthdayPeriod && {
        birthday: {
          gte,
          lte,
        },
      }),
    };
    const associates = await prisma.associate.findMany({
      where: whereClause,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: {
        associateNumber: 'desc',
      },
    });
    return {
      total: await prisma.associate.count({
        where: whereClause,
      }),
      page,
      limit,
      data: associates.map((associate) =>
        AssociateResponse.fromAssociateEntity(associate),
      ),
    };
  }

  public async fetchById(id: string): Promise<AssociateResponse> {
    try {
      const event = await prisma.associate.findUnique({
        where: {
          id,
          deletedAt: null,
        },
      });

      if (!event) {
        throw new NotFoundException();
      }

      return AssociateResponse.fromAssociateEntity(event);
    } catch (err) {
      Logger.error(JSON.stringify(err));
      throw err;
    }
  }

  public async create(createRequest: CreateAssociateRequest): Promise<void> {
    await prisma.associate.create({
      data: {
        ...createRequest,
        cardExpirationDate:
          createRequest.cardExpirationDate != null
            ? new Date(createRequest.cardExpirationDate)
            : null,
        birthday: new Date(createRequest.birthday),
        documentExpirationDate:
          createRequest.documentExpirationDate != null
            ? new Date(createRequest.documentExpirationDate)
            : null,
      },
    });
  }

  public async update(
    id: string,
    updateRequest: UpdateAssociateRequest,
  ): Promise<AssociateResponse> {
    try {
      const event = await prisma.associate.findUnique({
        where: {
          id,
          deletedAt: null,
        },
      });

      if (!event) {
        throw new NotFoundException();
      }

      const updatedEvent = await prisma.associate.update({
        where: {
          id,
        },
        data: {
          ...updateRequest,
          updatedAt: new Date(),
          cardExpirationDate:
            updateRequest.cardExpirationDate == null
              ? null
              : new Date(updateRequest.cardExpirationDate),
          birthday: new Date(updateRequest.birthday),
          documentExpirationDate:
            updateRequest.documentExpirationDate == null
              ? null
              : new Date(updateRequest.documentExpirationDate),
        },
      });

      return AssociateResponse.fromAssociateEntity(updatedEvent);
    } catch (err) {
      Logger.error(JSON.stringify(err));
      throw err;
    }
  }

  public async delete(id: string): Promise<void> {
    try {
      const event = await prisma.associate.findUnique({
        where: {
          id,
          deletedAt: null,
        },
      });

      if (!event) {
        throw new NotFoundException();
      }

      await prisma.associate.update({
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
