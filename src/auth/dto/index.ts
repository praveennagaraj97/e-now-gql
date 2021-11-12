import { Field, InputType } from '@nestjs/graphql';
import { IsAlphanumeric, IsEmail, IsNotEmpty } from 'class-validator';

@InputType()
export class LoginWithEmailAndPassDTO {
  @IsEmail()
  @IsNotEmpty()
  @Field({ nullable: false })
  email: string;

  @IsNotEmpty()
  @Field({ nullable: false })
  password: string;
}

@InputType()
export class LoginWithUserNameAndPasswordDTO {
  @IsNotEmpty()
  @Field({ nullable: false })
  password: string;

  @IsAlphanumeric()
  @IsNotEmpty()
  @Field({ nullable: false })
  userName: string;
}

@InputType({ description: 'Data required for the registration of user' })
export class RegisterUserDTO {
  @IsEmail()
  @IsNotEmpty()
  @Field()
  email: string;

  @IsNotEmpty()
  @Field()
  password: string;

  @IsAlphanumeric()
  @IsNotEmpty()
  @Field({ nullable: false })
  @Field()
  userName: string;
}

@InputType({ description: 'Data model schema for updating password' })
export class UpdatePasswordDTO {
  @Field({ nullable: false })
  @IsNotEmpty()
  currentPassword: string;

  @Field({ nullable: false })
  @IsNotEmpty()
  newPassword: string;
}
