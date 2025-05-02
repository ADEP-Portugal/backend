import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { FileService } from './file.service';
import { FileController } from './file.controller';
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
  providers: [FileService],
  exports: [FileService],
  controllers: [FileController],
})
export class FileModule {}
