import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createWriteStream, unlink } from 'fs';
import { FileUpload } from 'graphql-upload';
import { CloudinaryUploadService } from 'src/providers/cloudinary.provider';
import { StorageServiceProviders } from 'src/types';
import { errorParse } from 'src/utils/error-parser';
import { Repository } from 'typeorm';
import { ImagesEntity } from './image-upload.entity';
import { ImageFileSchema } from './schema/image-file.schema';

@Injectable()
export class ImageUploadService {
  constructor(
    @InjectRepository(ImagesEntity)
    private imageRepository: Repository<ImagesEntity>,
    private cloudinaryStorageService: CloudinaryUploadService,
  ) {}

  /**
   *
   * @param provider - StorageServiceProviders - Choose a provider to store file
   * @param file - Provide Required file which needs to be uploded
   * @returns Promise<ImageEntity>
   * @note User Local Provider only on development using it on production will cause storage issue for the server.
   */
  uploadImage(provider: StorageServiceProviders, file: FileUpload) {
    if (provider === 'local') {
      return this.uploadToLocal(file);
    }

    if (provider === 'cloudinary') {
      return this.uploadToCloudinary(file);
    }

    return this.uploadToLocal(file);
  }

  deleteImage(provider: StorageServiceProviders, storageInfo: ImageFileSchema) {
    if (provider === 'local') {
      return this.deleteFileFromLocal(storageInfo.fileName);
    }

    if (provider === 'cloudinary') {
      return this.deleteFileFromCloudinary(
        storageInfo.id,
        storageInfo.cloudinaryPublicId,
      );
    }
  }

  /**
   * @deprecated use in development mode only
   */
  private uploadToLocal(file: FileUpload) {
    const { createReadStream, encoding, filename, mimetype } = file;

    return new Promise<ImagesEntity>((resolve, reject) => {
      createReadStream()
        .pipe(createWriteStream(`./uploads/${filename}`))
        .on('finish', async () => {
          try {
            const response = await this.imageRepository.save({
              fileName: filename,
              encoding,
              mimeType: mimetype,
              url: `http://localhost:8080/uploads/${filename}`,
            });

            resolve(response);
          } catch (e) {
            const { msg } = errorParse(e);

            reject(msg);
          }
        })
        .on('error', (err) => {
          reject(err);
        });
    });
  }

  /**
   * @deprecated use in development mode only
   */
  private deleteFileFromLocal(fileName: string) {
    return unlink(`./uploads/${fileName}`, (err) => {
      console.log(err);
    });
  }

  // Cloudinary
  private uploadToCloudinary(file: FileUpload) {
    const { createReadStream, encoding, filename, mimetype } = file;

    return new Promise(async (resolve, reject) => {
      const stream = this.cloudinaryStorageService.uploadViaStream(
        { folder: 'e-now' },
        async (err, result) => {
          if (err) {
            return reject(err);
          }

          try {
            const response = await this.imageRepository.save({
              fileName: filename,
              encoding,
              mimeType: mimetype,
              url: result.secure_url || result.url,
              cloudinaryPublicId: result.public_id,
            });

            resolve(response);
          } catch (e) {
            const { msg } = errorParse(e);

            reject(msg);
          }
        },
      );

      createReadStream().pipe(stream);
    });
  }

  private async deleteFileFromCloudinary(id: string, publicId: string) {
    await this.imageRepository.delete(id);

    return this.cloudinaryStorageService.deleteFile(publicId);
  }
}
