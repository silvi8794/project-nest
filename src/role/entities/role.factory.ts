import { RoleList } from './constants';
import { Role } from './role.entity';
import { DataSource } from 'typeorm';

export const RolesFactory = async (dataSource: DataSource) => {
  const roleRepository = dataSource.getRepository(Role);
  
  const rolesList = [
    {
      name: RoleList.SUPERUSER,
      description: 'Administrador',
    },
    {
      name: RoleList.REGULAR,
      description: 'Regular',
    },
    {
      name: RoleList.ADMIN,
      description: 'Administrador del sitio',
    },
  ];
  await roleRepository.save(rolesList);

};

export { Role } from './role.entity';
