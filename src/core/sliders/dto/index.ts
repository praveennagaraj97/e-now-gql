import { Field, InputType } from '@nestjs/graphql';
import { IsString, IsUrl } from 'class-validator';
import { ImageFileSchema } from 'src/shared/uploads/image-upload/schema/image-file.schema';

@InputType()
export class CreateSliderDTO {
  @Field({ nullable: true })
  heading: string;

  @IsString()
  @Field({ nullable: true })
  description: string;

  @IsUrl({ require_host: false })
  @Field({ nullable: true })
  redirect_path: string;

  image: ImageFileSchema;
}

@InputType()
export class UpdateSliderDTO extends CreateSliderDTO {
  @Field({ nullable: false })
  id: string;
}
