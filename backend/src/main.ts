import { NestFactory } from '@nestjs/core';
import { ValidationPipe, LogLevel } from '@nestjs/common';
import { AppModule } from './app.module';

function log(msg: string) {
  console.error(msg);
}

async function bootstrap() {
  log('🚀 正在启动后端服务...');
  log('📍 PORT: ' + (process.env.PORT || 3000));
  log('📦 NODE_ENV: ' + process.env.NODE_ENV);

  const logLevels: LogLevel[] = ['error', 'warn', 'log', 'debug', 'verbose'];

  try {
    log('🔧 创建 Nest 应用...');
    const app = await NestFactory.create(AppModule, { logger: logLevels });
    log('✅ Nest 应用创建成功');

    log('🔧 配置 CORS...');
    app.enableCors({ origin: true, credentials: true });

    log('🔧 配置全局管道...');
    app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

    log('🔧 设置全局前缀...');
    app.setGlobalPrefix('api');

    const port = process.env.PORT || 3000;
    log('🔧 启动监听端口: ' + port);
    await app.listen(port, '0.0.0.0');
    log('✅ 后端服务已启动，监听端口: ' + port);
  } catch (err: any) {
    log('❌ 服务启动失败: ' + (err?.message || err));
    log('📋 错误堆栈: ' + err?.stack);
    process.exit(1);
  }
}

bootstrap().catch((err: any) => {
  log('💥 未捕获的启动错误: ' + (err?.message || err));
  process.exit(1);
});
