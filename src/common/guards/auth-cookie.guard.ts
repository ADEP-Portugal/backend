import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
  CanActivate,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { decrypt } from 'src/utils/crypto.util';

export const AuthCookieGuard = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest<Request>();
    const accessToken = req.signedCookies?.['auth_token'];

    if (!accessToken) {
      throw new UnauthorizedException('Auth token not found');
    }

    return accessToken;
  },
);

@Injectable()
export class AuthCookieGuardion implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = request.signedCookies?.['auth_token'];

    if (!token) throw new UnauthorizedException('Token ausente');

    try {
      const payload = await this.jwtService.verifyAsync(decrypt(token));
      request['user'] = payload;
      return true;
    } catch {
      throw new UnauthorizedException('Token inválido');
    }
  }
}
