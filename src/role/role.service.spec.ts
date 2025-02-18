import { 
  Test, 
  TestingModule 
} from '@nestjs/testing';
import { RoleService } from './role.service';
import { Role }from './entities/role.entity';
import { Repository } from 'typeorm';
import { ConflictException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('RoleService', () => {
  let service: RoleService;
  let roleRepository: Repository<Role>;

  beforeEach(async () => {
    const mockRoleRepository = {
      findOneBy: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
      find: jest.fn(),
      update: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoleService,
        {
          provide:getRepositoryToken(Role),
          useValue: mockRoleRepository
        }
      ],
    }).compile();

    service = module.get<RoleService>(RoleService);
    roleRepository = module.get<Repository<Role>>(getRepositoryToken(Role));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findByName', () => {
    it('should return a role by name', async () => {
      const roleName = 'admin';
      const role = { id: 1, name: 'admin', description: 'Administrator role' };

      roleRepository.findOneBy = jest.fn().mockResolvedValue(role);

      const result = await service.findByName(roleName);

      expect(result).toEqual(role);
      expect(roleRepository.findOneBy).toHaveBeenCalledWith({ name: roleName });
    });
  });


  it('should throw an error if role not found', async() => {
    const roleName = 'admin';
    roleRepository.findOneBy = jest.fn().mockResolvedValue(null);

    await expect(service.findByName(roleName)).rejects.toThrowError('Role not found');
    expect(roleRepository.findOneBy).toHaveBeenCalledWith({ name: roleName });

  });

  describe('create', () => {
    it('should create a role', async () => {
      const roleDto = { name: 'admin', description: 'Administrator role' };
      const createdRole = { id: 1, ...roleDto };

      roleRepository.save = jest.fn().mockResolvedValue(createdRole);

      const result = await service.create(roleDto);

      expect(result).toEqual(createdRole);
      expect(roleRepository.save).toHaveBeenCalledWith(roleDto);
    });

    it('should throw a ConflictException if role already exists', async () => {
      const roleDto = { name: 'admin', description: 'Administrator role' };

  
      roleRepository.findOneBy = jest.fn().mockResolvedValue({ id: 1, ...roleDto });

      await expect(service.create(roleDto)).rejects.toThrow(ConflictException);
      expect(roleRepository.findOneBy).toHaveBeenCalledWith({ name: roleDto.name });
    });
  });

});
