import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class WechatLoginDto {
  @IsNotEmpty({ message: '微信登录凭证 code 不能为空' })
  @IsString()
  code: string;

  @IsOptional()
  @IsString()
  nickname?: string;

  @IsOptional()
  @IsString()
  avatarUrl?: string;
}
