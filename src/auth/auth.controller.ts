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
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { Usr } from '../user/user.decorator';
import {
  ChangeEmailRequest,
  ChangePasswordRequest,
  CheckEmailRequest,
  CheckEmailResponse,
  LoginRequest,
  LoginResponse,
  ResetPasswordRequest,
  SignupRequest,
} from './models';
import { UserResponse } from '../user/models';
import { AuthUser } from './auth-user';
import { JwtPayload } from './jwt-payload';
import { Request, Response } from 'express';

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
    };
    this.authService.setRefreshToken(jwtPayload, res);
    const accessToken = await this.authService.generateAccessToken(jwtPayload);
    return res.json(new LoginResponse(user, accessToken));
  }

  @ApiBearerAuth()
  @Get()
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard())
  async getUserWithToken(@Usr() user: AuthUser): Promise<UserResponse> {
    return UserResponse.fromUserEntity(user);
  }

  @ApiBearerAuth()
  @Post('change-email')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard())
  async sendChangeEmailMail(
    @Usr() user: AuthUser,
    @Body() changeEmailRequest: ChangeEmailRequest,
  ): Promise<void> {
    await this.authService.sendChangeEmailMail(
      changeEmailRequest,
      user.id,
      user.fullName,
      user.email,
    );
  }

  @Get('change-email')
  @HttpCode(HttpStatus.OK)
  async changeEmail(@Query('token') token: string): Promise<void> {
    await this.authService.changeEmail(token);
  }

  @Post('forgot-password/:email')
  @HttpCode(HttpStatus.OK)
  async sendResetPassword(@Param('email') email: string): Promise<void> {
    await this.authService.sendResetPasswordMail(email);
  }

  @Post('change-password')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard())
  async changePassword(
    @Body() changePasswordRequest: ChangePasswordRequest,
    @Usr() user: AuthUser,
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

  @Get('refresh')
  async refreshToken(@Req() req: Request, @Res() res: Response) {
    const refreshToken = req.cookies['refresh_token'];

    if (!refreshToken) {
      throw new UnauthorizedException('Nenhum refresh token encontrado');
    }

    const user = await this.authService.getUserFromToken(refreshToken);

    if (!user) {
      throw new UnauthorizedException('Refresh token inválido ou expirado');
    }

    const newAccessToken =
      await this.authService.refreshAccessToken(refreshToken);

    try {
      return res.json(new LoginResponse(user, newAccessToken));
    } catch (error) {
      Logger.error(`Falha ao renovar token: ${error.message}`);
      throw new UnauthorizedException('Falha ao renovar token');
    }
  }
}
