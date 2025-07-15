import { IsString, MinLength, MaxLength, Matches, IsNotEmpty, IsOptional } from 'class-validator';
import { Match } from '../decorators/match.decorator'; // A custom decorator to check if two fields match

export class RegisterUserDto {
  @IsNotEmpty({ message: '手机号不能为空' })
  @IsString({ message: '手机号必须是字符串' })
  @Matches(/^1[3-9]\d{9}$/, { message: '请输入有效的11位手机号' })
  phone: string;

  @IsNotEmpty({ message: '密码不能为空' })
  @IsString({ message: '密码必须是字符串' })
  @MinLength(6, { message: '密码长度不能少于6位' })
  @MaxLength(20, { message: '密码长度不能超过20位' })
  password: string;

  @IsNotEmpty({ message: '确认密码不能为空' })
  @Match('password', { message: '两次输入的密码不一致' })
  confirmPassword: string;

  @IsOptional()
  @IsString({ message: '昵称必须是字符串' })
  @MaxLength(20, { message: '昵称长度不能超过20位' })
  nickname?: string;
}
