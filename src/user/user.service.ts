import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../common/services/prisma.service';
import { AuthUser } from '../auth/auth-user';
import { UpdateUserRequest, UserResponse } from './models';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  public async getUserEntityById(id: string): Promise<AuthUser | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async updateUser(
    userId: string,
    updateRequest: UpdateUserRequest,
  ): Promise<UserResponse> {
    try {
      const updatedUser = await this.prisma.user.update({
        where: { id: userId },
        data: {
          ...updateRequest,
        },
      });

      return UserResponse.fromUserEntity(updatedUser);
    } catch (err) {
      Logger.error(JSON.stringify(err));
      throw new ConflictException();
    }
  }
}
