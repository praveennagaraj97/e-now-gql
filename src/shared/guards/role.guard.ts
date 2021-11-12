import {
  CanActivate,
  ExecutionContext,
  Injectable,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRoles } from 'src/constants/enum';
import { requestDestructFromExectuionContext } from '../helpers/request-destruct-from-execution-content';

/**
 * @run this guard after isAuthenticated Guard
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<UserRoles[]>(
      'roles',
      context.getHandler(),
    );
    if (!roles) {
      return true;
    }
    const request = requestDestructFromExectuionContext(context);

    return roles.some((role) => role === request.user.userRole);
  }
}

export const Roles = (...roles: UserRoles[]) => SetMetadata('roles', roles);
