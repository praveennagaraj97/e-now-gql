import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  CloudinaryProvider,
  CloudinaryUploadService,
} from 'src/providers/cloudinary.provider';
import { AuthModule } from '../auth/auth.module';
import { CookieService } from './cookie.service';
import { FileUploadService } from './uploads/file-upload/file-upload.service';
import { ImagesEntity } from './uploads/image-upload/image-upload.entity';
import { ImageUploadService } from './uploads/image-upload/image-upload.service';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([ImagesEntity]), AuthModule],
  providers: [
    CookieService,
    FileUploadService,
    ImageUploadService,
    CloudinaryProvider,
    CloudinaryUploadService,
  ],
  exports: [CookieService, FileUploadService, ImageUploadService, AuthModule],
})
export class SharedModule {}
