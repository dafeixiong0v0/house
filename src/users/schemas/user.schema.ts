import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';

// 用户角色枚举
export enum UserRole {
  TENANT = 'tenant', // 租户
  LANDLORD = 'landlord', // 房东
  ADMIN = 'admin', // 系统管理员
}

// 实名认证状态枚举
export enum VerificationStatus {
  PENDING = 'pending', // 待审核
  APPROVED = 'approved', // 审核通过
  REJECTED = 'rejected', // 审核拒绝
  NOT_SUBMITTED = 'not_submitted', // 未提交
}

@Schema({ timestamps: true }) // 自动添加 createdAt 和 updatedAt 时间戳
export class User extends Document {
  @Prop({ type: String, required: true, unique: true, index: true })
  phone: string; // 手机号，唯一且建立索引

  @Prop({ type: String, required: false }) // 如果主要使用验证码登录，密码可以非必需
  password?: string; // 密码

  @Prop({ type: String, default: '新用户' })
  nickname: string; // 昵称

  @Prop({ type: String, default: null })
  avatar?: string; // 头像 URL

  @Prop({ type: [String], enum: UserRole, default: [UserRole.TENANT] })
  roles: UserRole[]; // 用户角色数组，默认为租户

  @Prop({ type: String, default: null })
  realName?: string; // 真实姓名

  @Prop({ type: String, default: null })
  idCard?: string; // 身份证号，如果存储，建议加密

  @Prop({ type: Boolean, default: false })
  isVerified: boolean; // 是否已实名认证

  @Prop({ type: String, enum: VerificationStatus, default: VerificationStatus.NOT_SUBMITTED })
  verificationStatus: VerificationStatus; // 实名认证状态

  @Prop({ type: [SchemaTypes.ObjectId], ref: 'House', default: [] })
  favorites: Types.ObjectId[]; // 收藏的房源ID列表

  // Mongoose 自动添加 createdAt 和 updatedAt
  createdAt: Date;
  updatedAt: Date;

  // 比较密码的方法
  async comparePassword(attempt: string): Promise<boolean> {
    if (!this.password) return false;
    return bcrypt.compare(attempt, this.password);
  }
}

export const UserSchema = SchemaFactory.createForClass(User);

// Mongoose 的 pre-save 钩子，在保存用户前自动哈希密码
UserSchema.pre<User>('save', async function (next) {
  // 仅当密码字段被修改且存在时才哈希
  if (this.isModified('password') && this.password) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

// 索引可以提高查询性能
UserSchema.index({ roles: 1 }); // 为用户角色字段创建索引
UserSchema.index({ verificationStatus: 1 }); // 为认证状态字段创建索引
