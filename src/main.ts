import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { GlobalHTTPFilter } from './app.filter';
import { exceptionFactory } from './helpers';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.enableCors({
    credentials: true,
    origin: process.env.FRONTEND_DOMAIN ?? 'http//localhost:3000/',
  });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      stopAtFirstError: true,
      exceptionFactory: exceptionFactory,
    }),
  );
  app.useGlobalFilters(new GlobalHTTPFilter());
  const port = process.env.PORT ?? 5000;
  await app.listen(port, () => console.log('Application port: ' + port));
}

bootstrap();
