import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { AuthService } from '../auth/auth.service';
import axios from 'axios';
import { WechatLoginDto } from './dto/wechat-login.dto';
import { User } from '../users/schemas/user.schema';

interface WechatSession {
  openid: string;
  session_key: string;
  unionid?: string;
  errcode?: number;
  errmsg?: string;
}

@Injectable()
export class WechatService {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
    private readonly authService: AuthService, // 注入 AuthService 来创建 token
  ) {}

  /**
   * 处理微信登录逻辑
   * @param wechatLoginDto 包含 code 和可选的用户信息
   */
  async login(wechatLoginDto: WechatLoginDto): Promise<{ user: Omit<User, 'password'>, accessToken: string }> {
    const { code, nickname, avatarUrl } = wechatLoginDto;

    // 1. 用 code 换取 openid 和 session_key
    const wechatSession = await this.code2Session(code);
    const { openid } = wechatSession;

    // 2. 根据 openid 查找用户
    let user = await this.usersService.findByWechatOpenid(openid);

    // 3. 如果用户不存在，则创建新用户
    if (!user) {
      user = await this.usersService.createByWechat({
        wechatOpenid: openid,
        nickname: nickname || '微信用户',
        avatar: avatarUrl,
      });
    } else if (nickname || avatarUrl) {
      // 如果用户已存在，但前端传入了新的用户信息，则更新
      user = await this.usersService.updateWechatUserInfo(user.id, { nickname, avatar: avatarUrl });
    }

    // 4. 为用户生成系统的 JWT
    // @ts-ignore
    const accessToken = await this.authService._createToken(user);

    // 5. 返回用户信息和 token
    const { password, ...result } = user.toObject();
    return { user: result, accessToken };
  }

  /**
   * 调用微信 code2Session 接口
   * @param code 前端获取的临时登录凭证
   * @returns 返回微信服务器的 session 数据
   */
  private async code2Session(code: string): Promise<WechatSession> {
    const appid = this.configService.get<string>('WECHAT_APPID');
    const secret = this.configService.get<string>('WECHAT_SECRET');
    const url = `https://api.weixin.qq.com/sns/jscode2session?appid=${appid}&secret=${secret}&js_code=${code}&grant_type=authorization_code`;

    try {
      const response = await axios.get<WechatSession>(url);
      const data = response.data;

      if (data.errcode) {
        throw new InternalServerErrorException(`微信登录失败: ${data.errmsg}`);
      }

      return data;
    } catch (error) {
      // 处理 axios 错误或微信返回的错误
      throw new InternalServerErrorException(`请求微信服务器失败: ${error.message}`);
    }
  }
}
