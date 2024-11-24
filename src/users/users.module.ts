import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from 'src/role/entities/role.entity';
import { RoleService } from 'src/role/role.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role])],
  controllers: [UsersController],
  providers: [UsersService, RoleService],
  exports: [UsersService, RoleService],
})
export class UsersModule {}
