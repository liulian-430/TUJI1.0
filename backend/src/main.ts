import { NestFactory } from '@nestjs/core';
import { ValidationPipe, INestApplication } from '@nestjs/common';
import { AppModule } from './app.module';
import { seedDatabase } from './seeds/seed';
import { ResponseInterceptor } from './common/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.enableCors({
    origin: ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:8080'],
    credentials: true,
  });
  
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
  }));
  
  app.use(new ResponseInterceptor().use);
  
  app.setGlobalPrefix('api');
  
  await seedDatabase(app);
  
  await app.listen(process.env.PORT || 3000);
  console.log(`🚀 后端服务已启动: http://localhost:${process.env.PORT || 3000}`);
}
bootstrap();
