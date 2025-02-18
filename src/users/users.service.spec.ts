import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConflictException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { RoleService } from '../role/role.service';

describe('UsersService', () => {
  let service: UsersService;
  let userRepository: Repository<User>;
  let roleService:RoleService;

  beforeEach(async () => {
    const mockUserRepository = {
      findOneBy: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
      find: jest.fn(),
      update: jest.fn(),
      create: jest.fn(),
      findOne: jest.fn()
    };

    const mockRoleService = {
      findByName: jest.fn()
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository
        },
        {
          provide: RoleService,
          useValue:mockRoleService
        }
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    roleService = module.get<RoleService>(RoleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should throw a ConflictException if user already exists', async () => {
    const userDto = { email: 'test@jest.com', name: 'Test User', password: 'password', role: 'general' };

    userRepository.findOne = jest.fn().mockResolvedValue({
      id: 4,
      name: 'Luis Regular',
      email: 'test@jest.com',
      role: { id: 2, name: 'regular', description: 'Regular' },
    });

    roleService.findByName = jest.fn().mockResolvedValue({
      id: 2, 
      name: 'regular',
      description: 'Regular role description',
    });

    await expect(service.create(userDto)).rejects.toThrow(ConflictException);
    expect(userRepository.findOne).toHaveBeenCalledWith({
      where:
      {
        email: userDto.email
      },
      relations: ['role']
    });
  })
});
