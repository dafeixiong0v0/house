import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../../users/schemas/user.schema';

export const ROLES_KEY = 'roles';
/**
 * 自定义角色装饰器 @Roles()
 * 用于为路由处理程序设置所需的角色
 * @param roles - 允许访问的角色数组
 */
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
