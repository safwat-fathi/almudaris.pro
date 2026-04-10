declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production';
      HTTP_SERVER_PORT: number;
      DB_NAME: string;
      DB_USER: string;
      DB_PASS: string;
      DB_HOST: string;
      DB_PORT: number;
      APP_URL: string;
      JWT_SECRET: string;
      CSRF_SECRET: string;
      CLIENT_URL: string;
      ACCOUNT_SID: string;
      AUTH_TOKEN: string;
      VERIFY_SERVICE_SID: string;
    }
  }
}

export {};
