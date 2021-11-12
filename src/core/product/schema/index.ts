import { Field, ObjectType } from '@nestjs/graphql';
import { UserSchema } from 'src/auth/schema/user-resolver.model';

@ObjectType()
export class ProductSchema {
  @Field()
  id: string;

  @Field()
  productName: string;

  @Field()
  shortDescription: string;

  @Field()
  productPrice: number;

  @Field()
  quantity: number;

  @Field({ nullable: true })
  productThumbnail: string;

  @Field(() => UserSchema)
  addedBy: UserSchema;
}

@ObjectType()
export class ProductAddedSchema extends ProductSchema {
  @Field()
  message: string;
}

@ObjectType({ description: 'Provides list of product' })
export class FindAllProductsSchema {
  @Field(() => [ProductSchema])
  products: ProductSchema[];

  @Field()
  message: string;
}
