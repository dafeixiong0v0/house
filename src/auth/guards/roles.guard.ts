import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../../users/schemas/user.schema';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // 获取路由处理程序上设置的角色元数据
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // 如果路由没有设置角色要求，则允许访问
    if (!requiredRoles) {
      return true;
    }

    // 从请求中获取用户信息 (由 JwtAuthGuard 附加)
    const { user } = context.switchToHttp().getRequest();

    // 检查用户的角色是否包含至少一个所需角色
    return requiredRoles.some((role) => user.roles?.includes(role));
  }
}
