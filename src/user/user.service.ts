import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { prisma } from '../common/services/prisma.service';
import { AuthUser } from '../auth/auth-user';
import { UpdateUserRequest, UserResponse } from './models';
import { AppointmentResponse } from 'src/appointment/models';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  public async getUserEntityById(id: string): Promise<AuthUser | null> {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  public async fetchAll(): Promise<UserResponse[]> {
    const users = await prisma.user.findMany();
    return users.map((user) => UserResponse.fromUserEntity(user));
  }

  async updateUser(
    userId: string,
    updateRequest: UpdateUserRequest,
  ): Promise<UserResponse> {
    try {
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          ...updateRequest,
          passwordHash: updateRequest.passwordHash
            ? await bcrypt.hash(updateRequest.passwordHash, 10)
            : undefined,
        },
      });

      return UserResponse.fromUserEntity(updatedUser);
    } catch (err) {
      Logger.error(JSON.stringify(err));
      throw new ConflictException();
    }
  }
}
