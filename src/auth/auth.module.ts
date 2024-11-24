import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { RoleModule } from 'src/role/role.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [UsersModule, RoleModule]
})
export class AuthModule {}
