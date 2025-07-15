import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module'; // 认证模块
import { UsersModule } from './users/users.module'; // 用户模块
// import { HousesModule } from './houses/houses.module'; // 房源模块 (占位)

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // 使 ConfigModule 在全局可用
      envFilePath: '.env', // 指定 .env 文件的路径
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
      }),
      inject: [ConfigService],
    }),
    AuthModule, // 导入认证模块
    UsersModule, // 导入用户模块
    // HousesModule, // 当房源模块创建后取消注释
  ],
  controllers: [AppController], // 根模块的控制器
  providers: [AppService], // 根模块的服务
})
export class AppModule {}
