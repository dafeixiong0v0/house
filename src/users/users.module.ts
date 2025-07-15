import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User, UserSchema } from './schemas/user.schema';

@Module({
  imports: [
    // 注册 User ahema，使其在此模块中可用
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  // 导出 UsersService 和 MongooseModule 以便在其他模块（如 AuthModule）中使用
  exports: [UsersService, MongooseModule],
})
export class UsersModule {}
