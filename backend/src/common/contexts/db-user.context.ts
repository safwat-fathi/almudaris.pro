import { AsyncLocalStorage } from 'async_hooks';
import { EntityManager } from 'typeorm';

type DbUserStore = {
  userId: string;
  role: string;
  manager: EntityManager;
};

/**
 * Holds request-scoped user + TypeORM manager for RLS-bound queries.
 */
export class DbUserContext {
  private static readonly storage = new AsyncLocalStorage<DbUserStore>();

  /**
   * Runs callback within a request-scoped user database context.
   */
  static run<T>(store: DbUserStore, callback: () => T): T {
    return this.storage.run(store, callback);
  }

  /**
   * Returns current request user id if available.
   */
  static getUserId(): string | undefined {
    return this.storage.getStore()?.userId;
  }

  /**
   * Returns current request user role if available.
   */
  static getUserRole(): string | undefined {
    return this.storage.getStore()?.role;
  }

  /**
   * Returns current request-bound manager if available.
   */
  static getManager(): EntityManager | undefined {
    return this.storage.getStore()?.manager;
  }
}
