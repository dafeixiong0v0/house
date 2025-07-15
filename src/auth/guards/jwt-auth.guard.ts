import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  // 你可以在这里重写 handleRequest 或 canActivate 方法以添加自定义逻辑
  // 例如，如果你的应用中有公开和私有路由混合，可以在这里处理
  // canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
  //   // 在这里添加自定义的认证逻辑
  //   return super.canActivate(context);
  // }
  // handleRequest(err, user, info) {
  //   // 你可以重写这个方法来抛出自定义的异常
  //   if (err || !user) {
  //     throw err || new UnauthorizedException();
  //   }
  //   return user;
  // }
}
