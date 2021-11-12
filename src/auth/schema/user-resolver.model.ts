import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'Contains user info.' })
export class UserSchema {
  @Field({
    nullable: true,
    description: 'UserName provided at the time of registration',
  })
  userName: string;

  @Field({ nullable: true, description: "User's email" })
  email: string;

  @Field({ nullable: true, description: 'Unique id of the user' })
  id: string;
}

@ObjectType({
  description:
    'Provides token with response message, which can be used as bearer token / sets token which will be default used if credentials method is used.',
})
export class RegisterOrLoginUserResponseSchema {
  @Field({ nullable: false, description: 'response message' })
  message: string;

  @Field({ nullable: false, description: 'jwt token for the user session' })
  token: string;
}

@ObjectType({
  description: 'Provides response for update password with message and status',
})
export class UpdatePasswordResponseSchema {
  @Field({ description: 'Response message' })
  message: string;

  @Field({ description: 'Password updated status' })
  status: boolean;
}

@ObjectType({
  description: 'Provides response for update password with message and status',
})
export class GetMeResponseSchema extends UserSchema {
  @Field({ description: 'Response message' })
  message: string;

  @Field(() => [String], { nullable: 'itemsAndList' })
  products: string[];
}
