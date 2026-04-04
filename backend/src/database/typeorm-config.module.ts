import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppConfigModule } from '../app.config.module';
import { AppConfig } from '../app.config.provider';
import { FilmEntity } from '../films/entities/film.entity';
import { ScheduleEntity } from '../films/entities/schedule.entity';

const typeormEntitiesGlob = [__dirname + '/../**/*.entity{.ts,.js}'];

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [AppConfigModule],
      useFactory: (config: AppConfig, configService: ConfigService) => {
        const nodeEnv = configService.get<string>('NODE_ENV') ?? 'development';
        const syncFromEnv =
          (configService.get<string>('TYPEORM_SYNCHRONIZE') ?? 'false') ===
          'true';
        const shouldSynchronize = nodeEnv !== 'production' && syncFromEnv;

        if (config.database.driver !== 'postgres') {
          return {
            type: 'postgres' as const,
            host: '127.0.0.1',
            port: 5432,
            database: 'postgres',
            username: 'postgres',
            password: 'postgres',
            entities: typeormEntitiesGlob,
            synchronize: shouldSynchronize,
            manualInitialization: true,
          };
        }

        const parsedUrl = new URL(config.database.url);

        return {
          type: 'postgres' as const,
          host: parsedUrl.hostname,
          port: Number(parsedUrl.port || 5432),
          database: parsedUrl.pathname.replace(/^\/+/, ''),
          username: String(config.database.username ?? ''),
          password: String(config.database.password ?? ''),
          entities: typeormEntitiesGlob,
          synchronize: shouldSynchronize,
          manualInitialization: false,
        };
      },
      inject: ['CONFIG', ConfigService],
    }),
    TypeOrmModule.forFeature([FilmEntity, ScheduleEntity]),
  ],
  exports: [TypeOrmModule],
})
export class TypeormConfigModule {}
