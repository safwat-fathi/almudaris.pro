import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { firstValueFrom, from, Observable } from 'rxjs';
import { DataSource } from 'typeorm';
import { DbUserContext } from '../contexts/db-user.context';

/**
 * Starts a request transaction, sets app.current_user_id and app.current_user_role,
 * and binds a manager so RLS policies are enforced consistently across all
 * repository calls in the request.
 */
@Injectable()
export class UserRlsInterceptor implements NestInterceptor {
  constructor(private readonly dataSource: DataSource) {}

  /**
   * Wraps authenticated routes in a request transaction with user session config.
   */
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    if (context.getType() !== 'http') {
      return next.handle();
    }

    const req = context.switchToHttp().getRequest<Request>();
    const user = (req as Request & { user?: { userId: string; role: string } })
      .user;

    // If the route is public and no user is authenticated, skip RLS injection
    if (!user) {
      return next.handle();
    }

    return from(this.runWithUserContext(user, next));
  }

  /**
   * Runs request with a user-scoped query runner transaction.
   */
  private async runWithUserContext(
    user: { userId: string; role: string },
    next: CallHandler,
  ): Promise<unknown> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      if (!user.userId || !user.role) {
        throw new UnauthorizedException(
          'User context is missing required fields',
        );
      }

      await queryRunner.query(
        `SELECT set_config('app.current_user_id', $1, true)`,
        [user.userId],
      );
      await queryRunner.query(
        `SELECT set_config('app.current_user_role', $1, true)`,
        [user.role],
      );

      const result = await DbUserContext.run(
        { userId: user.userId, role: user.role, manager: queryRunner.manager },
        async () => firstValueFrom<unknown>(next.handle()),
      );

      await queryRunner.commitTransaction();
      return result;
    } catch (error) {
      if (queryRunner.isTransactionActive) {
        await queryRunner.rollbackTransaction();
      }
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
