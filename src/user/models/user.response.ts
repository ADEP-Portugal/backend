import type { User } from '@prisma/client';

export class UserResponse {
  id: string;

  email: string;

  // emailVerified: boolean;

  fullName: string;

  imageUrl?: string | null;

  // birthDate: Date | null; // ISO Date

  static fromUserEntity(entity: User): UserResponse {
    const response = new UserResponse();
    response.id = entity.id;
    response.email = entity.email;
    response.fullName = entity.fullName;
    if(entity.imageUrl !== null) {
      response.imageUrl = entity.imageUrl;
    }
    return response;
  }
}
