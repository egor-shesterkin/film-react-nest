import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';

import { AppConfig } from './app.config.provider';
import { AppConfigModule } from './app.config.module';
import { FilmsModule } from './films/films.module';
import { OrderModule } from './order/order.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
    }),
    AppConfigModule,
    MongooseModule.forRootAsync({
      imports: [AppConfigModule],
      useFactory: (config: AppConfig) => ({
        uri: config.database.url,
      }),
      inject: ['CONFIG'],
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
    FilmsModule,
    OrderModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
