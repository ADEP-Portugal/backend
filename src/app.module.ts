import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { MailSenderModule } from './mail-sender/mail-sender.module';
import { ThrottlerBehindProxyGuard } from './common/guards/throttler-behind-proxy.guard';
import { AppController } from './app.controller';
import { EventModule } from './event/event.module';
import { AppointmentModule } from './appointment/appointment.module';
import { AssociateModule } from './associate/associate.module';
import { LawsuitModule } from './lawsuit/lawsuit.module';
import { TaskModule } from './task/task.module';
import { UsefulLinkModule } from './useful-link/useful-link.module';
import { AppService } from './app.service';
import { PrismaService } from './common/services/prisma.service';
import { FileModule } from './file/file.module';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60,
          limit: 50,
        },
      ],
    }),
    UserModule,
    AuthModule,
    MailSenderModule,
    EventModule,
    AppointmentModule,
    AssociateModule,
    LawsuitModule,
    TaskModule,
    UsefulLinkModule,
    FileModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerBehindProxyGuard,
    },
    AppService,
    PrismaService,
  ],
  controllers: [AppController],
  exports: [AppService],
})
export class AppModule {}
