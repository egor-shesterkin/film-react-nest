import { FilmScheduleResponseDto, FilmsListResponseDto } from './dto/films.dto';

export interface ScheduleSession {
  id: string;
  rows?: number;
  seats?: number;
  daytime?: string;
  hall?: string | number;
  price?: number;
  taken?: string[];
}

export abstract class FilmsRepository {
  abstract findAll(): Promise<FilmsListResponseDto>;
  abstract findScheduleById(id: string): Promise<FilmScheduleResponseDto | null>;
  abstract findFilmWithSession(
    filmId: string,
    sessionId: string,
  ): Promise<{ session: ScheduleSession } | null>;
  abstract addTakenSeats(
    filmId: string,
    sessionId: string,
    seats: string[],
  ): Promise<void>;
}
