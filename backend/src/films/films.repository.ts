import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Film, FilmDocument } from './schemas/film.schema';
import {
  toFilmsListResponseDto,
  toFilmScheduleResponseDto,
} from './converters/films.converter';
import { FilmsListResponseDto, FilmScheduleResponseDto } from './dto/films.dto';

export interface ScheduleSession {
  id: string;
  rows?: number;
  seats?: number;
  daytime?: string;
  hall?: string | number;
  price?: number;
  taken?: string[];
}

@Injectable()
export class FilmsRepository {
  constructor(
    @InjectModel(Film.name) private readonly filmModel: Model<FilmDocument>,
  ) {}

  async findAll(): Promise<FilmsListResponseDto> {
    const docs = await this.filmModel.find().lean().exec();
    return toFilmsListResponseDto(docs);
  }

  async findScheduleById(id: string): Promise<FilmScheduleResponseDto | null> {
    const doc = await this.filmModel.findOne({ id }).lean().exec();
    if (!doc) return null;
    return toFilmScheduleResponseDto(doc.schedule ?? []);
  }

  async findById(id: string): Promise<FilmDocument | null> {
    return this.filmModel.findOne({ id }).exec();
  }

  async findFilmWithSession(
    filmId: string,
    sessionId: string,
  ): Promise<{ film: FilmDocument; session: ScheduleSession } | null> {
    const film = await this.filmModel.findOne({ id: filmId }).exec();
    if (!film?.schedule) return null;
    const session = film.schedule.find((s) => s.id === sessionId);
    if (!session) return null;
    const sessionPlain: ScheduleSession = {
      id: session.id,
      rows: session.rows,
      seats: session.seats,
      daytime: session.daytime,
      hall: session.hall,
      price: session.price,
      taken: session.taken ?? [],
    };
    return { film, session: sessionPlain };
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
