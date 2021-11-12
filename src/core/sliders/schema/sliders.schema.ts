import { Field, ObjectType } from '@nestjs/graphql';
import { BaseSchema } from 'src/shared/base-entity-and-schema';
import { ImageFileSchema } from 'src/shared/uploads/image-upload/schema/image-file.schema';

@ObjectType({
  description: 'Provide data for sliders / banners',
})
export class SliderSchema extends BaseSchema {
  @Field(() => ImageFileSchema)
  image: ImageFileSchema;

  @Field({ nullable: true })
  heading: string;

  @Field({ nullable: true })
  description: string;

  @Field({ nullable: true })
  redirect_path: string;
}

@ObjectType({ description: 'Provide info about slider added/not' })
export class CreateSliderResponseSchema extends SliderSchema {
  @Field()
  message: string;
}

@ObjectType({ description: 'Provide info about slider added/not' })
export class SlidersResponseSchema {
  @Field()
  message: string;

  @Field(() => [SliderSchema])
  sliders: SliderSchema[];
}

@ObjectType({ description: 'Provide info about slider updated/not' })
export class UpdateSlidersResponseSchema extends SliderSchema {
  @Field()
  message: string;
}

@ObjectType({ description: 'Provide info about slider deleted/not' })
export class DeleteSliderReponseSchema {
  @Field()
  message: string;
}
