import { DataSource } from 'typeorm';
import { RolesFactory } from '../../role/entities/role.factory';
import { dataSource } from '../data-source';

const seedDatabase = async () => {
  try {
    await dataSource.initialize();
    console.log('Semillas ejecutadas correctamente');

    await RolesFactory(dataSource);

    console.log('Seeding completed successfully');
  } catch (error) {
    console.error('Error al ejecutar las semillas:', error);
  } finally {
    await dataSource.destroy();
    console.log('Conexión con la base de datos cerrada');
  }
};

seedDatabase();
