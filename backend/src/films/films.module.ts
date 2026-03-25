import 'dotenv/config';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeormConfigModule } from '../database/typeorm-config.module';
import { FilmsController } from './films.controller';
import { Film, FilmSchema } from './schemas/film.schema';
import { FilmsRepository } from './films.repository';
import { FilmsService } from './films.service';
import { MongoFilmsRepository } from './mongo-films.repository';
import { PostgresFilmsRepository } from './postgres-films.repository';

const databaseDriver = process.env.DATABASE_DRIVER ?? 'mongodb';
const isPostgres = databaseDriver === 'postgres';

@Module({
  imports: [
    ...(isPostgres
      ? [TypeormConfigModule]
      : [MongooseModule.forFeature([{ name: Film.name, schema: FilmSchema }])]),
  ],
  controllers: [FilmsController],
  providers: [
    FilmsService,
    {
      provide: FilmsRepository,
      useClass: isPostgres ? PostgresFilmsRepository : MongoFilmsRepository,
    },
  ],
  exports: [FilmsService, FilmsRepository],
})
export class FilmsModule {}
