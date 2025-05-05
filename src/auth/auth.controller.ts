import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Param,
  Post,
  Query,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { Usr } from '../user/user.decorator';
import {
  ChangeEmailRequest,
  ChangePasswordRequest,
  CheckEmailRequest,
  CheckEmailResponse,
  LoginRequest,
  ResetPasswordRequest,
  SignupRequest,
} from './models';
import { UserResponse } from '../user/models';
import { JwtPayload } from './jwt-payload';
import { Response } from 'express';
import { decrypt } from 'src/utils/crypto.util';
import { AuthCookieGuard } from 'src/common/guards/auth-cookie.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('check-email')
  @HttpCode(HttpStatus.OK)
  async checkEmailAvailability(
    @Body() checkEmailRequest: CheckEmailRequest,
  ): Promise<CheckEmailResponse> {
    const isAvailable = await this.authService.isEmailAvailable(
      checkEmailRequest.email,
    );
    return new CheckEmailResponse(isAvailable);
  }

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async signup(@Body() signupRequest: SignupRequest): Promise<void> {
    await this.authService.signup(signupRequest);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginRequest: LoginRequest, @Res() res: Response) {
    const user = await this.authService.login(loginRequest);
    const jwtPayload: JwtPayload = {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
    };
    await this.authService.setAuthToken(jwtPayload, res);
    return res.json(user);
  }

  @ApiBearerAuth()
  @Get()
  @HttpCode(HttpStatus.OK)
  async getUserWithToken(
    @AuthCookieGuard() accessToken: string,
  ): Promise<UserResponse> {
    return await this.authService.getUserFromToken(decrypt(accessToken));
  }

  @Post('forgot-password/:email')
  @HttpCode(HttpStatus.OK)
  async sendResetPassword(@Param('email') email: string): Promise<void> {
    await this.authService.sendResetPasswordMail(email);
  }

  @Post('change-password')
  @HttpCode(HttpStatus.OK)
  async changePassword(
    @Body() changePasswordRequest: ChangePasswordRequest,
    @Usr() user: JwtPayload,
  ): Promise<void> {
    await this.authService.changePassword(
      changePasswordRequest,
      user.id,
      user.fullName,
      user.email,
    );
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(
    @Body() resetPasswordRequest: ResetPasswordRequest,
  ): Promise<void> {
    await this.authService.resetPassword(resetPasswordRequest);
  }

  @Post('logout')
  logout(@Res() res: Response) {
    res.clearCookie('auth_token', {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });
    return res.json({ message: 'Logout realizado com sucesso' });
  }
}
