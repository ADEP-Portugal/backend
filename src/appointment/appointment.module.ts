import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AppointmentService } from './appointment.service';
import { AppointmentController } from './appointment.controller';
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
  providers: [AppointmentService],
  exports: [AppointmentService],
  controllers: [AppointmentController],
})
export class AppointmentModule {}
