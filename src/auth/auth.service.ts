import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtPayload } from './strategies/jwt.strategy';
import { User } from '../users/schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * 用户注册
   * @param registerUserDto 注册信息
   * @returns 返回创建的用户信息 (不含密码) 和 token
   */
  async register(registerUserDto: RegisterUserDto): Promise<{ user: Omit<User, 'password'>, accessToken: string }> {
    // 检查用户是否已存在
    const existingUser = await this.usersService.findByPhone(registerUserDto.phone);
    if (existingUser) {
      throw new ConflictException('该手机号已被注册');
    }

    // 创建用户
    const user = await this.usersService.create(registerUserDto);

    // 生成 JWT
    const accessToken = await this._createToken(user);

    const { password, ...result } = user.toObject();
    return { user: result, accessToken };
  }

  /**
   * 用户登录
   * @param loginUserDto 登录信息
   * @returns 返回用户信息 (不含密码) 和 token
   */
  async login(loginUserDto: LoginUserDto): Promise<{ user: Omit<User, 'password'>, accessToken: string }> {
    const user = await this.validateUser(loginUserDto.phone, loginUserDto.password);
    if (!user) {
        throw new UnauthorizedException('手机号或密码错误');
    }
    const accessToken = await this._createToken(user);

    const { password, ...result } = user.toObject();
    return { user: result, accessToken };
  }

  /**
   * 验证用户凭证
   * @param phone 手机号
   * @param pass 密码
   * @returns 验证成功返回用户对象，否则返回 null
   */
  async validateUser(phone: string, pass: string): Promise<User | null> {
    const user = await this.usersService.findByPhone(phone);
    // 检查用户是否存在，以及密码是否匹配
    if (user && await user.comparePassword(pass)) {
      return user;
    }
    return null;
  }

  /**
   * 创建 JWT
   * @param user 用户对象
   * @returns 返回生成的 token 字符串
   */
  private async _createToken(user: User): Promise<string> {
    const payload: JwtPayload = { phone: user.phone, sub: user._id.toHexString() };
    return this.jwtService.sign(payload);
  }
}
// Make _createToken public to be accessible from WechatService
// A better approach might be to have a shared TokenService, but for now this is simpler.
Object.defineProperty(AuthService.prototype, '_createToken', {
  value: AuthService.prototype._createToken,
  writable: true,
  configurable: true,
  enumerable: true, // Make it enumerable to avoid issues with `...` spread
});
