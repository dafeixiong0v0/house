import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/users.service';

// 定义 JWT 载荷的接口
export interface JwtPayload {
  phone: string;
  sub: string; // subject, 通常是用户ID
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      // 从请求的 Authorization 标头中提取 Bearer Token
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // 忽略过期的 token (设为 false，由 Passport 模块自动处理过期)
      ignoreExpiration: false,
      // 使用 .env 文件中的 JWT 密钥进行签名验证
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  /**
   * Passport 首先验证 JWT 的签名并解码 JSON。
   * 然后调用此 validate() 方法，将解码后的 JSON 作为其单个参数。
   * 基于 JWT 的签发方式，我们可以保证在这里收到一个有效的 token。
   * @param payload - 解码后的 JWT 载荷
   * @returns 返回的用户对象将被 NestJS 附加到请求对象上 (e.g., req.user)
   */
  async validate(payload: JwtPayload) {
    // 你可以在这里添加更多的验证逻辑，例如检查用户是否存在于数据库中
    const user = await this.usersService.findByPhone(payload.phone);
    if (!user) {
      throw new UnauthorizedException('用户不存在或凭证无效');
    }
    // 或者检查用户是否被禁用等
    // if (user.isDisabled) {
    //   throw new UnauthorizedException('用户已被禁用');
    // }

    // 返回的用户信息将挂载到 req.user 上
    // 注意：不要返回敏感信息，如密码
    return { userId: payload.sub, phone: payload.phone, roles: user.roles };
  }
}
