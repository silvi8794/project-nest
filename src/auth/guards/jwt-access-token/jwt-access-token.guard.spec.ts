import { JwtAccessTokenGuard } from './jwt-access-token.guard';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';

describe('JwtAccessTokenGuard', () => {
  let guard: JwtAccessTokenGuard;
  let mockJwtService;

  beforeEach(async () => {
    mockJwtService = {
      verify: jest.fn().mockReturnValue({ userId: 1 }),
      sign: jest.fn().mockReturnValue('mocked-token'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtAccessTokenGuard,
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();
    guard = module.get<JwtAccessTokenGuard>(JwtAccessTokenGuard);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

 /* it('should verify the token', async () => {
    const mockContext ={
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({
          headers: { authorization: 'Bearer mocked-token' },
        }),
      }),
    } as unknown as ExecutionContext;
    const result = await guard.canActivate(mockContext); 
    expect(result).toBe(true);
    expect(mockJwtService.verify).toHaveBeenCalledWith('mocked-token'); 
  });*/
});
