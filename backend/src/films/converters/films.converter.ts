import {
  FilmDto,
  FilmScheduleDto,
  FilmsListResponseDto,
  FilmScheduleResponseDto,
} from '../dto/films.dto';

export interface FilmEntity {
  id: string;
  rating?: number;
  director?: string;
  tags?: string[];
  title?: string;
  about?: string;
  description?: string;
  image?: string;
  cover?: string;
  schedule?: Array<{
    id: string;
    daytime?: string | Date;
    hall?: string | number;
    rows?: number;
    seats?: number;
    price?: number;
    taken?: string[];
  }>;
}

function serializeDaytime(daytime?: string | Date): string | undefined {
  if (!daytime) {
    return undefined;
  }

  return daytime instanceof Date ? daytime.toISOString() : daytime;
}

export function toFilmDto(entity: FilmEntity): FilmDto {
  return {
    id: entity.id,
    rating: entity.rating,
    director: entity.director,
    tags: entity.tags,
    title: entity.title,
    about: entity.about,
    description: entity.description,
    image: entity.image,
    cover: entity.cover,
  };
}

export function toFilmScheduleDto(scheduleItem: {
  id: string;
  daytime?: string | Date;
  hall?: string | number;
  rows?: number;
  seats?: number;
  price?: number;
  taken?: string[];
}): FilmScheduleDto {
  return {
    id: scheduleItem.id,
    daytime: serializeDaytime(scheduleItem.daytime),
    hall: scheduleItem.hall != null ? String(scheduleItem.hall) : undefined,
    rows: scheduleItem.rows,
    seats: scheduleItem.seats,
    price: scheduleItem.price,
    taken: scheduleItem.taken,
  };
}

export function toFilmsListResponseDto(
  entities: FilmEntity[],
): FilmsListResponseDto {
  return {
    total: entities.length,
    items: entities.map(toFilmDto),
  };
}

export function toFilmScheduleResponseDto(
  schedule: Array<{
    id: string;
    daytime?: string | Date;
    hall?: string | number;
    rows?: number;
    seats?: number;
    price?: number;
    taken?: string[];
  }>,
): FilmScheduleResponseDto {
  const items = (schedule ?? []).map(toFilmScheduleDto);
  return {
    total: items.length,
    items,
  };
}

export function fromFilmScheduleDtoToEntity(dto: FilmScheduleDto): {
  id: string;
  daytime?: string;
  hall?: string;
  rows?: number;
  seats?: number;
  price?: number;
  taken?: string[];
} {
  return {
    id: dto.id,
    daytime: dto.daytime,
    hall: dto.hall,
    rows: dto.rows,
    seats: dto.seats,
    price: dto.price,
    taken: dto.taken,
  };
}

export function fromFilmDtoToEntity(
  dto: FilmDto,
  schedule?: Array<ReturnType<typeof fromFilmScheduleDtoToEntity>>,
): FilmEntity {
  return {
    id: dto.id,
    rating: dto.rating,
    director: dto.director,
    tags: dto.tags,
    title: dto.title,
    about: dto.about,
    description: dto.description,
    image: dto.image,
    cover: dto.cover,
    schedule: schedule ?? [],
  };
}
