import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { PrismaService } from '../common/services/prisma.service';
import { UsefulLinkService } from './useful-link.service';
import { UsefulLinkController } from './useful-link.controller';
import { JwtModule } from '@nestjs/jwt';
import config from 'src/config';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: config.jwt.secretOrKey,
      signOptions: {
        expiresIn: config.jwt.expiresIn,
      },
    }),
  ],
  providers: [UsefulLinkService, PrismaService],
  exports: [UsefulLinkService],
  controllers: [UsefulLinkController],
})
export class UsefulLinkModule {}
