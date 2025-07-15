import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('APP_PORT') || 3000;

  // 全局启用 DTO 验证管道
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // 自动剥离请求体中未在 DTO 中定义的属性
    forbidNonWhitelisted: true, // 如果请求体包含未在 DTO 中定义的属性，则抛出错误
    transform: true, // 自动将传入的负载转换为 DTO 类的实例
    transformOptions: {
      enableImplicitConversion: true, // 允许将查询参数和路径参数隐式转换为其 DTO 类型
    },
  }));

  // 启用 CORS (跨源资源共享)，可根据需要进行详细配置
  app.enableCors();

  await app.listen(port);
  console.log(`应用程序正在运行: ${await app.getUrl()}`);
}
bootstrap();
