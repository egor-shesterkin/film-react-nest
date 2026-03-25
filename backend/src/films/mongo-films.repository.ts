import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  toFilmsListResponseDto,
  toFilmScheduleResponseDto,
} from './converters/films.converter';
import { Film, FilmDocument } from './schemas/film.schema';
import { FilmsRepository, ScheduleSession } from './films.repository';

@Injectable()
export class MongoFilmsRepository extends FilmsRepository {
  constructor(
    @InjectModel(Film.name) private readonly filmModel: Model<FilmDocument>,
  ) {
    super();
  }

  async findAll() {
    const docs = await this.filmModel.find().lean().exec();
    return toFilmsListResponseDto(docs);
  }

  async findScheduleById(id: string) {
    const doc = await this.filmModel.findOne({ id }).lean().exec();
    if (!doc) return null;
    return toFilmScheduleResponseDto(doc.schedule ?? []);
  }

  async findFilmWithSession(
    filmId: string,
    sessionId: string,
  ): Promise<{ session: ScheduleSession } | null> {
    const film = await this.filmModel.findOne({ id: filmId }).exec();
    if (!film?.schedule) return null;
    const session = film.schedule.find((s) => s.id === sessionId);
    if (!session) return null;
    return {
      session: {
        id: session.id,
        rows: session.rows,
        seats: session.seats,
        daytime: session.daytime,
        hall: session.hall,
        price: session.price,
        taken: session.taken ?? [],
      },
    };
  }

  async addTakenSeats(
    filmId: string,
    sessionId: string,
    seats: string[],
  ): Promise<void> {
    await this.filmModel
      .findOneAndUpdate(
        { id: filmId, 'schedule.id': sessionId },
        { $addToSet: { 'schedule.$.taken': { $each: seats } } },
      )
      .exec();
  }
}
