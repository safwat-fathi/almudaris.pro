import { AsyncLocalStorage } from 'async_hooks';

export class UserContext {
  private static storage = new AsyncLocalStorage<{
    userId: string;
    role: string;
  }>();

  static run(user: { userId: string; role: string }, callback: () => void) {
    this.storage.run(user, callback);
  }

  static getUser(): { userId: string; role: string } | undefined {
    return this.storage.getStore();
  }
}
