import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { RoleModule } from 'src/role/role.module';
import * as dotenv from 'dotenv';
import { JwtAccessTokenStrategy } from './strategies/jwt-access.strategy';
import { JwtModule } from '@nestjs/jwt';

dotenv.config();

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtAccessTokenStrategy],
  imports: [
    UsersModule,
    RoleModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
  ]
})
export class AuthModule {}
