import { User } from '@prisma/client';
import { UserResponse } from 'src/user/models';

export class LoginResponse {
  token?: string;
  user: UserResponse;

  constructor(user: UserResponse, token?: string) {
    this.user = user;
    this.token = token;
  }
}
