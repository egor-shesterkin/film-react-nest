import { Injectable, NotFoundException } from '@nestjs/common';
import { FilmsRepository } from './films.repository';
import { FilmsListResponseDto, FilmScheduleResponseDto } from './dto/films.dto';

@Injectable()
export class FilmsService {
  constructor(private readonly filmsRepository: FilmsRepository) {}

  async findAll(): Promise<FilmsListResponseDto> {
    return this.filmsRepository.findAll();
  }

  async findSchedule(id: string): Promise<FilmScheduleResponseDto> {
    const result = await this.filmsRepository.findScheduleById(id);
    if (!result) {
      throw new NotFoundException(`Film with id ${id} not found`);
    }
    return result;
  }
}
