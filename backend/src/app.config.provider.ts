import * as path from 'node:path';
import { ConfigService } from '@nestjs/config';

export const configProvider = {
  provide: 'CONFIG',
  useFactory: (configService: ConfigService): AppConfig => {
    const serveStaticRoot =
      configService.get<string>('SERVE_STATIC_ROOT') ?? 'public/content/afisha';

    return {
      database: {
        driver: configService.get<string>('DATABASE_DRIVER') ?? 'mongodb',
        url:
          configService.get<string>('DATABASE_URL') ??
          'mongodb://localhost:27017/film',
        username: configService.get<string>('DATABASE_USERNAME') ?? 'postgres',
        password: configService.get<string>('DATABASE_PASSWORD') ?? 'postgres',
      },
      serveStatic: {
        rootPath: path.join(__dirname, '..', serveStaticRoot),
        serveRoot:
          configService.get<string>('SERVE_STATIC_PATH') ?? '/content/afisha',
      },
    };
  },
  inject: [ConfigService],
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
