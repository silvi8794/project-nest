import { RolesGuard } from './roles.guard';
import { Reflector } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, ForbiddenException } from '@nestjs/common';

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let mockReflector

  beforeEach(async () => {
    mockReflector = {
      getAllAndOverride: jest.fn().mockReturnValue(['admin']),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RolesGuard,
        {
          provide: Reflector,
          useValue: mockReflector,
        },
      ],
    }).compile();

    guard = module.get<RolesGuard>(RolesGuard);
  });
  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should return true if user has required role', async () => {
    const mockContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({
          user: { role: 'admin' },
        }),
      }),
      getHandler: jest.fn().mockReturnValue({}),
      getClass: jest.fn().mockReturnValue({}),
    } as unknown as ExecutionContext;


    const result = await guard.canActivate(mockContext);

    expect(result).toBe(true);
  });

  it('should return false if user does not have required role', async () => {
    const mockContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({
          user: { role: 'user' },
        }),
      }),
      getHandler: jest.fn().mockReturnValue({}),
      getClass: jest.fn().mockReturnValue({}),
    } as unknown as ExecutionContext;

    expect(() => guard.canActivate(mockContext)).toThrow(ForbiddenException);
  });
});