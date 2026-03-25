import * as path from 'node:path';

export const configProvider = {
  provide: 'CONFIG',
  useFactory: (): AppConfig => ({
    database: {
      driver: process.env.DATABASE_DRIVER ?? 'mongodb',
      url: process.env.DATABASE_URL ?? 'mongodb://localhost:27017/film',
      username: process.env.DATABASE_USERNAME ?? 'postgres',
      password: process.env.DATABASE_PASSWORD ?? 'postgres',
    },
    serveStatic: {
      rootPath: path.join(__dirname, '..', process.env.SERVE_STATIC_ROOT ?? 'public/content/afisha'),
      serveRoot: process.env.SERVE_STATIC_PATH ?? '/content/afisha',
    },
  }),
};

export interface AppConfig {
  database: AppConfigDatabase;
  serveStatic: AppConfigServeStatic;
}

export interface AppConfigDatabase {
  driver: string;
  url: string;
  username: string;
  password: string;
}

export interface AppConfigServeStatic {
  rootPath: string;
  serveRoot: string;
}
