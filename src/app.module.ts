import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { RoleModule } from './role/role.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mariadb',
      host: process.env.DATABASE_HOST || 'mariadb',
      port: Number(process.env.DATABASE_PORT) || 3306,
      username: process.env.DATABASE_USER || 'root', 
      password: process.env.DATABASE_PASSWORD || 'rootpassword',
      database: process.env.DATABASE_NAME || 'nestjs_db',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
      autoLoadEntities: true,
    }),
    UsersModule,
    RoleModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
