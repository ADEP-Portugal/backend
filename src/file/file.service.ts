import { Injectable } from '@nestjs/common';
import * as SFTPClient from 'ssh2-sftp-client';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class FileService {
  async uploadFiles(localPath: string, remotePath: string) {
    const sftp = new SFTPClient();

    await sftp.connect({
      host: process.env.SFTP_HOST,
      port: process.env.SFTP_PORT,
      username: process.env.SFTP_USERNAME,
      password: process.env.SFTP_PASSWORD,
    });

    await sftp.put(localPath, remotePath);
    await sftp.end();
  }

  async downloadFile(remotePath: string, localPath: string) {
    const sftp = new SFTPClient();

    await sftp.connect({
      host: process.env.SFTP_HOST,
      port: process.env.SFTP_PORT,
      username: process.env.SFTP_USERNAME,
      password: process.env.SFTP_PASSWORD,
    });

    await sftp.fastGet(remotePath, localPath);
    await sftp.end();
  }
}
