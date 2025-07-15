import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { WechatService } from './wechat.service';
import { WechatLoginDto } from './dto/wechat-login.dto';

@Controller('wechat')
export class WechatController {
  constructor(private readonly wechatService: WechatService) {}

  /**
   * 微信登录接口
   * @param wechatLoginDto - 包含微信 code 和可选的用户信息
   */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() wechatLoginDto: WechatLoginDto) {
    return this.wechatService.login(wechatLoginDto);
  }
}
