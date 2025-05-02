import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { JwtPayload } from 'src/auth/jwt-payload';
import config from 'src/config';
import { decrypt } from 'src/utils/crypto.util';

/**
 * retrieve the current user with a decorator
 * example of a controller method:
 * @Post()
 * someMethod(@Usr() user: User) {
 *   // do something with the user
 * }
 */
export const Usr = createParamDecorator(
  async (data: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest<Request>();
    const accessToken = req.signedCookies?.['auth_token'];

    if (!accessToken) {
      throw new UnauthorizedException('Auth token not found');
    }
    const payload: JwtPayload = new JwtService({
      secret: config.jwt.secretOrKey,
      signOptions: {
        expiresIn: config.jwt.expiresIn,
      },
    }).verify(decrypt(accessToken));

    if (!payload) {
      throw new UnauthorizedException('Invalid auth token');
    }

    return payload;
  },
);
