import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Controller('auth') // 定义此控制器的基础路由为 /auth
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * 用户注册接口
   * @param registerUserDto - 包含手机号和密码的请求体
   */
  @Post('register') // 路径为 /auth/register
  @HttpCode(HttpStatus.CREATED) // 成功时返回 201 Created 状态码
  async register(@Body() registerUserDto: RegisterUserDto) {
    return this.authService.register(registerUserDto);
  }

  /**
   * 用户登录接口
   * @param loginUserDto - 包含手机号和密码的请求体
   */
  @Post('login') // 路径为 /auth/login
  @HttpCode(HttpStatus.OK) // 成功时返回 200 OK 状态码
  async login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }
}
