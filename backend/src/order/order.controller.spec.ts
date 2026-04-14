import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { CreateOrderDto, OrderResponseDto } from './dto/order.dto';

describe('OrderController', () => {
  let controller: OrderController;
  let orderService: jest.Mocked<OrderService>;

  beforeEach(async () => {
    const orderServiceMock: Partial<jest.Mocked<OrderService>> = {
      create: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [{ provide: OrderService, useValue: orderServiceMock }],
    }).compile();

    controller = module.get<OrderController>(OrderController);
    orderService = module.get(OrderService);
  });

  it('creates order using service and returns response', async () => {
    const request: CreateOrderDto = {
      email: 'user@example.com',
      phone: '+79990000000',
      tickets: [
        {
          film: 'film-1',
          session: 'session-1',
          row: 1,
          seat: 2,
        },
      ],
    };
    const response: OrderResponseDto = {
      total: 1,
      items: [
        {
          id: 'ticket-1',
          film: 'film-1',
          session: 'session-1',
          row: 1,
          seat: 2,
          daytime: '10:00',
          price: 500,
        },
      ],
    };
    orderService.create.mockResolvedValue(response);

    await expect(controller.create(request)).resolves.toEqual(response);
    expect(orderService.create).toHaveBeenCalledWith(request);
  });
});
