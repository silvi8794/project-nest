import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException
}
  from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RoleList } from '../../../role/entities/constants';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector
  ) { }
  canActivate(context: ExecutionContext): boolean {

    const requiredRoles = this.reflector.getAllAndOverride<RoleList[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
   
    const request = context.switchToHttp().getRequest();

    const user = request.user;

   /* if (user) {
      console.log('Usuario autenticado y roles:', user);
    } else {
      console.log('No hay usuario autenticado');
    }*/

    if (!user) {
      throw new UnauthorizedException('User not authenticated');
    }

    if (!requiredRoles) {
      return true;
    }

    if (Array.isArray(requiredRoles)) {
      const hasRole = requiredRoles.some((role) => user.role === role); 
      if (!hasRole) {
        throw new ForbiddenException('You are not authorized to access this resource');
      }
    } else {
      if (user.role !== requiredRoles) {
        throw new ForbiddenException('You are not authorized to access this resource');
      }
    }

    return true;
  }
}
