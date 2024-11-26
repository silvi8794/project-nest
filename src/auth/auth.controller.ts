import { Controller, Post, Body, Get, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import {  RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAccessTokenGuard } from './guards/jwt-access-token/jwt-access-token.guard';
import { Request } from 'express';
import { RequestWithUser } from './interfaces/interfaces';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService
  ) {}

  @Post('login')
  async login(
    @Body() loginDto: LoginDto
  ) {
    return await this.authService.login(loginDto);
  }

  @Post('register')
  async register(
    @Body() registerDto: RegisterDto
  ) {
    return await this.authService.register(registerDto);
  }

  @Get('profile')
  @UseGuards(JwtAccessTokenGuard)
  profile(
    @Req() req: RequestWithUser
    ) {
    return this.authService.profile({
      email: req.user.email,
      role: req.user.role
    });
  }
}
