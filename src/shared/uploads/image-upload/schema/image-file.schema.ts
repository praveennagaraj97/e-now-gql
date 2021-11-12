import { Field, ObjectType } from '@nestjs/graphql';
import { BaseSchema } from 'src/shared/base-entity-and-schema';

@ObjectType()
export class ImageFileSchema extends BaseSchema {
  @Field()
  fileName: string;
  @Field()
  url: string;
  @Field()
  encoding: string;
  @Field()
  mimeType: string;
  @Field()
  id: string;

  cloudinaryPublicId?: string;
}
