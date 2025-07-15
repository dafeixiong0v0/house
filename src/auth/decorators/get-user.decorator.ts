import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * 自定义参数装饰器 @GetUser()
 * 用于从请求对象 (req.user) 中提取用户信息
 * req.user 是由 JwtStrategy 的 validate 方法返回并附加到请求上的
 */
export const GetUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    // 如果 data 参数存在，则返回 user 对象中对应的属性
    if (data) {
      return request.user?.[data];
    }
    // 如果 data 参数不存在，则返回整个 user 对象
    return request.user;
  },
);
