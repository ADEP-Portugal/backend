import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { PrismaService } from '../common/services/prisma.service';
import { EventService } from './event.service';
import { EventController } from './event.controller';
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
  providers: [EventService, PrismaService],
  exports: [EventService],
  controllers: [EventController],
})
export class EventModule {}
