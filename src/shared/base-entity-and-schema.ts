import { Field, ObjectType } from '@nestjs/graphql';
import {
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';

@Entity()
export class BaseSharedEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ name: 'created_at' })
  createdDate: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedDate: Date;

  @VersionColumn({ name: '__v' })
  __version: number;
}

@ObjectType()
export class BaseSchema {
  @Field({ nullable: false })
  id: string;

  @Field({ nullable: false })
  createdDate: Date;

  @Field({ nullable: false })
  updatedDate: Date;
}
