import { BaseSharedEntity } from 'src/shared/base-entity-and-schema';
import { ImageFileSchema } from 'src/shared/uploads/image-upload/schema/image-file.schema';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'sliders' })
export class SlidersEntity extends BaseSharedEntity {
  @Column({ nullable: false, type: 'jsonb' })
  image: ImageFileSchema;

  @Column({ nullable: true })
  heading: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  redirect_path: string;
}
