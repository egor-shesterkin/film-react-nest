import 'dotenv/config';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';

import { AppConfig } from './app.config.provider';
import { AppConfigModule } from './app.config.module';
import { TypeormConfigModule } from './database/typeorm-config.module';
import { FilmsModule } from './films/films.module';
import { OrderModule } from './order/order.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
    }),
    AppConfigModule,
    TypeormConfigModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule, AppConfigModule],
      useFactory: (config: AppConfig, configService: ConfigService) => {
        const databaseDriver =
          configService.get<string>('DATABASE_DRIVER') ??
          config.database.driver;

        if (databaseDriver === 'mongodb') {
          return {
            uri: config.database.url,
          };
        }

        const mongodbFallbackUri =
          configService.get<string>('MONGODB_FALLBACK_URL') ??
          'mongodb://mongodb:27017/film_disabled';

        return {
          uri: mongodbFallbackUri,
          lazyConnection: true,
        };
      },
      inject: ['CONFIG', ConfigService],
    }),
    ServeStaticModule.forRootAsync({
      imports: [AppConfigModule],
      useFactory: (config: AppConfig) => [
        {
          rootPath: config.serveStatic.rootPath,
          serveRoot: config.serveStatic.serveRoot,
        },
      ],
      inject: ['CONFIG'],
    }),
    FilmsModule.register(),
    OrderModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
