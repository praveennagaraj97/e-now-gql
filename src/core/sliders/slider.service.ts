import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FileUpload } from 'graphql-upload';
import { errorParse } from 'src/utils/error-parser';
import { Repository } from 'typeorm';
import { ImageUploadService } from '../../shared/uploads/image-upload/image-upload.service';
import { CreateSliderDTO, UpdateSliderDTO } from './dto';
import { SlidersEntity } from './entity/sliders.entity';

@Injectable()
export class SliderService {
  constructor(
    @InjectRepository(SlidersEntity)
    private readonly sliderRepository: Repository<SlidersEntity>,
    private imageUploadService: ImageUploadService,
  ) {}

  async create(dto: CreateSliderDTO, sliderImage: FileUpload) {
    try {
      const image = await this.imageUploadService.uploadImage(
        'cloudinary',
        sliderImage,
      );

      const data = Object.assign(new SlidersEntity(), { ...dto, image });

      return this.sliderRepository.save(data);
    } catch (e) {
      const { errCode, msg } = errorParse(e);
      throw new HttpException(msg, errCode);
    }
  }

  find() {
    return this.sliderRepository.find();
  }

  async update(dto: UpdateSliderDTO, sliderImage: FileUpload) {
    try {
      const file = await this.sliderRepository.findOne({ id: dto.id });

      if (!file) {
        throw new NotFoundException('No Slider found with Provided ID');
      }

      await this.imageUploadService.deleteImage('cloudinary', file.image);

      const image = await this.imageUploadService.uploadImage(
        'cloudinary',
        sliderImage,
      );

      return this.sliderRepository.save({ ...file, image, ...dto });
    } catch (e) {
      throw e;
    }
  }

  async delete(id: string) {
    try {
      const file = await this.sliderRepository.findOne(id);

      if (!file) {
        throw new NotFoundException('No Slider found with Provided ID');
      }

      await this.sliderRepository.delete(id);
      await this.imageUploadService.deleteImage('cloudinary', file.image);

      return true;
    } catch (e) {
      throw e;
    }
  }
}
