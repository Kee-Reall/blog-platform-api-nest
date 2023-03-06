import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as process from 'process';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT ?? 5000;
  app.enableCors({
    credentials: true,
    origin: process.env.FRONTEND_DOMAIN ?? 'http//localhost:3000/',
  });
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(port, () => console.log('Application port: ' + port));
}

bootstrap();
