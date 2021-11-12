import { Injectable } from '@nestjs/common';
import { createWriteStream } from 'fs';
import { FileUpload } from 'graphql-upload';

@Injectable()
export class FileUploadService {
  async uploadFileToLocal(file: FileUpload) {
    const { createReadStream } = file;

    return new Promise<string>(async (resolve, reject) => {
      // const stream = v2.uploader.upload_stream(function (error, result) {
      //   if (!result?.secure_url) {
      //     throw new HttpException('File upload failed', 500);
      //   }
      //   resolve(result?.secure_url);
      //   reject(error?.message);
      // });
      return createReadStream()
        .pipe(
          createWriteStream('./uploads/' + file.filename.split(' ').join('_')),
        )
        .on('finish', () => {
          resolve(
            `http://localhost:3000/uploads/${file.filename
              .split(' ')
              .join('_')}`,
          );
        })
        .on('error', (err) => {
          reject(err);
        });
    });
  }
}
