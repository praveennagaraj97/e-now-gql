import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { from, map, Observable } from 'rxjs';
import { CookieNames } from 'src/constants/cookie.names';
import { JWTContants } from 'src/constants/env.variables';
import { UserService } from 'src/core/users/user.service';
import { CookieService } from 'src/shared/cookie.service';
import { requestDestructFromExectuionContext } from '../helpers/request-destruct-from-execution-content';

@Injectable()
export class IsAuthenticatedGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly cookieService: CookieService,
    private readonly userService: UserService,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    try {
      const req = requestDestructFromExectuionContext(context);

      let token = '';
      token = this.cookieService.getCookie(req, CookieNames.AUTH_TOKEN);

      if (!token) {
        if (!req.headers.authorization?.startsWith('Bearer')) {
          throw new Error('Authorization token should start with Bearer');
        }

        token = req.headers.authorization?.split(' ')[1];
      }

      if (!token) {
        throw new Error('Authorization token is required');
      }

      const { id } = this.verifyToken(token);

      return from(this.userService.findById(id)).pipe(
        map((user) => {
          if (user) {
            req.user = user;
            req.uid = id;
            return true;
          }

          return false;
        }),
      );
    } catch (e) {
      throw new HttpException(e, HttpStatus.BAD_REQUEST);
    }
  }

  private verifyToken(token: string) {
    return this.jwtService.verify<{ id: string }>(token, {
      secret: this.configService.get(JWTContants.JWT_SECRET),
    });
  }
}
