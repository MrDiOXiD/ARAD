import {
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  mixin,
} from '@nestjs/common';
import { Roles } from '../common/Roles.enum';

export const AuthorizedGuard = (allowedRoles: Roles[]) => {
  class RolesGuardMixin implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
      const request = context.switchToHttp().getRequest();
      const userRoles: Roles[] = request?.user?.roles ?? [];

      const hasRole = userRoles.some((role) => allowedRoles.includes(role));
      if (!hasRole) throw new UnauthorizedException('Insufficient permissions');

      return true;
    }
  }

  return mixin(RolesGuardMixin);
};
