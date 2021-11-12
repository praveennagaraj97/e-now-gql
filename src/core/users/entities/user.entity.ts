import { compare, hash } from 'bcryptjs';
import { UserRoles } from 'src/constants/enum';
import { ProductEntity } from 'src/core/product/entity/product.entity';
import { BaseSharedEntity } from 'src/shared/base-entity-and-schema';
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany } from 'typeorm';

@Entity({ name: 'user' })
export class UserEnity extends BaseSharedEntity {
  @Column({ name: 'user_name', nullable: true, unique: true })
  userName: string;

  @Column({ nullable: false, unique: true })
  email: string;

  @Column({ nullable: false })
  password: string;

  @Column({ name: 'user_role', enum: UserRoles, default: UserRoles.CONSUMER })
  userRole: UserRoles;

  @OneToMany(() => ProductEntity, (prod) => prod.addedBy)
  products: ProductEntity[];

  @BeforeInsert()
  @BeforeUpdate()
  private async handlePasswordHash() {
    this.password = await hash(this.password, 12);
  }

  async comparePassword(passowordInput: string) {
    return await compare(passowordInput, this.password);
  }
}
