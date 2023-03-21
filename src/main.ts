import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { GlobalHTTPFilter } from './app.filter';
import { exceptionFactory } from './helpers';
import { useContainer } from 'class-validator';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  app.use(cookieParser());
  app.enableCors({
    credentials: true,
    origin: process.env.FRONTEND_DOMAIN ?? 'http//localhost:3000/',
  });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      exceptionFactory: exceptionFactory,
    }),
  );
  app.useGlobalFilters(new GlobalHTTPFilter());
  const port = process.env.PORT ?? 5000;
  await app.listen(port, () => console.log('Application port: ' + port));
}

bootstrap();
