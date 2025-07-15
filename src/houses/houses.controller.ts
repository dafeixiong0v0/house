import { Controller, Post, Body, Get, Query, Param, UseGuards } from '@nestjs/common';
import { HousesService } from './houses.service';
import { CreateHouseDto } from './dto/create-house.dto';
import { QueryHousesDto } from './dto/query-houses.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/schemas/user.schema';
import { GetUser } from '../auth/decorators/get-user.decorator';

@Controller('houses')
export class HousesController {
  constructor(private readonly housesService: HousesService) {}

  /**
   * 创建新房源 (仅限房东)
   */
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.LANDLORD, UserRole.ADMIN) // 只有房东或管理员可以发布
  create(
    @Body() createHouseDto: CreateHouseDto,
    @GetUser('userId') userId: string,
  ) {
    return this.housesService.create(createHouseDto, userId);
  }

  /**
   * 获取房源列表 (公开)
   */
  @Get()
  findAll(@Query() queryHousesDto: QueryHousesDto) {
    return this.housesService.findAll(queryHousesDto);
  }

  /**
   * 获取单个房源详情 (公开)
   */
  @Get(':id')
  findById(@Param('id') id: string) {
    return this.housesService.findById(id);
  }
}
