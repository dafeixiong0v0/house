import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsArray,
  IsOptional,
  ValidateNested,
  IsLongitude,
  IsLatitude,
  Min,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';

class AddressDto {
  @IsNotEmpty({ message: '省份不能为空' })
  @IsString()
  province: string;

  @IsNotEmpty({ message: '城市不能为空' })
  @IsString()
  city: string;

  @IsNotEmpty({ message: '区域不能为空' })
  @IsString()
  district: string;

  @IsNotEmpty({ message: '街道地址不能为空' })
  @IsString()
  street: string;

  @IsNotEmpty({ message: '经度不能为空' })
  @IsLongitude({ message: '无效的经度' })
  longitude: number;

  @IsNotEmpty({ message: '纬度不能为空' })
  @IsLatitude({ message: '无效的纬度' })
  latitude: number;
}

export class CreateHouseDto {
  @IsNotEmpty({ message: '房源标题不能为空' })
  @IsString()
  @MaxLength(50, { message: '标题长度不能超过50个字符' })
  title: string;

  @IsNotEmpty({ message: '房源描述不能为空' })
  @IsString()
  description: string;

  @IsNotEmpty({ message: '地址信息不能为空' })
  @ValidateNested()
  @Type(() => AddressDto)
  address: AddressDto;

  @IsOptional()
  @IsString()
  communityName?: string;

  @IsNotEmpty({ message: '租金不能为空' })
  @IsNumber({}, { message: '租金必须是数字' })
  @Min(0, { message: '租金不能为负数' })
  rent: number;

  @IsNotEmpty({ message: '付款方式不能为空' })
  @IsString()
  paymentType: string;

  @IsNotEmpty({ message: '面积不能为空' })
  @IsNumber({}, { message: '面积必须是数字' })
  @Min(1, { message: '面积必须大于0' })
  area: number;

  @IsNotEmpty({ message: '户型不能为空' })
  @IsString()
  houseType: string;

  @IsNotEmpty({ message: '楼层不能为空' })
  @IsNumber({}, { message: '楼层必须是数字' })
  floor: number;

  @IsNotEmpty({ message: '总楼层不能为空' })
  @IsNumber({}, { message: '总楼层必须是数字' })
  totalFloors: number;

  @IsOptional()
  @IsString()
  orientation?: string;

  @IsOptional()
  @IsString()
  decoration?: string;

  @IsOptional()
  @IsArray({ message: '图片必须是数组' })
  @IsString({ each: true, message: '图片链接必须是字符串' })
  images?: string[];

  @IsOptional()
  @IsArray({ message: '配套设施必须是数组' })
  @IsString({ each: true, message: '配套设施项目必须是字符串' })
  facilities?: string[];

  @IsOptional()
  @IsArray({ message: '特色标签必须是数组' })
  @IsString({ each: true, message: '特色标签项必须是字符串' })
  tags?: string[];
}
