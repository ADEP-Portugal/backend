import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { prisma } from '../common/services/prisma.service';
import { CreateUsefulLinkRequest } from './models/request/create-useful-link-request';
import { UpdateUsefulLinkRequest } from './models/request/update-useful-link-request';
import { UsefulLinkResponse } from './models/useful-link.response';

@Injectable()
export class UsefulLinkService {
  public async fetchAll(
    title?: string,
  ): Promise<UsefulLinkResponse[]> {
    const usefulLinks = await prisma.usefulLink.findMany({
      where: {
        deletedAt: null,
        ...(title && {
          title: {
            contains: title,
            mode: 'insensitive',
          },
        }),
      },
    });
    return usefulLinks.map((usefulLink) => UsefulLinkResponse.fromUsefulLinkEntity(usefulLink));
  }

  public async fetchAllPaginated(
    page: number,
    limit: number,
    title?: string,
  ): Promise<{
    total: number;
    page: number;
    limit: number;
    data: UsefulLinkResponse[];
  }> {
    const whereClause: any = {
      deletedAt: null,
      ...(title && {
        title: {
          contains: title,
          mode: 'insensitive',
        },
      }),
    };
    const usefulLinks = await prisma.usefulLink.findMany({
      where: whereClause,
      skip: (page - 1) * limit,
      take: limit,
    });
    return {
      total: await prisma.usefulLink.count({
        where: whereClause,
      }),
      page,
      limit,
      data: usefulLinks.map((usefulLink) => UsefulLinkResponse.fromUsefulLinkEntity(usefulLink)),
    };
  }

  public async fetchById(id: string): Promise<UsefulLinkResponse> {
    try {
      const usefulLink = await prisma.usefulLink.findUnique({
        where: {
          id,
          deletedAt: null,
        },
      });

      if (!usefulLink) {
        throw new NotFoundException();
      }

      return UsefulLinkResponse.fromUsefulLinkEntity(usefulLink);
    } catch (err) {
      Logger.error(JSON.stringify(err));
      throw err;
    }
  }

  public async create(createRequest: CreateUsefulLinkRequest): Promise<void> {
    await prisma.usefulLink.create({
      data: createRequest,
    });
  }

  public async update(
    id: string,
    updateRequest: UpdateUsefulLinkRequest,
  ): Promise<UsefulLinkResponse> {
    try {
      const event = await prisma.usefulLink.findUnique({
        where: {
          id,
          deletedAt: null,
        },
      });

      if (!event) {
        throw new NotFoundException();
      }

      const updatedEvent = await prisma.usefulLink.update({
        where: {
          id,
        },
        data: updateRequest,
      });

      return UsefulLinkResponse.fromUsefulLinkEntity(updatedEvent);
    } catch (err) {
      Logger.error(JSON.stringify(err));
      throw err;
    }
  }

  public async delete(id: string): Promise<void> {
    try {
      const event = await prisma.usefulLink.findUnique({
        where: {
          id,
          deletedAt: null,
        },
      });

      if (!event) {
        throw new NotFoundException();
      }

      await prisma.usefulLink.update({
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
