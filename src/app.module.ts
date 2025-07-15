import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module'; // Corrected path
import { UsersModule } from './users/users.module'; // Corrected path
// import { HousesModule } from './houses/houses.module'; // Placeholder for HousesModule

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes ConfigModule available globally
      envFilePath: '.env', // Specifies the path to the .env file
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
      }),
      inject: [ConfigService],
    }),
    AuthModule, // Correctly imported module
    UsersModule, // Correctly imported module
    // HousesModule, // Uncomment when HousesModule is created
  ],
  controllers: [AppController], // Controllers from AuthModule and UsersModule are managed by those modules
  providers: [AppService], // Services from AuthModule and UsersModule are managed by those modules
})
export class AppModule {}
