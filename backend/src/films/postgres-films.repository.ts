import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import {
  toFilmsListResponseDto,
  toFilmScheduleResponseDto,
} from './converters/films.converter';
import { FilmEntity } from './entities/film.entity';
import { ScheduleEntity } from './entities/schedule.entity';
import { FilmsRepository, ScheduleSession } from './films.repository';

@Injectable()
export class PostgresFilmsRepository extends FilmsRepository {
  constructor(
    @InjectRepository(FilmEntity)
    private readonly filmRepository: Repository<FilmEntity>,
    @InjectRepository(ScheduleEntity)
    private readonly scheduleRepository: Repository<ScheduleEntity>,
    @InjectDataSource() private readonly dataSource: DataSource,
  ) {
    super();
  }

  async findAll() {
    const films = await this.filmRepository.find();
    return toFilmsListResponseDto(films);
  }

  async findScheduleById(id: string) {
    const film = await this.filmRepository.findOneBy({ id });
    if (!film) {
      return null;
    }

    const schedule = await this.scheduleRepository.find({
      where: { filmId: id },
      order: { daytime: 'ASC' },
    });

    return toFilmScheduleResponseDto(schedule);
  }

  async findFilmWithSession(
    filmId: string,
    sessionId: string,
  ): Promise<{ session: ScheduleSession } | null> {
    const session = await this.scheduleRepository.findOneBy({
      id: sessionId,
      filmId,
    });
    if (!session) {
      return null;
    }

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
    await this.dataSource.transaction(async (manager) => {
      const lockedSession = await manager
        .getRepository(ScheduleEntity)
        .createQueryBuilder('schedule')
        .setLock('pessimistic_write')
        .where('schedule.id = :sessionId', { sessionId })
        .andWhere('schedule.filmId = :filmId', { filmId })
        .getOne();

      if (!lockedSession) {
        return;
      }

      const taken = new Set(lockedSession.taken ?? []);
      for (const seat of seats) {
        if (taken.has(seat)) {
          throw new BadRequestException(`Seat ${seat} is already occupied`);
        }
        taken.add(seat);
      }

      lockedSession.taken = Array.from(taken);
      await manager.getRepository(ScheduleEntity).save(lockedSession);
    });
  }
}
