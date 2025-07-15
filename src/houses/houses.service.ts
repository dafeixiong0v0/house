import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { House } from './schemas/house.schema';
import { CreateHouseDto } from './dto/create-house.dto';
import { QueryHousesDto } from './dto/query-houses.dto';

@Injectable()
export class HousesService {
  constructor(
    @InjectModel(House.name) private readonly houseModel: Model<House>,
  ) {}

  /**
   * 创建新房源
   * @param createHouseDto 房源创建数据
   * @param landlordId 房东的用户ID
   */
  async create(createHouseDto: CreateHouseDto, landlordId: string): Promise<House> {
    const { address, ...restOfDto } = createHouseDto;

    const newHouse = new this.houseModel({
      ...restOfDto,
      landlord: new Types.ObjectId(landlordId),
      address: {
        ...address,
        fullAddress: `${address.province}${address.city}${address.district}${address.street}`,
        location: {
          type: 'Point',
          coordinates: [address.longitude, address.latitude],
        },
      },
    });
    return newHouse.save();
  }

  /**
   * 查询房源列表（支持分页、筛选、排序和地理空间查询）
   * @param queryDto 查询参数
   */
  async findAll(queryDto: QueryHousesDto): Promise<{ data: House[], count: number }> {
    const { page = 1, limit = 10, keyword, district, minRent, maxRent, houseType, sortBy, longitude, latitude, radius } = queryDto;
    const query: any = {};

    if (keyword) {
      query.$text = { $search: keyword };
    }
    if (district) {
      query['address.district'] = district;
    }
    if (minRent !== undefined || maxRent !== undefined) {
      query.rent = {};
      if (minRent !== undefined) query.rent.$gte = minRent;
      if (maxRent !== undefined) query.rent.$lte = maxRent;
    }
    if (houseType) {
      query.houseType = houseType;
    }

    // 地理空间查询
    if (longitude !== undefined && latitude !== undefined && radius !== undefined) {
      query['address.location'] = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [longitude, latitude],
          },
          $maxDistance: radius, // in meters
        },
      };
    }

    const sortOption: any = {};
    switch (sortBy) {
      case 'rent_asc':
        sortOption.rent = 1;
        break;
      case 'rent_desc':
        sortOption.rent = -1;
        break;
      case 'area_asc':
        sortOption.area = 1;
        break;
      case 'area_desc':
        sortOption.area = -1;
        break;
      case 'newest':
      default:
        sortOption.createdAt = -1;
        break;
    }

    const count = await this.houseModel.countDocuments(query);
    const data = await this.houseModel
      .find(query)
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('landlord', 'nickname avatar') // 关联查询房东信息
      .exec();

    return { data, count };
  }

  /**
   * 根据ID查找房源详情
   * @param id 房源ID
   */
  async findById(id: string): Promise<House> {
    return this.houseModel.findById(id).populate('landlord', 'nickname avatar').exec();
  }

  // 未来可以添加更新、删除等方法
  // async update(id: string, updateHouseDto: UpdateHouseDto, userId: string): Promise<House> { ... }
  // async remove(id: string, userId: string): Promise<any> { ... }
}
