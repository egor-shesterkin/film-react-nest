import * as path from 'node:path';

export const configProvider = {
  provide: 'CONFIG',
  useFactory: (): AppConfig => ({
    database: {
      driver: process.env.DATABASE_DRIVER ?? 'mongodb',
      url: process.env.DATABASE_URL ?? 'mongodb://localhost:27017/film',
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
}

export interface AppConfigServeStatic {
  rootPath: string;
  serveRoot: string;
}
