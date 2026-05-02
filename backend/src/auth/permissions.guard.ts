import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from './permissions.decorator';
import { Permission } from './permissions.enum';
import { ROLE_PERMISSIONS, isUserRole } from './role-permissions';

type RequestUser = {
  userId: number | string;
  role: string;
};

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<Permission[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest<{ user?: RequestUser }>();
    const role = request.user?.role;

    if (!role) {
      throw new UnauthorizedException('Authentication required.');
    }

    if (!isUserRole(role)) {
      throw new ForbiddenException('ليس لديك صلاحيات.');
    }

    const grantedPermissions = new Set(ROLE_PERMISSIONS[role]);
    const hasPermission = requiredPermissions.some((permission) =>
      grantedPermissions.has(permission),
    );

    if (!hasPermission) {
      throw new ForbiddenException('ليس لديك صلاحيات.');
    }

    return true;
  }
}
