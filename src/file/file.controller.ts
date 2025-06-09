import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Res,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { FileService } from './file.service';
import * as fs from 'fs';
import * as path from 'path';
import { Response } from 'express';
import { AuthCookieGuardion } from 'src/common/guards/auth-cookie.guard';

@ApiTags('files')
@Controller('files')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @ApiBearerAuth()
  @Post('upload')
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: diskStorage({
        filename: (req, file, cb) => {
          cb(null, file.originalname);
        },
      }),
    }),
  )
  
  @HttpCode(HttpStatus.CREATED)
  async uploadFiles(@UploadedFiles() files: Express.Multer.File[]) {
    for (const file of files) {
      const localPath = file.path;
      const remotePath = process.env.SFTP_PATH + file.filename;
      await this.fileService.uploadFiles(localPath, remotePath);
    }

    return {
      message: 'Arquivos enviados para o SFTP com sucesso!',
    };
  }

  @Get('download/:filename')
  
  async downloadFile(
    @Param('filename') filename: string,
    @Res() res: Response,
  ) {
    const remotePath = process.env.SFTP_PATH + filename;
    const localPath = path.join(__dirname, '..', '..', '..', 'temp', filename);

    await this.fileService.downloadFile(remotePath, localPath);

    res.download(localPath, filename, (err) => {
      fs.unlink(localPath, () => {});
      if (err) {
        res.status(500).send('Erro ao fazer download');
      }
    });
  }
}
