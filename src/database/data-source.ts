import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
dotenv.config();

export const dataSource = new DataSource({
  type: 'mariadb', // O el motor de base de datos que uses
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT),
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: ['src/**/*.entity.ts'], // Agrega todas tus entidades aquí
  synchronize: false,
  migrations: ['./src/database/migrations/*.ts'],
});
