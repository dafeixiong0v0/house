import { IsOptional, IsString, IsNumber, Min, Max, IsIn } from 'class-validator';
import { Type } from 'class-transformer';

export class QueryHousesDto {
  @IsOptional()
  @IsString()
  keyword?: string; // 关键词，用于全文搜索

  @IsOptional()
  @IsString()
  district?: string; // 按区域筛选

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  minRent?: number; // 最低租金

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  maxRent?: number; // 最高租金

  @IsOptional()
  @IsString()
  houseType?: string; // 按户型筛选

  @IsOptional()
  @IsString()
  @IsIn(['rent_asc', 'rent_desc', 'area_asc', 'area_desc', 'newest'])
  sortBy?: 'rent_asc' | 'rent_desc' | 'area_asc' | 'area_desc' | 'newest'; // 排序方式

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  page?: number = 1; // 页码

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  @Max(100)
  limit?: number = 10; // 每页数量

  // --- 地图找房相关参数 ---
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  longitude?: number; // 中心点经度

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  latitude?: number; // 中心点纬度

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  radius?: number; // 搜索半径 (米)
}
