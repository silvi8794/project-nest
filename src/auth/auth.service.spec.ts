import { 
    Test, 
    TestingModule 
  } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { RoleService } from '../role/role.service';
import * as bcrypt from 'bcrypt';
import {
        ConflictException,
        NotFoundException,
        InternalServerErrorException
    }
from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

describe('AuthService', () => {
  let service: AuthService;
  let userService: UsersService;
  let roleService: RoleService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue:{
            findByEmail: jest.fn(),
            create: jest.fn()
          }
        },
        {
          provide: RoleService,
          useValue: {
            findByName: jest.fn()
          }
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('mocked-jwt-tkn')
          }
        }
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get<UsersService>(UsersService);
    roleService = module.get<RoleService>(RoleService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should successfully register a user', async() => {
      const dto = { email: 'test@jest.com', password: 'password', name: 'Test User', role: 'regular'};
      const hashedPassword = 'hashed-password';
      const role = { id: 1, name: 'regular', description: 'Regular' };

      userService.findByEmail = jest.fn().mockResolvedValue(null);
      roleService.findByName = jest.fn().mockResolvedValue(role);
      userService.create = jest.fn().mockResolvedValue({
        id: 1,
        email: dto.email,
        name: dto.name,
        password: hashedPassword,
        role: role,
        deletedAt: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      const result = await service.register(dto);

      expect(result).toEqual(expect.objectContaining({
        id: 1,
        email: dto.email,
        name: dto.name,
        role: expect.objectContaining({
          id: 1,
          name: 'regular',
          description: 'Regular'
        }),
        deletedAt: null,
        createdAt: expect.any(String),
        updatedAt: expect.any(String)
      }));

      expect(userService.findByEmail).toHaveBeenCalledWith(dto.email);
      expect(roleService.findByName).toHaveBeenCalledWith(dto.role);
      expect(userService.create).toHaveBeenCalledWith({
        name: dto.name,
        email: dto.email,
        password: expect.any(String),
        role: role
      });
    });

    it('should throw an error if email already exists', async () => {
      const dto = { email: 'test@jest.com', password: 'password', name: 'Test User', role: 'regular' };

      userService.findByEmail = jest.fn().mockResolvedValue({});

      await expect(service.register(dto)).rejects.toThrow(ConflictException);
    });

    it('should throw an error if role is not found', async () => {
      const dto = { email: 'test@jest.com', password: 'password', name: 'Test User', role: 'regular' };

      userService.findByEmail = jest.fn().mockResolvedValue(null);
      roleService.findByName = jest.fn().mockResolvedValue(null);

      await expect(service.register(dto)).rejects.toThrow(NotFoundException);
    });

    it('should throw an internal server error if user creation fails', async () => {
      const dto = { email: 'test@jest.com', password: 'password', name: 'Test User', role: 'regular' };
      const role = { id: 1, name: 'regular', description: 'Regular' };

      userService.findByEmail = jest.fn().mockResolvedValue(null);
      roleService.findByName = jest.fn().mockResolvedValue(role);
      userService.create = jest.fn().mockRejectedValue(new Error('Database Error'));

      await expect(service.register(dto)).rejects.toThrow(InternalServerErrorException);
    });
  })
});
