import { UserEnity } from 'src/core/users/entities/user.entity';
import { BaseSharedEntity } from 'src/shared/base-entity-and-schema';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity({ name: 'product' })
export class ProductEntity extends BaseSharedEntity {
  @Column({ name: 'product_name', nullable: false, unique: true, length: 100 })
  productName: string;

  @Column({ name: 'short_description' })
  shortDescription: string;

  @Column({ name: 'product_price', nullable: false })
  productPrice: number;

  @Column({
    name: 'product_thumbnail',
    nullable: true,
  })
  productThumbnail: string;

  @Column({ default: 1 })
  quantity: number;

  @ManyToOne(() => UserEnity, (user) => user.id, {
    nullable: false,
    eager: true,
  })
  @JoinColumn({ name: 'added_by' })
  addedBy: UserEnity;
}
