import { Test, TestingModule } from '@nestjs/testing';
import { FilmsController } from './films.controller';
import { FilmsService } from './films.service';
import { FilmScheduleResponseDto, FilmsListResponseDto } from './dto/films.dto';

describe('FilmsController', () => {
  let controller: FilmsController;
  let filmsService: jest.Mocked<FilmsService>;

  beforeEach(async () => {
    const filmsServiceMock: Partial<jest.Mocked<FilmsService>> = {
      findAll: jest.fn(),
      findSchedule: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilmsController],
      providers: [{ provide: FilmsService, useValue: filmsServiceMock }],
    }).compile();

    controller = module.get<FilmsController>(FilmsController);
    filmsService = module.get(FilmsService);
  });

  it('returns list of films from service', async () => {
    const response: FilmsListResponseDto = {
      total: 1,
      items: [{ id: 'film-1', title: 'Interstellar' }],
    };
    filmsService.findAll.mockResolvedValue(response);

    await expect(controller.findAll()).resolves.toEqual(response);
    expect(filmsService.findAll).toHaveBeenCalledTimes(1);
  });

  it('returns schedule for requested film id', async () => {
    const response: FilmScheduleResponseDto = {
      total: 1,
      items: [{ id: 'session-1', daytime: '10:00', hall: 'Red' }],
    };
    filmsService.findSchedule.mockResolvedValue(response);

    await expect(controller.findSchedule('film-1')).resolves.toEqual(response);
    expect(filmsService.findSchedule).toHaveBeenCalledWith('film-1');
  });
});
