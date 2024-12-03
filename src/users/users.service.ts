import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { RegisterDto } from 'src/auth/dto/register.dto';

@Injectable()
export class UsersService {
  
  constructor(
    @InjectRepository(User)
    
    private userRepository: Repository<User>,
  ) {}


 async create(
  {name, email, password, role}
  ) {
    const user = this.userRepository.create({name, email, password, role});
    return await this.userRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  
  async findOne(id: number): Promise<User> {
    return await this.userRepository.findOneBy({ id });
  }

  async findByEmail(email: string): Promise<User> {
    return await this.userRepository.findOne({ 
      where: { email },
      relations: ['role']
    });
  }

  async remove(id: number) : Promise<void>{
    await this.userRepository.delete(id);
  }
}
