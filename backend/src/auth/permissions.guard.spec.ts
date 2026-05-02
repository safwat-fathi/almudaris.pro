import {
  ForbiddenException,
  UnauthorizedException,
  type ExecutionContext,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Permission } from './permissions.enum';
import { PermissionsGuard } from './permissions.guard';
import { UserRole } from '../users/entities/user.entity';

type TestRequest = {
  user?: {
    userId: number;
    role: string;
  };
};

function createContext(request: TestRequest): ExecutionContext {
  return {
    switchToHttp: () => ({
      getRequest: () => request,
    }),
    getHandler: () => ({}),
    getClass: () => class TestController {},
  } as ExecutionContext;
}

describe('PermissionsGuard', () => {
  const reflector = {
    getAllAndOverride: jest.fn(),
  } as unknown as Reflector;

  let guard: PermissionsGuard;

  beforeEach(() => {
    jest.clearAllMocks();
    guard = new PermissionsGuard(reflector);
  });

  it('allows access when no permissions are required', () => {
    reflector.getAllAndOverride = jest.fn().mockReturnValue(undefined);

    const context = createContext({
      user: { userId: 1, role: UserRole.TEACHER },
    });

    expect(guard.canActivate(context)).toBe(true);
  });

  it('allows access when role has at least one required permission', () => {
    reflector.getAllAndOverride = jest
      .fn()
      .mockReturnValue([Permission.HOMEWORK_READ]);

    const context = createContext({
      user: { userId: 9, role: UserRole.STUDENT },
    });

    expect(guard.canActivate(context)).toBe(true);
  });

  it('throws UnauthorizedException when user is missing', () => {
    reflector.getAllAndOverride = jest
      .fn()
      .mockReturnValue([Permission.GROUP_READ]);

    const context = createContext({});

    expect(() => guard.canActivate(context)).toThrow(UnauthorizedException);
  });

  it('throws ForbiddenException for unknown role', () => {
    reflector.getAllAndOverride = jest
      .fn()
      .mockReturnValue([Permission.GROUP_READ]);

    const context = createContext({
      user: { userId: 9, role: 'admin' },
    });

    expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
  });

  it('uses OR semantics when multiple permissions are required', () => {
    reflector.getAllAndOverride = jest
      .fn()
      .mockReturnValue([
        Permission.PARENT_TEACHERS_READ,
        Permission.HOMEWORK_READ,
      ]);

    const context = createContext({
      user: { userId: 11, role: UserRole.STUDENT },
    });

    expect(guard.canActivate(context)).toBe(true);
  });

  it('throws ForbiddenException when role lacks required permissions', () => {
    reflector.getAllAndOverride = jest
      .fn()
      .mockReturnValue([Permission.GROUP_CREATE]);

    const context = createContext({
      user: { userId: 2, role: UserRole.PARENT },
    });

    expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
  });
});
