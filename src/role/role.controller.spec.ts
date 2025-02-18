import { Test, TestingModule } from '@nestjs/testing';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { JwtModule, JwtService } from '@nestjs/jwt';

describe('RoleController', () => {
  let controller: RoleController;
  let service: RoleService;

  const mockRoleRepository = {
    find: jest.fn().mockResolvedValue([{ id: 1, name: 'Admin' }]),
    findOne: jest.fn().mockResolvedValue({ id: 1, name: 'Admin' }),
    save: jest.fn().mockResolvedValue({ id: 1, name: 'New Role' }),
    update: jest.fn().mockResolvedValue({ id: 1, name: 'Updated Role' }),
    delete: jest.fn().mockResolvedValue({ affected: 1 }),
  };
  const mockJwtService = {
    sign: jest.fn().mockReturnValue('mocked-jwt-token'),
    verify: jest.fn().mockReturnValue({ userId: 1 }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RoleController],
      imports: [JwtModule.register({ secret: 'your_secret_key' })],
      providers: [
        RoleService,
        {
          provide: getRepositoryToken(Role),
          useValue: mockRoleRepository
        },
        {
          provide: JwtService,
          useValue:mockJwtService
        }
      ],
    }).compile();

    controller = module.get<RoleController>(RoleController);
    service = module.get<RoleService>(RoleService)
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
