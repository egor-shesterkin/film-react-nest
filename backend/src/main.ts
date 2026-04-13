import { LoggerService } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DevLogger } from './logger/dev-logger';
import { JsonLogger } from './logger/json-logger';
import { TskvLogger } from './logger/tskv-logger';
import 'dotenv/config';

function createAppLogger(): LoggerService {
  const loggerType = process.env.LOGGER_TYPE?.toLowerCase();

  if (loggerType === 'json') {
    return new JsonLogger();
  }

  if (loggerType === 'tskv') {
    return new TskvLogger();
  }

  return new DevLogger();
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });
  app.setGlobalPrefix('api/afisha');
  app.enableCors({
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });
  app.useLogger(createAppLogger());
  await app.listen(3000);
}
bootstrap();
