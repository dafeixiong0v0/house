import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HousesService } from './houses.service';
import { HousesController } from './houses.controller';
import { House, HouseSchema } from './schemas/house.schema';
import { AuthModule } from '../auth/auth.module'; // 导入 AuthModule 以使用守卫

@Module({
  imports: [
    MongooseModule.forFeature([{ name: House.name, schema: HouseSchema }]),
    AuthModule, // 导入 AuthModule 以便在控制器中使用 JwtAuthGuard 和 RolesGuard
  ],
  controllers: [HousesController],
  providers: [HousesService],
  exports: [HousesService],
})
export class HousesModule {}
