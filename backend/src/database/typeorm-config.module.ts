import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppConfigModule } from '../app.config.module';
import { AppConfig } from '../app.config.provider';
import { FilmEntity } from '../films/entities/film.entity';
import { ScheduleEntity } from '../films/entities/schedule.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [AppConfigModule],
      useFactory: (config: AppConfig) => {
        const parsedUrl = new URL(config.database.url);

        return {
          type: 'postgres' as const,
          host: parsedUrl.hostname,
          port: Number(parsedUrl.port || 5432),
          database: parsedUrl.pathname.replace(/^\/+/, ''),
          username: String(config.database.username ?? ''),
          password: String(config.database.password ?? ''),
          entities: [FilmEntity, ScheduleEntity],
          synchronize: false,
        };
      },
      inject: ['CONFIG'],
    }),
    TypeOrmModule.forFeature([FilmEntity, ScheduleEntity]),
  ],
  exports: [TypeOrmModule],
})
export class TypeormConfigModule {}
