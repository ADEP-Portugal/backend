import { Injectable } from '@nestjs/common';
import * as SFTPClient from 'ssh2-sftp-client';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class FileService {
  private sftp = new SFTPClient();

  async uploadFiles(localPath: string, remotePath: string) {
    await this.sftp.connect({
      host: process.env.SFTP_HOST,
      port: process.env.SFTP_PORT,
      username: process.env.SFTP_USERNAME,
      password: process.env.SFTP_PASSWORD,
    });

    await this.sftp.put(localPath, remotePath);
    await this.sftp.end();
  }

  async downloadFile(remotePath: string, localPath: string) {
    await this.sftp.connect({
      host: process.env.SFTP_HOST,
      port: process.env.SFTP_PORT,
      username: process.env.SFTP_USERNAME,
      password: process.env.SFTP_PASSWORD,
    });

    await this.sftp.fastGet(remotePath, localPath);
    await this.sftp.end();
  }
}
