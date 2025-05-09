import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AssociateService } from './associate.service';
import { AssociateController } from './associate.controller';
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
  providers: [AssociateService],
  exports: [AssociateService],
  controllers: [AssociateController],
})
export class AssociateModule {}
