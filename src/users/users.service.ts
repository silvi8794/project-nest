import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { omit } from 'lodash';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User)

    private userRepository: Repository<User>,
  ) { }


  async create(
    { name, email, password, role }
  ) {
    const existingUser = await this.userRepository.findOne({
      where: { email },
      relations: ['role'],
     },
    );

    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    const user = this.userRepository.create({
      name,
      email,
      password,
      role, 
    });
  

    try {
      await this.userRepository.save(user);

      return omit(user, [
        'password',
        'createdAt',
        'updatedAt',
        'deletedAt',
        'role.createdAt',
        'role.updatedAt',
        'role.deletedAt'
      ]);
    } catch (error) {

      throw new InternalServerErrorException('Failed to create user');
    }

  }

  async findAll(): Promise<User[]> {
    const users = await this.userRepository.find();

    users.forEach( user => {
      delete user.password
    });

    return users;
  }


  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ 
      where: {id },
      relations: ['role'],
  });

  if (user){
    delete user.password
  }

  return user;
  }

  async findByEmail(email: string): Promise<User> {
    if (!email) {
      throw new BadRequestException('Email is required');
    }
    const user = await this.userRepository.findOne({
      where: { email },
      relations: ['role']
    });

    return user || null;
  }

  async remove(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }
}
