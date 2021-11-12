import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FileUploadService } from '../../shared/uploads/file-upload/file-upload.service';
import { AddProductDTO } from './dto/add-product.dto';
import { ProductEntity } from './entity/product.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    private uploadService: FileUploadService,
  ) {}

  create(dto: AddProductDTO): Promise<ProductEntity> {
    // this.uploadService.uploadFileToLocal(await dto.productThumbnail);

    const input = Object.assign(new ProductEntity(), dto);
    return this.productRepository.save(input);
  }

  findAll() {
    return this.productRepository.find();
  }
}
