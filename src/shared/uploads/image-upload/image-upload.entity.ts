import { AfterInsert, Column, Entity } from 'typeorm';
import { BaseSharedEntity } from '../../base-entity-and-schema';

@Entity({ name: 'image-container' })
export class ImagesEntity extends BaseSharedEntity {
  @Column({ nullable: false, name: 'file_name', unique: true })
  fileName: string;

  @Column({ nullable: false })
  url: string;

  @Column({ nullable: false })
  encoding: string;

  @Column({ nullable: false, name: 'mime_type' })
  mimeType: string;

  /**
   * @use to delete the files
   */
  @Column({ nullable: true, name: 'cloudinary_public_id' })
  cloudinaryPublicId?: string;

  @AfterInsert()
  private concateIdToFileName() {
    console.log('i ran after insert');
    this.fileName = this.id + this.fileName;
  }
}
