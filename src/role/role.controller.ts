import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards

} from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Roles } from '../auth/decorators/roles.decorators';
import { RoleList } from './entities/constants';
import { RolesGuard } from '../auth/guards/roles/roles.guard';
import { JwtAccessTokenGuard } from '../auth/guards/jwt-access-token/jwt-access-token.guard';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger';

@ApiTags('roles')
@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) { }
  /**
   * Create a new Role
   * @param createRoleDto : name
   */
  @Post()
  @Roles(RoleList.ADMIN)
  @ApiOperation({ summary: 'Create a new Role (only for ADMIN)' })
  @ApiBearerAuth()
  @UseGuards(JwtAccessTokenGuard, RolesGuard)
  @ApiBody({
    description: 'Data required to create a new Role',
    type: CreateRoleDto
  })
  @ApiResponse({
    status: 201,
    description: 'Role created successfully',
    schema: {
      example: {
        id: 1,
        name: 'admin',
        description: 'Administrator role'
      }
    }
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden. Role not allowed to create a new Role'
  })
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.roleService.create(createRoleDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all Roles' })
  @ApiResponse({
    status: 200,
    description: 'Returns all Roles',
    schema: {
      example: [
        {
          id: 1,
          name: 'admin',
          description: 'Administrator role'
        },
        {
          id: 2,
          name: 'regular',
          description: 'Regular role'
        }
      ]
    }
  })
  @Roles(RoleList.ADMIN)
  @ApiBearerAuth()
  @UseGuards(JwtAccessTokenGuard, RolesGuard)
  @ApiResponse({ status: 403, description: 'Forbidden. Role not allowed to get all Roles' })
  findAll() {
    return this.roleService.findAll();
  }

  /**
   * Get a Role by ID
   * @param id 
   */
  @Get(':id')
  @ApiOperation({ summary: 'Get a Role by ID' })
  @ApiParam({
    name: 'id',
    description: 'The ID of the Role to get',
    example: 1
  })
  @ApiResponse({
    status: 200,
    description: 'Returns the Role with the specified ID',
    schema: {
      example: {
        id: 1,
        name: 'admin',
        description: 'Administrator role'
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Role not found' })
  findOne(@Param('id') id: number) {
    return this.roleService.findOne(id);
  }

  /**
   * Update a Role by ID
   * @param id 
   * @param updateRoleDto : name
   */
  @Patch(':id')
  @Roles(RoleList.ADMIN)
  @UseGuards(JwtAccessTokenGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a Role by ID (only for ADMIN)' })
  @ApiParam({
    name: 'id',
    description: 'The ID of the Role to update',
    example: 1
  })
  @ApiBody({
    description: 'Data required to update a Role',
    type: UpdateRoleDto
  })
  @ApiResponse({
    status: 200,
    description: 'Role updated successfully',
    schema: {
      example: {
        id: 1,
        name: 'admin',
        description: 'Updated description'
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Role not found' })
  update(@Param('id') id: number, @Body() updateRoleDto: UpdateRoleDto) {
    return this.roleService.update(id, updateRoleDto);
  }

  @Delete(':id')
  @Roles(RoleList.ADMIN)
  @UseGuards(JwtAccessTokenGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a Role by ID (only for ADMIN)' })
  @ApiParam({
    name: 'id',
    description: 'The ID of the Role to delete',
    example: 1
  })
  @ApiResponse({ status: 200, description: 'Role deleted successfully' })
  @ApiResponse({ status: 404, description: 'Role not found' })
  remove(@Param('id') id: number) {
    return this.roleService.remove(id);
  }
}
