import { 
  Body, 
  ConflictException, 
  Injectable, 
  NotFoundException 
} from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcryptjs';
import { RoleService } from 'src/role/role.service';

@Injectable()
export class AuthService {

  constructor(
    private readonly usersService: UsersService,
    private readonly roleService: RoleService
  ){
    
  }
  async register(
    @Body() {name, email, password, role}: RegisterDto
  ) {
    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }
  
      const existingRole = await this.roleService.findByName(role);
      if (!existingRole) {
        throw new NotFoundException('Role not found');
      }
      return await this.usersService.create({
        name,
        email,
        password: await bcrypt.hash(password, 10),
        role
      });
      

  } 

  login() {
    return 'Login';
  } 
}
