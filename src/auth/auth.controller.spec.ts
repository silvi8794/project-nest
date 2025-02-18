import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { JwtAccessTokenGuard } from './guards/jwt-access-token/jwt-access-token.guard';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{
        provide: AuthService,
        useValue: {
          register: jest.fn().mockResolvedValue({
            email: "test@jest.com",
            id:1,
            name: "Test Regular",
            role: {
              id: 1,
              name: 'regular',
              description: 'Regular'
            },
            deletedAt: null,
            createdAt: "2025-02-17T23:33:24.000Z",
            updatedAt: "2025-02-17T23:33:24.000Z"
          })
        }
      },
      {
        provide: JwtService,
        useValue: {
          sign: jest.fn().mockReturnValue('mocked-jwt-token'),
        }
      }
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should resgister a user', async () => {
    const dto = { id: 1, email: 'test@jest.com', password: 'password', name: 'Test Regular', role: 'regular' };
    const result = await controller.register(dto);

    expect(result).toEqual(expect.objectContaining({
      id: 1,
      email: 'test@jest.com',
      name: 'Test Regular',
      role: expect.objectContaining({
        id: 1,
        name: 'regular',
        description: "Regular"
      }),
      deletedAt: null,
      createdAt: "2025-02-17T23:33:24.000Z",
      updatedAt: "2025-02-17T23:33:24.000Z"
    }));

    expect(service.register).toHaveBeenCalledWith(dto);
  });
});
