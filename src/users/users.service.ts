import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { RegisterUserDto } from '../auth/dto/register-user.dto'; // DTO for user creation

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  /**
   * 根据手机号查找用户
   * @param phone 手机号
   * @returns 返回用户文档或 null
   */
  async findByPhone(phone: string): Promise<User | null> {
    return this.userModel.findOne({ phone }).exec();
  }

  /**
   * 根据用户ID查找用户
   * @param id 用户ID
   * @returns 返回用户文档或 null
   */
  async findById(id: string): Promise<User | null> {
    return this.userModel.findById(id).exec();
  }

  /**
   * 创建新用户 (通常由 AuthService 调用)
   * @param registerUserDto 用户注册数据传输对象
   * @returns 返回新创建的用户文档
   */
  async create(registerUserDto: RegisterUserDto): Promise<User> {
    const newUser = new this.userModel({
      phone: registerUserDto.phone,
      password: registerUserDto.password,
      nickname: registerUserDto.nickname || `用户_${registerUserDto.phone.slice(-4)}`, // 默认昵称
    });
    return newUser.save();
  }

  // 未来可以添加更多用户管理相关的方法，例如：
  // async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<User> { ... }
  // async deleteUser(id: string): Promise<any> { ... }
}
