import { DynamicModule, Global, Module } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { AppConfigModule } from '../app.config.module';
import { AppConfig } from '../app.config.provider';
import { TypeormConfigModule } from '../database/typeorm-config.module';
import { FilmsController } from './films.controller';
import { Film, FilmSchema } from './schemas/film.schema';
import { FilmsRepository } from './films.repository';
import { FilmsService } from './films.service';
import { MongoFilmsRepository } from './mongo-films.repository';
import { PostgresFilmsRepository } from './postgres-films.repository';

@Global()
@Module({
  providers: [FilmsService],
  exports: [FilmsService],
})
export class FilmsModule {
  static register(): DynamicModule {
    return {
      module: FilmsModule,
      imports: [
        AppConfigModule,
        TypeormConfigModule,
        MongooseModule.forFeature([{ name: Film.name, schema: FilmSchema }]),
      ],
      controllers: [FilmsController],
      providers: [
        FilmsService,
        {
          provide: FilmsRepository,
          useFactory: async (
            moduleRef: ModuleRef,
            config: AppConfig,
          ): Promise<FilmsRepository> => {
            if (config.database.driver === 'postgres') {
              return moduleRef.create(PostgresFilmsRepository);
            }

            return moduleRef.create(MongoFilmsRepository);
          },
          inject: [ModuleRef, 'CONFIG'],
        },
      ],
      exports: [FilmsService, FilmsRepository],
      global: true,
    };
  }
}
