import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FilmsRepository, ScheduleSession } from '../films/films.repository';
import {
  CreateOrderDto,
  OrderResponseDto,
  TicketResponseDto,
} from './dto/order.dto';

function seatKey(row: number, seat: number): string {
  return `${row}:${seat}`;
}

interface SessionGroup {
  filmId: string;
  sessionId: string;
  session: ScheduleSession;
  tickets: CreateOrderDto['tickets'];
  seats: string[];
}

@Injectable()
export class OrderService {
  constructor(private readonly filmsRepository: FilmsRepository) {}

  async create(createOrderDto: CreateOrderDto): Promise<OrderResponseDto> {
    if (!createOrderDto.tickets?.length) {
      throw new BadRequestException('At least one ticket is required');
    }

    const groupsByKey = new Map<string, SessionGroup>();

    for (const ticket of createOrderDto.tickets) {
      const key = `${ticket.film}:${ticket.session}`;
      const seat = seatKey(ticket.row, ticket.seat);

      let group = groupsByKey.get(key);

      if (!group) {
        const result = await this.filmsRepository.findFilmWithSession(
          ticket.film,
          ticket.session,
        );
        if (!result) {
          throw new NotFoundException(
            `Film ${ticket.film} or session ${ticket.session} not found`,
          );
        }

        group = {
          filmId: ticket.film,
          sessionId: ticket.session,
          session: result.session,
          tickets: [],
          seats: [],
        };
        groupsByKey.set(key, group);
      }

      const rows = group.session.rows ?? 0;
      const seats = group.session.seats ?? 0;
      const taken = new Set([...(group.session.taken ?? []), ...group.seats]);

      if (
        ticket.row < 1 ||
        ticket.row > rows ||
        ticket.seat < 1 ||
        ticket.seat > seats
      ) {
        throw new BadRequestException(
          `Seat ${seat} is out of bounds (rows: 1-${rows}, seats: 1-${seats})`,
        );
      }

      if (taken.has(seat)) {
        throw new BadRequestException(
          `Seat ${seat} is already occupied or duplicated in this order`,
        );
      }

      group.seats.push(seat);
      group.tickets.push(ticket);
    }

    for (const group of groupsByKey.values()) {
      await this.filmsRepository.addTakenSeats(
        group.filmId,
        group.sessionId,
        group.seats,
      );
    }

    const items: TicketResponseDto[] = createOrderDto.tickets.map((ticket) => {
      const key = `${ticket.film}:${ticket.session}`;
      const group = groupsByKey.get(key)!;
      return {
        ...ticket,
        id: crypto.randomUUID(),
        daytime: ticket.daytime ?? group.session.daytime,
        price: ticket.price ?? group.session.price,
      };
    });

    return {
      total: items.length,
      items,
    };
  }
}
