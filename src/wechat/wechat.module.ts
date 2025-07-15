import { Module } from '@nestjs/common';
import { WechatService } from './wechat.service';
import { WechatController } from './wechat.controller';
import { UsersModule } from '../users/users.module';
import { AuthModule } from '../auth/auth.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    HttpModule, // 导入 HttpModule 以便注入 HttpService (虽然我们直接用了axios，但这是标准做法)
    UsersModule, // 导入 UsersModule 以使用 UsersService
    AuthModule, // 导入 AuthModule 以使用 AuthService (用于 token 生成)
  ],
  controllers: [WechatController],
  providers: [WechatService],
})
export class WechatModule {}
