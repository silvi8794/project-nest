import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RoleList } from 'src/role/entities/constants';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector
  ) {}
  canActivate(
    context: ExecutionContext,
  ): boolean {
    const roles = this.reflector.getAllAndOverride<RoleList[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    console.log(roles);
    return true;
  }
}
