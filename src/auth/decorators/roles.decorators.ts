import { SetMetadata } from "@nestjs/common";
import { RoleList } from "src/role/entities/constants";

export const Roles = (...role: RoleList[]) => SetMetadata('roles', role);