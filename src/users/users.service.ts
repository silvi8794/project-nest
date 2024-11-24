import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from 'src/role/entities/role.entity';

@Injectable()
export class UsersService {
  
  constructor(
    @InjectRepository(User)
    
    private readonly userRepository: Repository<User>,

    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

 async create(createUserDto: CreateUserDto) {

  const existingUser = await this.userRepository.findOneBy({ email: createUserDto.email });
  if (existingUser) {
    throw new ConflictException('Email already exists');
  }

    const role = await this.roleRepository.findOneBy({ name: createUserDto.role });
    if (!role) {
      throw new NotFoundException('Role not found');
    }
    const user = this.userRepository.create({...createUserDto, role});
    return await this.userRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  
  async findOne(id: number): Promise<User> {
    return await this.userRepository.findOneBy({ id });
  }

  async findByEmail(email: string): Promise<User> {
    return await this.userRepository.findOneBy({ email });
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (updateUserDto.role) {
      const role = await this.roleRepository.findOneBy({ name: updateUserDto.role });
      if (!role) {
        throw new NotFoundException('Role not found');
      }
      user.role = role;
    }
    Object.assign(user, updateUserDto);
  
    return await this.userRepository.save(user);
  }

  async remove(id: number) : Promise<void>{
    await this.userRepository.delete(id);
  }
}
