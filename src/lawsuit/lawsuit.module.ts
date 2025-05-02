import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { PrismaService } from '../common/services/prisma.service';
import { LawsuitController } from './lawsuit.controller';
import { LawsuitService } from './lawsuit.service';
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
  providers: [LawsuitService, PrismaService],
  exports: [LawsuitService],
  controllers: [LawsuitController],
})
export class LawsuitModule {}
