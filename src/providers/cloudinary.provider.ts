import { Injectable, Logger } from '@nestjs/common';
import { UploadApiOptions, UploadResponseCallback, v2 } from 'cloudinary';
import { CLOUDINARY } from 'src/constants/app.contants';

export const CloudinaryProvider = {
  provide: CLOUDINARY,
  useFactory: () => {
    Logger.log('CloudinaryModule dependencies initialized', 'InstanceLoader');
    return v2.config({
      cloud_name: 'praveennagaraj97',
      api_key: '513728794147691',
      api_secret: 'IUelbryP2RixIidpR0mO9g5dCMs',
    });
  },
};

@Injectable()
export class CloudinaryUploadService {
  uploadViaStream(options: UploadApiOptions, callback: UploadResponseCallback) {
    const stream = v2.uploader.upload_stream(options, callback);

    return stream;
  }

  deleteFile(publicId: string) {
    return v2.uploader.destroy(publicId, {
      type: 'upload',
      resource_type: 'image',
    });
  }
}
