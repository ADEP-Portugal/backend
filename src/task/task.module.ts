import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { PrismaService } from '../common/services/prisma.service';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
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
  providers: [TaskService, PrismaService],
  exports: [TaskService],
  controllers: [TaskController],
})
export class TaskModule {}
