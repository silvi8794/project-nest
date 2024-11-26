import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Roles } from 'src/auth/decorators/roles.decorators';
import { RoleList } from './entities/constants';
import { RolesGuard } from 'src/auth/guards/roles/roles.guard';

@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  @Roles(RoleList.ADMIN)
  @UseGuards(RolesGuard)
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.roleService.create(createRoleDto);
  }

  @Get()
  @Roles(RoleList.ADMIN)
  findAll() {
    return this.roleService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.roleService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateRoleDto: UpdateRoleDto) {
    return this.roleService.update(id, updateRoleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.roleService.remove(id);
  }
}
