import { RolesGuard } from './roles.guard';
import { Reflector } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext } from '@nestjs/common';

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let mockReflector

  beforeEach(async () => {
    mockReflector = {
      get: jest.fn().mockReturnValue(['admin']),
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

 /* it('should return true if user has required role', async () => {
    const mockContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({
          user: { role: 'admin' }, // Simulamos un usuario con rol 'admin'
        }),
      }),
    } as unknown as ExecutionContext;

    const result = await guard.canActivate(mockContext);

    expect(result).toBe(true);  // Espera que la activación pase si el usuario tiene el rol adecuado
  });

  it('should return false if user does not have required role', async () => {
    const mockContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({
          user: { role: 'user' }, // Simulamos un usuario con rol 'user'
        }),
      }),
    } as unknown as ExecutionContext;

    const result = await guard.canActivate(mockContext);

    expect(result).toBe(false);  // Espera que la activación falle si el usuario no tiene el rol adecuado
  });*/
});