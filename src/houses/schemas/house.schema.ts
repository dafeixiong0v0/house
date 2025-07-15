import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';
import { User } from '../../users/schemas/user.schema';

// 地址和地理位置的嵌套 Schema
@Schema({ _id: false }) // 不为此嵌套对象生成 _id
class Address {
  @Prop({ type: String, required: true })
  province: string; // 省份

  @Prop({ type: String, required: true })
  city: string; // 城市

  @Prop({ type: String, required: true })
  district: string; // 区域

  @Prop({ type: String, required: true })
  street: string; // 街道/详细地址

  @Prop({ type: String, required: true })
  fullAddress: string; // 完整地址

  // GeoJSON Point for geospatial queries
  @Prop({
    type: {
      type: String,
      enum: ['Point'],
      required: true,
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
    },
  })
  location: {
    type: 'Point';
    coordinates: [number, number];
  };
}
export const AddressSchema = SchemaFactory.createForClass(Address);


// 房源状态枚举
export enum HouseStatus {
  PUBLISHED = 'published', // 已发布
  UNPUBLISHED = 'unpublished', // 未发布
  PENDING_REVIEW = 'pending_review', // 待审核
  REJECTED = 'rejected', // 审核拒绝
}

@Schema({ timestamps: true })
export class House extends Document {
  @Prop({ type: SchemaTypes.ObjectId, ref: 'User', required: true, index: true })
  landlord: Types.ObjectId; // 房东ID

  @Prop({ type: String, required: true, trim: true })
  title: string; // 房源标题

  @Prop({ type: String, required: true })
  description: string; // 详细描述

  @Prop({ type: AddressSchema, required: true })
  address: Address; // 地址信息

  @Prop({ type: String })
  communityName?: string; // 小区名称

  @Prop({ type: Number, required: true })
  rent: number; // 租金 (元/月)

  @Prop({ type: String, required: true })
  paymentType: string; // 付款方式 (如：押一付三)

  @Prop({ type: Number, required: true })
  area: number; // 面积 (平方米)

  @Prop({ type: String, required: true })
  houseType: string; // 户型 (如: "三室一厅")

  @Prop({ type: Number, required: true })
  floor: number; // 所在楼层

  @Prop({ type: Number, required: true })
  totalFloors: number; // 总楼层

  @Prop({ type: String })
  orientation?: string; // 朝向 (如：南、南北)

  @Prop({ type: String })
  decoration?: string; // 装修情况 (精装、简装)

  @Prop({ type: [String], default: [] })
  images: string[]; // 房屋图片URL列表

  @Prop({ type: [String], default: [] })
  facilities: string[]; // 配套设施列表

  @Prop({ type: [String], default: [] })
  tags: string[]; // 特色标签

  @Prop({ type: String, enum: HouseStatus, default: HouseStatus.PENDING_REVIEW })
  status: HouseStatus; // 房源状态

  @Prop({ type: Number, default: 0 })
  viewCount: number; // 浏览量

  // 更多字段可以后续添加...
  // 例如，房源真实性评分、位置准确性评分等
}

export const HouseSchema = SchemaFactory.createForClass(House);

// 为 title 和 description 创建文本索引以支持全文搜索
HouseSchema.index({ title: 'text', description: 'text', communityName: 'text' });

// 为地理位置创建 2dsphere 索引以支持地理空间查询
HouseSchema.index({ 'address.location': '2dsphere' });

// 其他常用查询字段的索引
HouseSchema.index({ rent: 1 });
HouseSchema.index({ area: 1 });
HouseSchema.index({ status: 1 });
