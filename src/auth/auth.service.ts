import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JsonWebTokenError, JwtService, TokenExpiredError } from '@nestjs/jwt';
import { nanoid, customAlphabet } from 'nanoid';
import { Prisma } from '@prisma/client';
import { UserService } from '../user/user.service';
import { JwtPayload } from './jwt-payload';
import { MailSenderService } from '../mail-sender/mail-sender.service';
import {
  ChangeEmailRequest,
  ChangePasswordRequest,
  LoginRequest,
  LoginResponse,
  ResetPasswordRequest,
  SignupRequest,
} from './models';
import { AuthUser } from './auth-user';
import { PrismaService } from '../common/services/prisma.service';
import { Response } from 'express';
import { UserResponse } from 'src/user/models';
import { encrypt } from 'src/utils/crypto.util';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly mailSenderService: MailSenderService,
  ) {}

  async signup(signupRequest: SignupRequest): Promise<void> {
    // const emailVerificationToken = nanoid();

    try {
      await this.prisma.user.create({
        data: {
          email: signupRequest.email.toLowerCase(),
          passwordHash: await bcrypt.hash(signupRequest.password, 10),
          fullName: signupRequest.fullName,
        },
        select: null,
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2002') {
          throw new ConflictException();
        } else throw e;
      } else throw e;
    }

    // Implement email verification logic here if needed
    // await this.mailSenderService.sendVerifyEmailMail(
    //   signupRequest.fullName,
    //   signupRequest.email,
    //   emailVerificationToken,
    // );
  }

  async sendChangeEmailMail(
    changeEmailRequest: ChangeEmailRequest,
    userId: string,
    name: string,
    oldEmail: string,
  ): Promise<void> {
    const emailAvailable = await this.isEmailAvailable(
      changeEmailRequest.newEmail,
    );
    if (!emailAvailable) {
      Logger.log(
        `User with id ${userId} tried to change its email to already used ${changeEmailRequest.newEmail}`,
      );
      throw new ConflictException();
    }

    const deletePrevEmailChangeIfExist = this.prisma.emailChange.deleteMany({
      where: { userId },
    });

    const token = nanoid();

    const createEmailChange = this.prisma.emailChange.create({
      data: {
        userId,
        token,
        newEmail: changeEmailRequest.newEmail,
      },
      select: null,
    });

    await this.prisma.$transaction([
      deletePrevEmailChangeIfExist,
      createEmailChange,
    ]);

    await this.mailSenderService.sendChangeEmailMail(
      name,
      oldEmail,
      token,
      changeEmailRequest.newEmail,
    );
  }

  async changeEmail(token: string): Promise<void> {
    const emailChange = await this.prisma.emailChange.findUnique({
      where: { token },
    });

    if (emailChange !== null && emailChange.validUntil > new Date()) {
      await this.prisma.user.update({
        where: { id: emailChange.userId },
        data: {
          email: emailChange.newEmail.toLowerCase(),
        },
        select: null,
      });
    } else {
      Logger.log(`Invalid email change token ${token} is rejected.`);
      throw new NotFoundException();
    }
  }

  async sendResetPasswordMail(email: string): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      select: {
        id: true,
        fullName: true,
        email: true,
      },
    });

    if (user === null) {
      return; // Do not reveal if the email is registered or not
    }

    const deletePrevPasswordResetIfExist = this.prisma.passwordReset.deleteMany(
      {
        where: { userId: user.id },
      },
    );

    const token = nanoid();

    const createPasswordReset = this.prisma.passwordReset.create({
      data: {
        userId: user.id,
        token,
      },
      select: null,
    });

    await this.prisma.$transaction([
      deletePrevPasswordResetIfExist,
      createPasswordReset,
    ]);

    await this.mailSenderService.sendResetPasswordMail(
      user.fullName,
      user.email,
      token,
    );
  }

  async resetPassword(
    resetPasswordRequest: ResetPasswordRequest,
  ): Promise<void> {
    const passwordReset = await this.prisma.passwordReset.findUnique({
      where: { token: resetPasswordRequest.token },
    });

    if (passwordReset !== null && passwordReset.validUntil > new Date()) {
      await this.prisma.user.update({
        where: { id: passwordReset.userId },
        data: {
          passwordHash: await bcrypt.hash(resetPasswordRequest.newPassword, 10),
        },
        select: null,
      });
    } else {
      Logger.log(
        `Invalid reset password token ${resetPasswordRequest.token} is rejected`,
      );
      throw new NotFoundException();
    }
  }

  async changePassword(
    changePasswordRequest: ChangePasswordRequest,
    userId: string,
    name: string,
    email: string,
  ): Promise<void> {
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        passwordHash: await bcrypt.hash(changePasswordRequest.newPassword, 10),
      },
      select: null,
    });

    this.mailSenderService.sendPasswordChangeInfoMail(name, email);
  }

  async validateUser(payload: JwtPayload): Promise<AuthUser> {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.id },
    });

    if (user !== null && user.email === payload.email) {
      return user;
    }
    throw new UnauthorizedException();
  }

  async login(loginRequest: LoginRequest): Promise<UserResponse> {
    const normalizedIdentifier = loginRequest.email.toLowerCase();
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [
          {
            email: normalizedIdentifier,
          },
        ],
      },
      select: {
        id: true,
        passwordHash: true,
        email: true,
        fullName: true,
        role: true,
        registrationDate: true,
        imageUrl: true,
      },
    });

    if (
      user === null ||
      !bcrypt.compareSync(loginRequest.password, user.passwordHash)
    ) {
      throw new UnauthorizedException();
    }

    return UserResponse.fromUserEntity(user);
  }

  async isEmailAvailable(email: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      select: { email: true },
    });
    return user === null;
  }

  async setAuthToken(jwtPayload: JwtPayload, res: Response) {
    const token = await this.jwtService.signAsync(jwtPayload, {
      expiresIn: '1h',
    });
    res.cookie('auth_token', encrypt(token), {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      signed: true,
      path: '/',
      maxAge: 1000 * 60 * 60 * 24 * 30, // 1 month
    });
  }

  async getUserFromToken(token: string): Promise<UserResponse> {
    try {
      const payload: JwtPayload = this.jwtService.verify(token);
      const user = await this.prisma.user.findFirst({
        where: { id: payload.id },
        select: {
          id: true,
          email: true,
          passwordHash: true,
          fullName: true,
          role: true,
          imageUrl: true,
          registrationDate: true,
        },
      });
      if (user === null) {
        throw new UnauthorizedException();
      }
      return UserResponse.fromUserEntity(user);
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2002') {
          throw new ConflictException();
        } else throw e;
      } else if (e instanceof TokenExpiredError) {
        throw new UnauthorizedException();
      } else {
        throw e;
      }
    }
  }
}
