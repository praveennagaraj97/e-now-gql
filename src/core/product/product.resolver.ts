import { HttpException } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { FileUpload, GraphQLUpload } from 'graphql-upload';
import { catchError, from, map } from 'rxjs';
import { GQLContextType } from 'src/types';
import { errorParse } from 'src/utils/error-parser';
import { FileUploadService } from '../../shared/uploads/file-upload/file-upload.service';
import { AddProductDTO } from './dto/add-product.dto';
import { ProductService } from './product.service';
import {
  FindAllProductsSchema,
  ProductAddedSchema,
  ProductSchema,
} from './schema';

@Resolver(() => ProductSchema)
export class ProductResolver {
  constructor(
    private readonly productsService: ProductService,
    private uploadService: FileUploadService,
  ) {}

  @Query(() => FindAllProductsSchema)
  getAllProducts() {
    return from(this.productsService.findAll()).pipe(
      map((products) => ({ message: 'List of products', products })),
    );
  }

  @Mutation(() => ProductAddedSchema)
  async addProduct(
    @Args('productData') productData: AddProductDTO,
    @Args({ name: 'productThumbnail', type: () => GraphQLUpload })
    productThumbnail: FileUpload,
    @Context() context: GQLContextType,
  ) {
    const { uid } = context.req as any;

    const info = await this.uploadService.uploadFileToLocal(productThumbnail);

    console.log(info);

    return from(
      this.productsService.create({
        ...productData,
        addedBy: uid,
        productThumbnail: info || null,
      }),
    ).pipe(
      map((product) => ({
        message: 'Product added successfully',
        ...product,
      })),
      catchError((err) => {
        const { errCode, msg } = errorParse(err);
        throw new HttpException(msg, errCode);
      }),
    );
  }

  @Mutation(() => String)
  async uploadFile(
    @Args({ name: 'file', type: () => GraphQLUpload })
    file: FileUpload,
  ) {
    const info = await this.uploadService.uploadFileToLocal(file);
    return info;
  }
}
