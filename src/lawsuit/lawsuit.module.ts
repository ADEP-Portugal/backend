import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { LawsuitService } from './lawsuit.service';
import { LawsuitController } from './lawsuit.controller';
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
  providers: [LawsuitService],
  exports: [LawsuitService],
  controllers: [LawsuitController],
})
export class LawsuitModule {}
