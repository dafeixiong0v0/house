import { Controller, Get, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';

@Controller('users') // 定义此控制器的基础路由为 /users
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * 获取当前登录用户信息的接口
   * @UseGuards(JwtAuthGuard) - 这个守卫会保护此路由，确保只有携带有效JWT的请求才能访问
   * @GetUser() - 这个自定义装饰器会从请求中提取由JWT策略附加的用户信息
   */
  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getProfile(@GetUser() user: any) {
    // user 对象是 JwtStrategy.validate 方法返回的对象
    // { userId: '...', phone: '...', roles: [...] }
    const fullUser = await this.usersService.findById(user.userId);
    // 从完整用户信息中剔除密码等敏感信息再返回
    const { password, ...result } = fullUser.toObject();
    return result;
  }

  // 未来可以添加更多用户相关的路由，例如：
  // @Patch('me')
  // @UseGuards(JwtAuthGuard)
  // async updateProfile(@GetUser('userId') userId: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.usersService.updateUser(userId, updateUserDto);
  // }
}
