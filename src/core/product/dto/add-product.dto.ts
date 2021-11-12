import { Field, InputType } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

@InputType({ description: 'Input Data definition for adding new product.' })
export class AddProductDTO {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  @Field({
    description: 'Name of the products',
    nullable: false,
  })
  productName: string;

  @IsNotEmpty()
  @IsString()
  @Field({ nullable: false })
  shortDescription: string;

  @Field({ nullable: false })
  @IsNumber()
  @IsNotEmpty()
  @Min(0.1)
  productPrice: number;

  productThumbnail?: string;

  addedBy: string;
}
