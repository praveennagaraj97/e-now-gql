import { HttpException, UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';
import { catchError, from, map } from 'rxjs';
import { CookieNames } from 'src/constants/cookie.names';
import { IsAuthenticatedGuard } from 'src/shared/guards/is-authenticated.guard';
import type { GQLContextType } from 'src/types';
import { errorParse } from 'src/utils/error-parser';
import { UserEnity } from '../core/users/entities/user.entity';
import { UserService } from '../core/users/user.service';
import { CookieService } from '../shared/cookie.service';
import {
  LoginWithEmailAndPassDTO,
  LoginWithUserNameAndPasswordDTO,
  RegisterUserDTO,
  UpdatePasswordDTO,
} from './dto';
import {
  GetMeResponseSchema,
  RegisterOrLoginUserResponseSchema,
  UpdatePasswordResponseSchema,
  UserSchema,
} from './schema/user-resolver.model';

@Resolver(() => UserSchema)
export class AuthResolver {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly cookieService: CookieService,
  ) {}

  @Mutation(() => RegisterOrLoginUserResponseSchema)
  registerUser(
    @Context() context: GQLContextType,
    @Args('registerUserData') registerUserData: RegisterUserDTO,
  ) {
    return from(this.userService.create(registerUserData)).pipe(
      map((user) => {
        const token = this.tokenSetter(user, context);
        return { message: 'User registered successfully', token };
      }),
      catchError((err) => {
        const { errCode, msg } = errorParse(err);
        throw new HttpException(msg, errCode);
      }),
    );
  }

  @Mutation(() => RegisterOrLoginUserResponseSchema)
  loginWithUsernameAndPassword(
    @Context() context: GQLContextType,
    @Args('loginWithUsernameAndPasswordData')
    loginWithUserAndPassDTO: LoginWithUserNameAndPasswordDTO,
  ) {
    return from(
      this.userService.findOnyByUserNameAndPassword(loginWithUserAndPassDTO),
    ).pipe(
      map((user) => {
        const token = this.tokenSetter(user, context);
        return { message: 'User credentails verified successfully', token };
      }),
      catchError((err) => {
        const { errCode, msg } = errorParse(err);
        throw new HttpException(msg, errCode);
      }),
    );
  }

  @Mutation(() => RegisterOrLoginUserResponseSchema)
  loginWithEmailAndPassword(
    @Context() context: GQLContextType,
    @Args('loginWithEmailAndPasswordData')
    loginWithEmailAndPassDTO: LoginWithEmailAndPassDTO,
  ) {
    return from(
      this.userService.findOnyByEmailAndPassword(loginWithEmailAndPassDTO),
    ).pipe(
      map((user) => {
        const token = this.tokenSetter(user, context);
        return { message: 'User credentails verified successfully', token };
      }),
      catchError((err) => {
        const { errCode, msg } = errorParse(err);
        throw new HttpException(msg, errCode);
      }),
    );
  }

  @Query(() => GetMeResponseSchema, {
    description: 'Provides info of currently logged user',
  })
  @UseGuards(IsAuthenticatedGuard)
  getMe(@Context() context: GQLContextType) {
    const { uid } = context.req as any;
    return from(this.userService.findById(uid)).pipe(
      map((user) => ({
        message: 'User details fetched successfully',
        ...user,
      })),
    );
  }

  @Mutation(() => UpdatePasswordResponseSchema)
  @UseGuards(IsAuthenticatedGuard)
  updatePassword(
    @Args('updatePasswordData') dto: UpdatePasswordDTO,
    @Context() context: GQLContextType,
  ) {
    const { uid } = context.req as any;
    return from(this.userService.updatePassword({ ...dto, id: uid })).pipe(
      map((isUpdated) => ({
        message: 'Password updated successfully',
        status: isUpdated,
      })),
      catchError((err) => {
        const { errCode, msg } = errorParse(err);
        throw new HttpException(msg, errCode);
      }),
    );
  }

  @Mutation(() => RegisterOrLoginUserResponseSchema)
  addAdmin() {
    return '';
  }

  private tokenSetter(user: UserEnity, context: GQLContextType) {
    const token = this.jwtService.sign({ id: user.id });
    this.cookieService.setCookie(context.res, CookieNames.AUTH_TOKEN, token);

    return token;
  }
}
